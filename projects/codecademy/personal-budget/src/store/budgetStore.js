const { Pool } = require('pg');

function createBudgetStore(config = {}) {
  const pool = new Pool({
    connectionString: config.databaseUrl || process.env.DATABASE_URL,
  });

  async function init() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS envelopes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        balance_cents INTEGER NOT NULL CHECK (balance_cents >= 0),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        envelope_id INTEGER NOT NULL REFERENCES envelopes(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL,
        amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
        balance_after_cents INTEGER NOT NULL CHECK (balance_after_cents >= 0),
        note TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const countResult = await pool.query('SELECT COUNT(*)::int AS count FROM envelopes');
    if (countResult.rows[0].count === 0) {
      await pool.query(
        `INSERT INTO envelopes (name, balance_cents)
         VALUES
          ('Rent', 100000),
          ('Groceries', 30000),
          ('Entertainment', 40000)`
      );
    }
  }

  async function list() {
    const result = await pool.query(
      `SELECT id, name, balance_cents, created_at, updated_at
       FROM envelopes
       ORDER BY id`
    );
    return result.rows.map(mapEnvelope);
  }

  async function get(id) {
    const result = await pool.query(
      `SELECT id, name, balance_cents, created_at, updated_at
       FROM envelopes
       WHERE id = $1`,
      [id]
    );
    if (result.rowCount === 0) return null;
    return mapEnvelope(result.rows[0]);
  }

  async function create({ name, balanceCents }) {
    const result = await pool.query(
      `INSERT INTO envelopes (name, balance_cents)
       VALUES ($1, $2)
       RETURNING id, name, balance_cents, created_at, updated_at`,
      [name, balanceCents]
    );
    return mapEnvelope(result.rows[0]);
  }

  async function update(id, patch) {
    const fields = [];
    const values = [];

    if (patch.name !== undefined) {
      values.push(patch.name);
      fields.push(`name = $${values.length}`);
    }
    if (patch.balanceCents !== undefined) {
      values.push(patch.balanceCents);
      fields.push(`balance_cents = $${values.length}`);
    }

    if (fields.length === 0) {
      return get(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE envelopes
       SET ${fields.join(', ')}, updated_at = NOW()
       WHERE id = $${values.length}
       RETURNING id, name, balance_cents, created_at, updated_at`,
      values
    );

    if (result.rowCount === 0) return null;
    return mapEnvelope(result.rows[0]);
  }

  async function remove(id) {
    const result = await pool.query('DELETE FROM envelopes WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  async function deposit(id, amountCents) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const envelopeResult = await client.query(
        `SELECT id, name, balance_cents, created_at, updated_at
         FROM envelopes
         WHERE id = $1
         FOR UPDATE`,
        [id]
      );
      if (envelopeResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      const nextBalance = envelopeResult.rows[0].balance_cents + amountCents;
      const updateResult = await client.query(
        `UPDATE envelopes
         SET balance_cents = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING id, name, balance_cents, created_at, updated_at`,
        [nextBalance, id]
      );

      await client.query(
        `INSERT INTO transactions (envelope_id, type, amount_cents, balance_after_cents, note)
         VALUES ($1, 'deposit', $2, $3, $4)`,
        [id, amountCents, nextBalance, 'Envelope deposit']
      );

      await client.query('COMMIT');
      return mapEnvelope(updateResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async function withdraw(id, amountCents) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const envelopeResult = await client.query(
        `SELECT id, name, balance_cents, created_at, updated_at
         FROM envelopes
         WHERE id = $1
         FOR UPDATE`,
        [id]
      );
      if (envelopeResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      const currentBalance = envelopeResult.rows[0].balance_cents;
      if (currentBalance < amountCents) {
        await client.query('ROLLBACK');
        return 'INSUFFICIENT_FUNDS';
      }

      const nextBalance = currentBalance - amountCents;
      const updateResult = await client.query(
        `UPDATE envelopes
         SET balance_cents = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING id, name, balance_cents, created_at, updated_at`,
        [nextBalance, id]
      );

      await client.query(
        `INSERT INTO transactions (envelope_id, type, amount_cents, balance_after_cents, note)
         VALUES ($1, 'withdraw', $2, $3, $4)`,
        [id, amountCents, nextBalance, 'Envelope withdrawal']
      );

      await client.query('COMMIT');
      return mapEnvelope(updateResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async function transfer({ fromId, toId, amountCents }) {
    if (fromId === toId) return 'SAME_ENVELOPE';

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const ids = [fromId, toId].sort((a, b) => a - b);
      const envelopeResult = await client.query(
        `SELECT id, name, balance_cents, created_at, updated_at
         FROM envelopes
         WHERE id = ANY($1::int[])
         ORDER BY id
         FOR UPDATE`,
        [ids]
      );

      if (envelopeResult.rowCount !== 2) {
        await client.query('ROLLBACK');
        return null;
      }

      const rowById = new Map(envelopeResult.rows.map((row) => [row.id, row]));
      const fromRow = rowById.get(fromId);
      const toRow = rowById.get(toId);

      if (fromRow.balance_cents < amountCents) {
        await client.query('ROLLBACK');
        return 'INSUFFICIENT_FUNDS';
      }

      const fromBalance = fromRow.balance_cents - amountCents;
      const toBalance = toRow.balance_cents + amountCents;

      const fromUpdate = await client.query(
        `UPDATE envelopes
         SET balance_cents = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING id, name, balance_cents, created_at, updated_at`,
        [fromBalance, fromId]
      );

      const toUpdate = await client.query(
        `UPDATE envelopes
         SET balance_cents = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING id, name, balance_cents, created_at, updated_at`,
        [toBalance, toId]
      );

      await client.query(
        `INSERT INTO transactions (envelope_id, type, amount_cents, balance_after_cents, note)
         VALUES
          ($1, 'transfer_out', $2, $3, $4),
          ($5, 'transfer_in', $6, $7, $8)`,
        [
          fromId,
          amountCents,
          fromBalance,
          `Transfer to envelope ${toId}`,
          toId,
          amountCents,
          toBalance,
          `Transfer from envelope ${fromId}`,
        ]
      );

      await client.query('COMMIT');
      return {
        from: mapEnvelope(fromUpdate.rows[0]),
        to: mapEnvelope(toUpdate.rows[0]),
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async function listTransactions(envelopeId) {
    const result = await pool.query(
      `SELECT id, envelope_id, type, amount_cents, balance_after_cents, note, created_at
       FROM transactions
       WHERE envelope_id = $1
       ORDER BY created_at DESC, id DESC`,
      [envelopeId]
    );
    return result.rows.map(mapTransaction);
  }

  async function close() {
    await pool.end();
  }

  return {
    init,
    list,
    get,
    create,
    update,
    delete: remove,
    deposit,
    withdraw,
    transfer,
    listTransactions,
    close,
  };
}

function mapEnvelope(row) {
  return {
    id: row.id,
    name: row.name,
    balanceCents: row.balance_cents,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function mapTransaction(row) {
  return {
    id: row.id,
    envelopeId: row.envelope_id,
    type: row.type,
    amountCents: row.amount_cents,
    balanceAfterCents: row.balance_after_cents,
    note: row.note,
    createdAt: row.created_at.toISOString(),
  };
}

module.exports = { createBudgetStore };

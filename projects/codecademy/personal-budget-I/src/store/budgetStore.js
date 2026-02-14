const fs = require('fs/promises');
const fssync = require('fs');
const path = require('path');

const { ConflictError, NotFoundError } = require('../utils/httpErrors');

class BudgetStore {
  constructor({ filePath }) {
    this.filePath = filePath;
    this.envelopes = new Map();
    this.nextId = 1;

    // Promise chain used as a simple mutex for write operations.
    this._writeQueue = Promise.resolve();
  }

  async init() {
    await this._ensureDirExists();

    if (!fssync.existsSync(this.filePath)) {
      const seed = this._seedData();
      this.nextId = seed.nextId;
      for (const env of seed.envelopes) this.envelopes.set(env.id, env);
      await this._save();
      return;
    }

    const raw = await fs.readFile(this.filePath, 'utf8');
    const parsed = JSON.parse(raw);

    this.nextId = Number(parsed.nextId) || 1;
    this.envelopes.clear();
    for (const env of parsed.envelopes || []) {
      if (env && Number.isInteger(env.id)) this.envelopes.set(env.id, env);
    }
  }

  list() {
    return Array.from(this.envelopes.values()).sort((a, b) => a.id - b.id);
  }

  get(id) {
    return this.envelopes.get(id) || null;
  }

  create({ name, balanceCents }) {
    return this._enqueueWrite(async () => {
      const id = this.nextId++;
      const now = new Date().toISOString();
      const env = {
        id,
        name,
        balanceCents,
        createdAt: now,
        updatedAt: now,
      };
      this.envelopes.set(id, env);
      await this._save();
      return env;
    });
  }

  update(id, patch) {
    return this._enqueueWrite(async () => {
      const env = this.envelopes.get(id);
      if (!env) throw new NotFoundError('Envelope not found');

      if (patch.name !== undefined) env.name = patch.name;
      if (patch.balanceCents !== undefined) env.balanceCents = patch.balanceCents;
      env.updatedAt = new Date().toISOString();

      await this._save();
      return env;
    });
  }

  delete(id) {
    return this._enqueueWrite(async () => {
      const existed = this.envelopes.delete(id);
      if (!existed) throw new NotFoundError('Envelope not found');
      await this._save();
    });
  }

  deposit(id, amountCents) {
    return this._enqueueWrite(async () => {
      const env = this.envelopes.get(id);
      if (!env) throw new NotFoundError('Envelope not found');
      env.balanceCents += amountCents;
      env.updatedAt = new Date().toISOString();
      await this._save();
      return env;
    });
  }

  withdraw(id, amountCents) {
    return this._enqueueWrite(async () => {
      const env = this.envelopes.get(id);
      if (!env) throw new NotFoundError('Envelope not found');
      if (env.balanceCents < amountCents) {
        throw new ConflictError('Insufficient funds in envelope');
      }
      env.balanceCents -= amountCents;
      env.updatedAt = new Date().toISOString();
      await this._save();
      return env;
    });
  }

  transfer({ fromId, toId, amountCents }) {
    return this._enqueueWrite(async () => {
      if (fromId === toId) {
        throw new ConflictError('fromId and toId must be different');
      }

      const from = this.envelopes.get(fromId);
      const to = this.envelopes.get(toId);

      if (!from || !to) throw new NotFoundError('Envelope not found');
      if (from.balanceCents < amountCents) {
        throw new ConflictError('Insufficient funds in origin envelope');
      }

      from.balanceCents -= amountCents;
      to.balanceCents += amountCents;
      const now = new Date().toISOString();
      from.updatedAt = now;
      to.updatedAt = now;

      await this._save();

      return { from, to };
    });
  }

  // --- private ---

  async _ensureDirExists() {
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });
  }

  _seedData() {
    const now = new Date().toISOString();
    const envelopes = [
      { id: 1, name: 'Rent', balanceCents: 100000, createdAt: now, updatedAt: now },
      { id: 2, name: 'Groceries', balanceCents: 30000, createdAt: now, updatedAt: now },
      { id: 3, name: 'Entertainment', balanceCents: 40000, createdAt: now, updatedAt: now },
    ];
    return { nextId: 4, envelopes };
  }

  async _save() {
    // Atomic write: write to temp file, then rename.
    const payload = JSON.stringify(
      {
        nextId: this.nextId,
        envelopes: this.list(),
      },
      null,
      2
    );

    const tmp = `${this.filePath}.tmp`;
    await fs.writeFile(tmp, payload, 'utf8');
    await fs.rename(tmp, this.filePath);
  }

  _enqueueWrite(fn) {
    this._writeQueue = this._writeQueue.then(fn, fn);
    return this._writeQueue;
  }
}

module.exports = { BudgetStore };

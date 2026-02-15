const { fromCents, toCents, isNonNegativeCents } = require('../utils/money');
const { NotFoundError, ValidationError, ConflictError } = require('../utils/httpErrors');

function toEnvelopeDto(env) {
  return {
    id: env.id,
    name: env.name,
    balance: fromCents(env.balanceCents),
    createdAt: env.createdAt,
    updatedAt: env.updatedAt,
  };
}

function toTransactionDto(txn) {
  return {
    id: txn.id,
    envelopeId: txn.envelopeId,
    type: txn.type,
    amount: fromCents(txn.amountCents),
    balanceAfter: fromCents(txn.balanceAfterCents),
    note: txn.note,
    createdAt: txn.createdAt,
  };
}

async function listEnvelopes(req, res, next) {
  try {
    const store = req.app.locals.store;
    const envelopes = (await store.list()).map(toEnvelopeDto);
    const total = envelopes.reduce((sum, e) => sum + e.balance, 0);

    res.status(200).json({
      data: envelopes,
      count: envelopes.length,
      totalBalance: Number(total.toFixed(2)),
    });
  } catch (e) {
    next(e);
  }
}

async function getEnvelope(req, res, next) {
  try {
    const store = req.app.locals.store;
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError('id must be a positive integer');
    }

    const env = await store.get(id);
    if (!env) throw new NotFoundError('Envelope not found');
    res.status(200).json({ data: toEnvelopeDto(env) });
  } catch (e) {
    next(e);
  }
}

async function createEnvelope(req, res, next) {
  try {
    const store = req.app.locals.store;
    const parsed = parseEnvelopeInput(req.body);
    const { name, balance } = parsed;

    const balanceCents = toCents(balance);
    if (!isNonNegativeCents(balanceCents)) {
      throw new ValidationError('balance must be a non-negative number');
    }

    const env = await store.create({ name, balanceCents });
    res.status(201).json({ data: toEnvelopeDto(env) });
  } catch (e) {
    next(e);
  }
}

async function replaceEnvelope(req, res, next) {
  try {
    const store = req.app.locals.store;
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError('id must be a positive integer');
    }

    const parsed = parseEnvelopeInput(req.body);
    const { name, balance } = parsed;

    const balanceCents = toCents(balance);
    if (!isNonNegativeCents(balanceCents)) {
      throw new ValidationError('balance must be a non-negative number');
    }

    const env = await store.update(id, { name, balanceCents });
    if (!env) throw new NotFoundError('Envelope not found');
    res.status(200).json({ data: toEnvelopeDto(env) });
  } catch (e) {
    next(e);
  }
}

async function patchEnvelope(req, res, next) {
  try {
    const store = req.app.locals.store;
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError('id must be a positive integer');
    }

    const patch = parsePatchInput(req.body);

    if (patch.balance !== undefined) {
      const cents = toCents(patch.balance);
      if (!isNonNegativeCents(cents)) {
        throw new ValidationError('balance must be a non-negative number');
      }
      patch.balanceCents = cents;
      delete patch.balance;
    }

    const env = await store.update(id, patch);
    if (!env) throw new NotFoundError('Envelope not found');
    res.status(200).json({ data: toEnvelopeDto(env) });
  } catch (e) {
    next(e);
  }
}

async function deleteEnvelope(req, res, next) {
  try {
    const store = req.app.locals.store;
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError('id must be a positive integer');
    }

    const wasDeleted = await store.delete(id);
    if (!wasDeleted) throw new NotFoundError('Envelope not found');
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

async function createTransaction(req, res, next) {
  try {
    const store = req.app.locals.store;
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError('id must be a positive integer');
    }

    const { type, amount } = parseTransactionInput(req.body);

    const amountCents = toCents(amount);
    if (!isNonNegativeCents(amountCents) || amountCents === 0) {
      throw new ValidationError('amount must be a positive number');
    }

    let env;
    if (type === 'deposit') env = await store.deposit(id, amountCents);
    else {
      env = await store.withdraw(id, amountCents);
      if (env === 'INSUFFICIENT_FUNDS') {
        throw new ConflictError('Insufficient funds in envelope');
      }
    }

    if (!env) throw new NotFoundError('Envelope not found');

    res.status(201).json({ data: toEnvelopeDto(env) });
  } catch (e) {
    next(e);
  }
}

async function listEnvelopeTransactions(req, res, next) {
  try {
    const store = req.app.locals.store;
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError('id must be a positive integer');
    }

    const env = await store.get(id);
    if (!env) throw new NotFoundError('Envelope not found');

    const transactions = await store.listTransactions(id);
    res.status(200).json({
      data: transactions.map(toTransactionDto),
      count: transactions.length,
    });
  } catch (e) {
    next(e);
  }
}

function parseEnvelopeInput(body) {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('request body must be a JSON object');
  }

  const name = body.name ?? body.title;
  const balance = body.balance ?? body.budget;

  if (typeof name !== 'string' || name.trim().length === 0 || name.trim().length > 50) {
    throw new ValidationError('name must be a non-empty string up to 50 characters');
  }

  return { name: name.trim(), balance };
}

function parsePatchInput(body) {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('request body must be a JSON object');
  }

  const patch = {};
  const maybeName = body.name ?? body.title;
  const maybeBalance = body.balance ?? body.budget;

  if (maybeName !== undefined) {
    if (
      typeof maybeName !== 'string' ||
      maybeName.trim().length === 0 ||
      maybeName.trim().length > 50
    ) {
      throw new ValidationError('name must be a non-empty string up to 50 characters');
    }
    patch.name = maybeName.trim();
  }

  if (maybeBalance !== undefined) {
    patch.balance = maybeBalance;
  }

  if (Object.keys(patch).length === 0) {
    throw new ValidationError('Provide at least one field to update');
  }

  return patch;
}

function parseTransactionInput(body) {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('request body must be a JSON object');
  }

  if (body.type !== 'deposit' && body.type !== 'withdraw') {
    throw new ValidationError('type must be deposit or withdraw');
  }

  return { type: body.type, amount: body.amount };
}

module.exports = {
  toEnvelopeDto,
  listEnvelopes,
  getEnvelope,
  createEnvelope,
  replaceEnvelope,
  patchEnvelope,
  deleteEnvelope,
  createTransaction,
  listEnvelopeTransactions,
};

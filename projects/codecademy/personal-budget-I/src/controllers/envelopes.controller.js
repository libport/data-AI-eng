const { fromCents, toCents, isNonNegativeCents } = require('../utils/money');
const { NotFoundError, ValidationError } = require('../utils/httpErrors');

function toEnvelopeDto(env) {
  return {
    id: env.id,
    name: env.name,
    balance: fromCents(env.balanceCents),
    createdAt: env.createdAt,
    updatedAt: env.updatedAt,
  };
}

async function listEnvelopes(req, res, next) {
  try {
    const store = req.app.locals.store;
    const envelopes = store.list().map(toEnvelopeDto);
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
    const id = req.params.id;
    const env = store.get(id);
    if (!env) throw new NotFoundError('Envelope not found');
    res.status(200).json({ data: toEnvelopeDto(env) });
  } catch (e) {
    next(e);
  }
}

async function createEnvelope(req, res, next) {
  try {
    const store = req.app.locals.store;
    const { name, balance } = req.body;

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
    const id = req.params.id;
    const { name, balance } = req.body;

    const balanceCents = toCents(balance);
    if (!isNonNegativeCents(balanceCents)) {
      throw new ValidationError('balance must be a non-negative number');
    }

    const env = await store.update(id, { name, balanceCents });
    res.status(200).json({ data: toEnvelopeDto(env) });
  } catch (e) {
    next(e);
  }
}

async function patchEnvelope(req, res, next) {
  try {
    const store = req.app.locals.store;
    const id = req.params.id;
    const patch = {};

    if (req.body.name !== undefined) patch.name = req.body.name;

    if (req.body.balance !== undefined) {
      const cents = toCents(req.body.balance);
      if (!isNonNegativeCents(cents)) {
        throw new ValidationError('balance must be a non-negative number');
      }
      patch.balanceCents = cents;
    }

    const env = await store.update(id, patch);
    res.status(200).json({ data: toEnvelopeDto(env) });
  } catch (e) {
    next(e);
  }
}

async function deleteEnvelope(req, res, next) {
  try {
    const store = req.app.locals.store;
    const id = req.params.id;
    await store.delete(id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

async function createTransaction(req, res, next) {
  try {
    const store = req.app.locals.store;
    const id = req.params.id;
    const { type, amount } = req.body;

    const amountCents = toCents(amount);
    if (!isNonNegativeCents(amountCents) || amountCents === 0) {
      throw new ValidationError('amount must be a positive number');
    }

    let env;
    if (type === 'deposit') env = await store.deposit(id, amountCents);
    else env = await store.withdraw(id, amountCents);

    res.status(201).json({ data: toEnvelopeDto(env) });
  } catch (e) {
    next(e);
  }
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
};

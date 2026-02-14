const { toCents, isNonNegativeCents, fromCents } = require('../utils/money');
const { ValidationError, ConflictError, NotFoundError } = require('../utils/httpErrors');
const { toEnvelopeDto } = require('./envelopes.controller');

async function createTransfer(req, res, next) {
  try {
    const store = req.app.locals.store;
    const { fromId, toId, amount } = parseTransferInput(req.body);

    const amountCents = toCents(amount);
    if (!isNonNegativeCents(amountCents) || amountCents === 0) {
      throw new ValidationError('amount must be a positive number');
    }

    const result = await store.transfer({ fromId, toId, amountCents });
    if (result === 'SAME_ENVELOPE') {
      throw new ConflictError('fromId and toId must be different');
    }
    if (result === 'INSUFFICIENT_FUNDS') {
      throw new ConflictError('Insufficient funds in origin envelope');
    }
    if (!result) {
      throw new NotFoundError('Envelope not found');
    }

    res.status(201).json({
      data: {
        from: toEnvelopeDto(result.from),
        to: toEnvelopeDto(result.to),
        amount: fromCents(amountCents),
      },
    });
  } catch (e) {
    next(e);
  }
}

function parseTransferInput(body) {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('request body must be a JSON object');
  }

  const fromId = Number(body.fromId);
  const toId = Number(body.toId);

  if (!Number.isInteger(fromId) || fromId <= 0) {
    throw new ValidationError('fromId must be a positive integer');
  }
  if (!Number.isInteger(toId) || toId <= 0) {
    throw new ValidationError('toId must be a positive integer');
  }

  return { fromId, toId, amount: body.amount };
}

module.exports = { createTransfer };

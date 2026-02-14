const { toCents, isNonNegativeCents, fromCents } = require('../utils/money');
const { ValidationError } = require('../utils/httpErrors');
const { toEnvelopeDto } = require('./envelopes.controller');

async function createTransfer(req, res, next) {
  try {
    const store = req.app.locals.store;
    const { fromId, toId, amount } = req.body;

    const amountCents = toCents(amount);
    if (!isNonNegativeCents(amountCents) || amountCents === 0) {
      throw new ValidationError('amount must be a positive number');
    }

    const { from, to } = await store.transfer({ fromId, toId, amountCents });

    res.status(201).json({
      data: {
        from: toEnvelopeDto(from),
        to: toEnvelopeDto(to),
        amount: fromCents(amountCents),
      },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { createTransfer };

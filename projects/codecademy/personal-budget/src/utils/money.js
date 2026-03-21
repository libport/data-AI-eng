/**
 * Money helpers.
 * We store all balances as integer cents to avoid floating point errors.
 */

function toCents(amount) {
  // Accept numbers or numeric strings.
  const n = typeof amount === 'string' ? Number(amount) : amount;
  if (typeof n !== 'number' || !Number.isFinite(n)) return null;

  // Avoid weird negatives like -0.
  const rounded = Math.round(n * 100);
  return rounded;
}

function isNonNegativeCents(cents) {
  return Number.isInteger(cents) && cents >= 0;
}

function fromCents(cents) {
  // Always return a number with 2dp precision.
  return Number((cents / 100).toFixed(2));
}

module.exports = {
  toCents,
  isNonNegativeCents,
  fromCents,
};

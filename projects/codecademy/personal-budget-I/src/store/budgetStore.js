const fs = require('fs/promises');
const path = require('path');

function createBudgetStore(filePath) {
  const state = {
    filePath,
    nextId: 1,
    envelopes: [],
  };

  async function init() {
    await fs.mkdir(path.dirname(state.filePath), { recursive: true });

    try {
      const raw = await fs.readFile(state.filePath, 'utf8');
      const parsed = JSON.parse(raw);
      state.nextId = Number(parsed.nextId) || 1;
      state.envelopes = Array.isArray(parsed.envelopes) ? parsed.envelopes : [];
    } catch (_error) {
      const seed = seedData();
      state.nextId = seed.nextId;
      state.envelopes = seed.envelopes;
      await save();
    }
  }

  function list() {
    return [...state.envelopes].sort((a, b) => a.id - b.id);
  }

  function get(id) {
    return state.envelopes.find((envelope) => envelope.id === id) || null;
  }

  async function create({ name, balanceCents }) {
    const now = new Date().toISOString();
    const envelope = {
      id: state.nextId,
      name,
      balanceCents,
      createdAt: now,
      updatedAt: now,
    };
    state.nextId += 1;
    state.envelopes.push(envelope);
    await save();
    return envelope;
  }

  async function update(id, patch) {
    const envelope = get(id);
    if (!envelope) return null;

    if (patch.name !== undefined) envelope.name = patch.name;
    if (patch.balanceCents !== undefined) envelope.balanceCents = patch.balanceCents;
    envelope.updatedAt = new Date().toISOString();

    await save();
    return envelope;
  }

  async function remove(id) {
    const index = state.envelopes.findIndex((envelope) => envelope.id === id);
    if (index === -1) return false;

    state.envelopes.splice(index, 1);
    await save();
    return true;
  }

  async function deposit(id, amountCents) {
    const envelope = get(id);
    if (!envelope) return null;

    envelope.balanceCents += amountCents;
    envelope.updatedAt = new Date().toISOString();
    await save();
    return envelope;
  }

  async function withdraw(id, amountCents) {
    const envelope = get(id);
    if (!envelope) return null;
    if (envelope.balanceCents < amountCents) return 'INSUFFICIENT_FUNDS';

    envelope.balanceCents -= amountCents;
    envelope.updatedAt = new Date().toISOString();
    await save();
    return envelope;
  }

  async function transfer({ fromId, toId, amountCents }) {
    if (fromId === toId) return 'SAME_ENVELOPE';

    const from = get(fromId);
    const to = get(toId);
    if (!from || !to) return null;
    if (from.balanceCents < amountCents) return 'INSUFFICIENT_FUNDS';

    from.balanceCents -= amountCents;
    to.balanceCents += amountCents;
    const now = new Date().toISOString();
    from.updatedAt = now;
    to.updatedAt = now;

    await save();
    return { from, to };
  }

  async function save() {
    const data = JSON.stringify(
      {
        nextId: state.nextId,
        envelopes: list(),
      },
      null,
      2
    );
    await fs.writeFile(state.filePath, data, 'utf8');
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
  };
}

function seedData() {
  const now = new Date().toISOString();
  const envelopes = [
    { id: 1, name: 'Rent', balanceCents: 100000, createdAt: now, updatedAt: now },
    { id: 2, name: 'Groceries', balanceCents: 30000, createdAt: now, updatedAt: now },
    { id: 3, name: 'Entertainment', balanceCents: 40000, createdAt: now, updatedAt: now },
  ];
  return { nextId: 4, envelopes };
}

module.exports = { createBudgetStore };

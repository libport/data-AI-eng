const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Caption } = require('../models');
const env = require('../config/env');
const cache = require('../services/cache');
const auth = require('../middleware/auth');
const { requireFields } = require('../middleware/validate');
const asyncHandler = require('../middleware/async-handler');

const router = express.Router();
const SALT_ROUNDS = 12;

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at || user.createdAt,
    updatedAt: user.updated_at || user.updatedAt
  };
}

router.get('/', asyncHandler(async (req, res) => {
  const users = await User.findAll({
    order: [['id', 'ASC']],
    attributes: ['id', 'name', 'email', 'created_at', 'updated_at']
  });
  return res.json(users);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const user = await cache.getOrSet(`user:${id}`, () =>
    User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'created_at', 'updated_at'],
      include: [{
        model: Caption,
        as: 'captions',
        attributes: ['id', 'comment', 'photo_id', 'created_at']
      }]
    })
  );

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(user);
}));

router.post('/', requireFields(['name', 'email', 'password']), asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email: String(email).toLowerCase(), password_hash });

  return res.status(201).json(sanitizeUser(user));
}));

router.post('/login', requireFields(['email', 'password']), asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email: String(email).toLowerCase() } });

  if (!user) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }

  const valid = await user.isValidPassword(password);
  if (!valid) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn
  });

  return res.json({
    user: sanitizeUser(user),
    token
  });
}));

router.put('/:id', auth, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  if (req.user.id !== id) {
    return res.status(403).json({ message: 'Not authorized to edit this user' });
  }

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (req.body.name !== undefined) {
    user.name = req.body.name;
  }

  if (req.body.password !== undefined) {
    if (typeof req.body.password !== 'string' || req.body.password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    user.password_hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
  }

  await user.save();
  cache.del(`user:${id}`);

  return res.json(sanitizeUser(user));
}));

module.exports = router;

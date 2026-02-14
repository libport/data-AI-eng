const express = require('express');
const { z } = require('zod');

const { validate } = require('../middleware/validate');
const {
  listEnvelopes,
  getEnvelope,
  createEnvelope,
  replaceEnvelope,
  patchEnvelope,
  deleteEnvelope,
  createTransaction,
} = require('../controllers/envelopes.controller');

const router = express.Router();

const idParamSchema = z.object({
  id: z.preprocess((v) => Number(v), z.number().int().positive()),
});

const envelopeInputSchema = z.preprocess((input) => {
  if (!input || typeof input !== 'object') return input;
  const obj = { ...input };
  if (obj.title && obj.name === undefined) obj.name = obj.title;
  if (obj.budget !== undefined && obj.balance === undefined) obj.balance = obj.budget;
  return obj;
}, z.object({
  name: z.string().trim().min(1).max(50),
  balance: z.number().nonnegative(),
}));

const envelopePatchSchema = z.preprocess((input) => {
  if (!input || typeof input !== 'object') return input;
  const obj = { ...input };
  if (obj.title && obj.name === undefined) obj.name = obj.title;
  if (obj.budget !== undefined && obj.balance === undefined) obj.balance = obj.budget;
  return obj;
}, z.object({
  name: z.string().trim().min(1).max(50).optional(),
  balance: z.number().nonnegative().optional(),
}).refine((v) => v.name !== undefined || v.balance !== undefined, {
  message: 'Provide at least one field to update',
}));

const transactionSchema = z.object({
  type: z.enum(['deposit', 'withdraw']),
  amount: z.number().positive(),
});

/**
 * @swagger
 * tags:
 *   - name: Envelopes
 *     description: Manage budget envelopes
 */

/**
 * @swagger
 * /api/v1/envelopes:
 *   get:
 *     summary: List all envelopes
 *     tags: [Envelopes]
 *     responses:
 *       200:
 *         description: List of envelopes
 */
router.get('/', listEnvelopes);

/**
 * @swagger
 * /api/v1/envelopes:
 *   post:
 *     summary: Create an envelope
 *     tags: [Envelopes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               balance:
 *                 type: number
 *             example:
 *               name: "Scuba lessons"
 *               balance: 300
 *     responses:
 *       201:
 *         description: Created
 *       422:
 *         description: Validation failed
 */
router.post('/', validate(envelopeInputSchema), createEnvelope);

/**
 * @swagger
 * /api/v1/envelopes/{id}:
 *   get:
 *     summary: Get an envelope by id
 *     tags: [Envelopes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Envelope
 *       404:
 *         description: Not found
 */
router.get('/:id', validate(idParamSchema, 'params'), getEnvelope);

/**
 * @swagger
 * /api/v1/envelopes/{id}:
 *   put:
 *     summary: Replace an envelope (full update)
 *     tags: [Envelopes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               balance:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put('/:id', validate(idParamSchema, 'params'), validate(envelopeInputSchema), replaceEnvelope);

/**
 * @swagger
 * /api/v1/envelopes/{id}:
 *   patch:
 *     summary: Update part of an envelope
 *     tags: [Envelopes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               balance:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated
 */
router.patch('/:id', validate(idParamSchema, 'params'), validate(envelopePatchSchema), patchEnvelope);

/**
 * @swagger
 * /api/v1/envelopes/{id}:
 *   delete:
 *     summary: Delete an envelope
 *     tags: [Envelopes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deleted
 */
router.delete('/:id', validate(idParamSchema, 'params'), deleteEnvelope);

/**
 * @swagger
 * /api/v1/envelopes/{id}/transactions:
 *   post:
 *     summary: Deposit or withdraw money from an envelope
 *     tags: [Envelopes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [deposit, withdraw]
 *               amount:
 *                 type: number
 *             example:
 *               type: withdraw
 *               amount: 25.50
 *     responses:
 *       201:
 *         description: Updated envelope
 *       409:
 *         description: Overspend attempt (insufficient funds)
 */
router.post('/:id/transactions', validate(idParamSchema, 'params'), validate(transactionSchema), createTransaction);

module.exports = router;

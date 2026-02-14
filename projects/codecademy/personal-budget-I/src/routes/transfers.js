const express = require('express');

const { createTransfer } = require('../controllers/transfers.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Transfers
 *     description: Move money between envelopes
 */

/**
 * @swagger
 * /api/v1/transfers:
 *   post:
 *     summary: Transfer money between envelopes
 *     tags: [Transfers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromId:
 *                 type: integer
 *               toId:
 *                 type: integer
 *               amount:
 *                 type: number
 *           example:
 *             fromId: 2
 *             toId: 1
 *             amount: 50
 *     responses:
 *       201:
 *         description: Transfer completed
 *       409:
 *         description: Overspend attempt (insufficient funds)
 */
router.post('/', createTransfer);

module.exports = router;

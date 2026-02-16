/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Service is up
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Users list
 *   post:
 *     summary: Register a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: User created
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login and get JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: JWT returned
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user with captions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User details
 *   put:
 *     summary: Update own user profile
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User updated
 */

/**
 * @swagger
 * /photos:
 *   get:
 *     summary: Get all photos
 *     responses:
 *       200:
 *         description: Photos list
 *   post:
 *     summary: Add a photo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, image_path]
 *             properties:
 *               title: { type: string }
 *               image_path: { type: string, example: /images/puffin.jpg }
 *               source: { type: string }
 *     responses:
 *       201:
 *         description: Photo created
 */

/**
 * @swagger
 * /photos/{id}:
 *   get:
 *     summary: Get a photo with captions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Photo details
 */

/**
 * @swagger
 * /captions:
 *   post:
 *     summary: Create caption for a photo
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [photo_id, comment]
 *             properties:
 *               photo_id: { type: integer }
 *               comment: { type: string }
 *     responses:
 *       201:
 *         description: Caption created
 */

/**
 * @swagger
 * /captions/{id}:
 *   get:
 *     summary: Get a caption
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Caption details
 *   put:
 *     summary: Update own caption
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Caption updated
 *   delete:
 *     summary: Delete own caption
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Caption deleted
 */

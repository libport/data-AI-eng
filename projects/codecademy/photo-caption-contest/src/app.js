const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const usersRoutes = require('./routes/users.routes');
const photosRoutes = require('./routes/photos.routes');
const captionsRoutes = require('./routes/captions.routes');
const swaggerSpec = require('./docs/swagger');
const errorHandler = require('./middleware/error-handler');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '20kb' }));
app.use(morgan('dev'));
app.use('/images', express.static('public/images', { maxAge: '1d', etag: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 250,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/users', usersRoutes);
app.use('/photos', photosRoutes);
app.use('/captions', captionsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;

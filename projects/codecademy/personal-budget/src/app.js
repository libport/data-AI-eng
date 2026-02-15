const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const envelopesRouter = require('./routes/envelopes');
const transfersRouter = require('./routes/transfers');
const docsRouter = require('./routes/docs');
const { notFound, errorHandler } = require('./middleware/error');

function createApp(store) {
  const app = express();

  app.disable('x-powered-by');
  app.locals.store = store;

  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(compression());
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api-docs', docsRouter);
  app.use('/api/v1/envelopes', envelopesRouter);
  app.use('/api/v1/transfers', transfersRouter);

  // 404 + error handler
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };

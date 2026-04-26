const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { pool } = require('./db/pool');
const redis = require('./config/redis');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const authRoutes      = require('./routes/auth');
const projectsRoutes  = require('./routes/projects');
const inventoryRoutes = require('./routes/inventory');
const aiRoutes        = require('./routes/ai');
const logsRoutes      = require('./routes/logs');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

app.get('/health', async (req, res) => {
  const db  = await pool.query('SELECT 1').then(() => 'ok').catch(() => 'error');
  const rds = await redis.ping().then(() => 'ok').catch(() => 'error');
  res.json({ status: 'ok', db, redis: rds, uptime: process.uptime() });
});

app.use('/api/v1/auth',      authRoutes);
app.use('/api/v1/projects',  projectsRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/ai',        aiRoutes);
app.use('/api/v1/logs',      logsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

require('dotenv').config();

const app = require('./app');
const redis = require('./config/redis');
const { runMigrations } = require('./db/migrate');
const lowStockWorker = require('./workers/lowstock.worker');

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    console.log('→ 1 connecting Redis...');
    await redis.connect();
    console.log('✓ 2 Redis OK');

    console.log('→ 3 running migrations...');
    await runMigrations();
    console.log('✓ 4 migrations OK');

    console.log('→ 5 starting worker...');
    lowStockWorker.start();
    console.log('✓ 6 worker OK');

    console.log('→ 7 binding port...');
    app.listen(PORT, () => {
      console.log(`✓ Sandy Lab API running on port ${PORT}`);
    });

  } catch (err) {
    console.error('✗ Startup failed at step above:', err.message);
    process.exit(1);
  }
};

start();

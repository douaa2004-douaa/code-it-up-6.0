const cron = require('node-cron');
const { query } = require('../db/pool');

const checkLowStock = async () => {
  const { rows } = await query(
    `SELECT i.id, i.name, i.quantity, i.low_stock_threshold, p.owner_id
     FROM inventory i
     JOIN projects p ON p.id = i.project_id
     WHERE i.low_stock_threshold IS NOT NULL AND i.quantity <= i.low_stock_threshold`
  );

  for (const item of rows) {
    const already = await query(
      `SELECT id FROM notifications
       WHERE user_id = $1 AND title = $2 AND created_at > NOW() - INTERVAL '24 hours'`,
      [item.owner_id, `Low stock: ${item.name}`]
    );
    if (!already.rows.length) {
      await query(
        `INSERT INTO notifications (user_id, title, body, type)
         VALUES ($1,$2,$3,'warning')`,
        [
          item.owner_id,
          `Low stock: ${item.name}`,
          `Only ${item.quantity} ${item.unit || 'units'} remaining (threshold: ${item.low_stock_threshold})`,
        ]
      );
    }
  }
  if (rows.length) console.log(`[CRON] Low-stock alerts sent for ${rows.length} items`);
};

const start = () => {
  cron.schedule('0 * * * *', () => {
    checkLowStock().catch((err) => console.error('[CRON] low-stock error:', err.message));
  });
  console.log('[CRON] Low-stock checker scheduled (every hour)');
};

module.exports = { start };

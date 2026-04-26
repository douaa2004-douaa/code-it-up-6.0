const { query } = require('../db/pool');

const list = async (userId, { page = 1, limit = 20, unread_only }) => {
  const offset = (page - 1) * limit;
  const params = [userId];
  let where = 'WHERE user_id = $1';
  if (unread_only === 'true') { where += ' AND is_read = FALSE'; }
  const { rows } = await query(
    `SELECT * FROM notifications ${where} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );
  return rows;
};

const markRead = async (id, userId) => {
  const { rows } = await query(
    'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
    [id, userId]
  );
  if (!rows.length) throw { status: 404, message: 'Notification not found' };
  return rows[0];
};

const markAllRead = async (userId) => {
  await query('UPDATE notifications SET is_read = TRUE WHERE user_id = $1', [userId]);
};

const create = async (userId, { title, body, type = 'info' }) => {
  const { rows } = await query(
    'INSERT INTO notifications (user_id, title, body, type) VALUES ($1,$2,$3,$4) RETURNING *',
    [userId, title, body, type]
  );
  return rows[0];
};

const remove = async (id, userId) => {
  const { rowCount } = await query(
    'DELETE FROM notifications WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  if (!rowCount) throw { status: 404, message: 'Notification not found' };
};

module.exports = { list, markRead, markAllRead, create, remove };

const { query, getClient } = require('../db/pool');

const list = async (userId, { project_id, page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;
  const params = [userId];
  let join = 'JOIN projects p ON p.id = i.project_id';
  let where = 'WHERE p.owner_id = $1';
  if (project_id) { params.push(project_id); where += ` AND i.project_id = $${params.length}`; }
  const { rows } = await query(
    `SELECT i.* FROM inventory i ${join} ${where}
     ORDER BY i.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );
  return rows;
};

const getOne = async (id, userId) => {
  const { rows } = await query(
    `SELECT i.* FROM inventory i
     JOIN projects p ON p.id = i.project_id
     WHERE i.id = $1 AND p.owner_id = $2`,
    [id, userId]
  );
  if (!rows.length) throw { status: 404, message: 'Item not found' };
  return rows[0];
};

const create = async (userId, data) => {
  const { name, quantity, unit, low_stock_threshold, barcode, supplier, notes, project_id } = data;
  const projectCheck = await query('SELECT id FROM projects WHERE id = $1 AND owner_id = $2', [project_id, userId]);
  if (!projectCheck.rows.length) throw { status: 404, message: 'Project not found' };

  const { rows } = await query(
    `INSERT INTO inventory (project_id, name, quantity, unit, low_stock_threshold, barcode, supplier, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [project_id, name, quantity || 0, unit, low_stock_threshold, barcode, supplier, notes]
  );
  return rows[0];
};

const adjustQuantity = async (id, userId, { delta, reason }) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `SELECT i.* FROM inventory i JOIN projects p ON p.id = i.project_id
       WHERE i.id = $1 AND p.owner_id = $2 FOR UPDATE`,
      [id, userId]
    );
    if (!rows.length) throw { status: 404, message: 'Item not found' };
    const item = rows[0];
    const newQty = parseFloat(item.quantity) + parseFloat(delta);
    if (newQty < 0) throw { status: 400, message: 'Quantity cannot be negative' };

    const updated = await client.query(
      'UPDATE inventory SET quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [newQty, id]
    );
    await client.query(
      'INSERT INTO inventory_history (inventory_id, changed_by, delta, reason) VALUES ($1,$2,$3,$4)',
      [id, userId, delta, reason]
    );
    await client.query('COMMIT');

    const result = updated.rows[0];
    result.low_stock = result.low_stock_threshold && newQty <= result.low_stock_threshold;
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const history = async (id, userId) => {
  await getOne(id, userId);
  const { rows } = await query(
    `SELECT h.*, u.full_name FROM inventory_history h
     LEFT JOIN users u ON u.id = h.changed_by
     WHERE h.inventory_id = $1 ORDER BY h.created_at DESC`,
    [id]
  );
  return rows;
};

const lowStock = async (userId) => {
  const { rows } = await query(
    `SELECT i.* FROM inventory i JOIN projects p ON p.id = i.project_id
     WHERE p.owner_id = $1 AND i.low_stock_threshold IS NOT NULL AND i.quantity <= i.low_stock_threshold`,
    [userId]
  );
  return rows;
};

const remove = async (id, userId) => {
  const { rowCount } = await query(
    `DELETE FROM inventory i USING projects p
     WHERE i.project_id = p.id AND i.id = $1 AND p.owner_id = $2`,
    [id, userId]
  );
  if (!rowCount) throw { status: 404, message: 'Item not found' };
};

module.exports = { list, getOne, create, adjustQuantity, history, lowStock, remove };

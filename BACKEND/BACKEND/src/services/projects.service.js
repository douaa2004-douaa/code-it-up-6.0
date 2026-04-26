const { query } = require('../db/pool');

const list = async (userId, { page = 1, limit = 20, status }) => {
  const offset = (page - 1) * limit;
  const params = [userId];
  let where = 'WHERE owner_id = $1';
  if (status) { params.push(status); where += ` AND status = $${params.length}`; }

  const { rows } = await query(
    `SELECT * FROM projects ${where} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );
  const count = await query(`SELECT COUNT(*) FROM projects ${where}`, params);
  return { projects: rows, total: parseInt(count.rows[0].count), page, limit };
};

const getOne = async (id, userId) => {
  const { rows } = await query(
    'SELECT * FROM projects WHERE id = $1 AND owner_id = $2',
    [id, userId]
  );
  if (!rows.length) throw { status: 404, message: 'Project not found' };
  return rows[0];
};

const create = async (userId, { name, description }) => {
  const { rows } = await query(
    `INSERT INTO projects (owner_id, name, description)
     VALUES ($1, $2, $3) RETURNING *`,
    [userId, name, description]
  );
  return rows[0];
};

const update = async (id, userId, fields) => {
  const allowed = ['name', 'description', 'status'];
  const sets = [];
  const params = [];
  for (const key of allowed) {
    if (fields[key] !== undefined) {
      params.push(fields[key]);
      sets.push(`${key} = $${params.length}`);
    }
  }
  if (!sets.length) throw { status: 400, message: 'No valid fields to update' };
  params.push(id, userId);
  const { rows } = await query(
    `UPDATE projects SET ${sets.join(', ')}, updated_at = NOW()
     WHERE id = $${params.length - 1} AND owner_id = $${params.length} RETURNING *`,
    params
  );
  if (!rows.length) throw { status: 404, message: 'Project not found' };
  return rows[0];
};

const remove = async (id, userId) => {
  const { rowCount } = await query(
    'DELETE FROM projects WHERE id = $1 AND owner_id = $2',
    [id, userId]
  );
  if (!rowCount) throw { status: 404, message: 'Project not found' };
};

module.exports = { list, getOne, create, update, remove };

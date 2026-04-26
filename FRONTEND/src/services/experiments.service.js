const { query } = require('../db/pool');

const list = async (userId, { project_id, status, page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;
  const params = [userId];
  let where = 'WHERE p.owner_id = $1';
  if (project_id) { params.push(project_id); where += ` AND e.project_id = $${params.length}`; }
  if (status)     { params.push(status);     where += ` AND e.status = $${params.length}`; }
  const { rows } = await query(
    `SELECT e.* FROM experiments e JOIN projects p ON p.id = e.project_id
     ${where} ORDER BY e.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );
  return rows;
};

const getOne = async (id, userId) => {
  const { rows } = await query(
    `SELECT e.* FROM experiments e JOIN projects p ON p.id = e.project_id
     WHERE e.id = $1 AND p.owner_id = $2`,
    [id, userId]
  );
  if (!rows.length) throw { status: 404, message: 'Experiment not found' };
  return rows[0];
};

const create = async (userId, { project_id, name, hypothesis }) => {
  const check = await query('SELECT id FROM projects WHERE id = $1 AND owner_id = $2', [project_id, userId]);
  if (!check.rows.length) throw { status: 404, message: 'Project not found' };
  const { rows } = await query(
    `INSERT INTO experiments (project_id, created_by, name, hypothesis)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [project_id, userId, name, hypothesis]
  );
  return rows[0];
};

const updateStatus = async (id, userId, { status, results }) => {
  const fields = ['status = $1', 'updated_at = NOW()'];
  const params = [status];
  if (results) { params.push(results); fields.push(`results = $${params.length}`); }
  if (status === 'running')   { fields.push('started_at = NOW()'); }
  if (status === 'completed' || status === 'failed') { fields.push('completed_at = NOW()'); }
  params.push(id, userId);
  const { rows } = await query(
    `UPDATE experiments e SET ${fields.join(', ')}
     FROM projects p WHERE e.project_id = p.id
     AND e.id = $${params.length - 1} AND p.owner_id = $${params.length} RETURNING e.*`,
    params
  );
  if (!rows.length) throw { status: 404, message: 'Experiment not found' };
  return rows[0];
};

const remove = async (id, userId) => {
  const { rowCount } = await query(
    `DELETE FROM experiments e USING projects p
     WHERE e.project_id = p.id AND e.id = $1 AND p.owner_id = $2`,
    [id, userId]
  );
  if (!rowCount) throw { status: 404, message: 'Experiment not found' };
};

module.exports = { list, getOne, create, updateStatus, remove };

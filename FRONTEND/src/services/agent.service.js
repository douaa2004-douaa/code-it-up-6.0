const { query } = require('../db/pool');
const aiService = require('./ai.service');

const TASK_HANDLERS = {
  inventory_analysis: async (task) => {
    const { rows } = await query(
      `SELECT i.* FROM inventory i WHERE i.project_id = $1`,
      [task.payload.project_id]
    );
    return aiService.analyze(task.user_id, task.payload.project_id, {
      data: rows,
      question: 'Identify patterns, low-stock risks, and reorder suggestions.',
    });
  },
  research: async (task) => {
    return aiService.research(task.user_id, task.payload.project_id, { query: task.payload.query });
  },
  experiment_summary: async (task) => {
    const { rows } = await query('SELECT * FROM experiments WHERE project_id = $1', [task.payload.project_id]);
    return aiService.analyze(task.user_id, task.payload.project_id, {
      data: rows,
      question: 'Summarize experiment outcomes and suggest next steps.',
    });
  },
};

const create = async (userId, { task_type, project_id, payload }) => {
  if (!TASK_HANDLERS[task_type]) throw { status: 400, message: `Unknown task type: ${task_type}` };
  const { rows } = await query(
    `INSERT INTO agent_tasks (user_id, project_id, task_type, payload)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [userId, project_id, task_type, { project_id, ...payload }]
  );
  const task = rows[0];
  runTask(task).catch(() => {});
  return task;
};

const runTask = async (task) => {
  await query(
    `UPDATE agent_tasks SET status = 'running', started_at = NOW(), progress = 10 WHERE id = $1`,
    [task.id]
  );
  try {
    const result = await TASK_HANDLERS[task.task_type](task);
    await query(
      `UPDATE agent_tasks SET status = 'completed', result = $1, progress = 100, completed_at = NOW() WHERE id = $2`,
      [JSON.stringify(result), task.id]
    );
  } catch (err) {
    await query(
      `UPDATE agent_tasks SET status = 'failed', error = $1, completed_at = NOW() WHERE id = $2`,
      [err.message || 'Unknown error', task.id]
    );
  }
};

const list = async (userId, { status, page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;
  const params = [userId];
  let where = 'WHERE user_id = $1';
  if (status) { params.push(status); where += ` AND status = $${params.length}`; }
  const { rows } = await query(
    `SELECT * FROM agent_tasks ${where} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );
  return rows;
};

const getOne = async (id, userId) => {
  const { rows } = await query('SELECT * FROM agent_tasks WHERE id = $1 AND user_id = $2', [id, userId]);
  if (!rows.length) throw { status: 404, message: 'Task not found' };
  return rows[0];
};

module.exports = { create, list, getOne };

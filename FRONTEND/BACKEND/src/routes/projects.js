const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/projects.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(authenticate);

router.get('/', ctrl.list);

router.get('/:id',
  param('id').isInt(),
  validate,
  ctrl.getOne
);

router.post('/',
  body('name').trim().notEmpty().withMessage('Name required'),
  body('description').optional().trim(),
  validate,
  ctrl.create
);

router.put('/:id',
  param('id').isInt(),
  body('name').optional().trim().notEmpty(),
  body('status').optional().isIn(['active','archived','completed']),
  validate,
  ctrl.update
);

router.delete('/:id',
  param('id').isInt(),
  validate,
  ctrl.remove
);

module.exports = router;

const { pool } = require('../db/pool');

router.get('/:id/requirements', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT pr.*, i.name as inventory_name, i.unit, i.quantity as available_quantity
       FROM project_requirements pr
       JOIN inventory i ON i.id = pr.inventory_id
       WHERE pr.project_id = $1`,
      [id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/requirements', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { inventory_id, required_quantity } = req.body;
    const result = await pool.query(
      `INSERT INTO project_requirements (project_id, inventory_id, required_quantity)
       VALUES ($1, $2, $3) RETURNING *`,
      [id, inventory_id, required_quantity]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id/requirements/:req_id', authenticate, async (req, res, next) => {
  try {
    const { id, req_id } = req.params;
    await pool.query(
      `DELETE FROM project_requirements WHERE id = $1 AND project_id = $2`,
      [req_id, id]
    );
    res.json({ success: true, message: 'Requirement removed' });
  } catch (err) {
    next(err);
  }
});

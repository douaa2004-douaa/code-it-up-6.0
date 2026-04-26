const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/inventory.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(authenticate);

router.get('/',          ctrl.list);
router.get('/low-stock', ctrl.lowStock);
router.get('/:id',       param('id').isInt(), validate, ctrl.getOne);
router.get('/:id/history', param('id').isInt(), validate, ctrl.history);

router.post('/',
  body('name').trim().notEmpty(),
  body('project_id').isInt(),
  body('quantity').optional().isNumeric(),
  body('unit').optional().trim(),
  body('low_stock_threshold').optional().isNumeric(),
  validate,
  ctrl.create
);

router.patch('/:id/adjust',
  param('id').isInt(),
  body('delta').isNumeric().withMessage('delta required (positive or negative)'),
  body('reason').optional().trim(),
  validate,
  ctrl.adjust
);

router.delete('/:id', param('id').isInt(), validate, ctrl.remove);

module.exports = router;

const { pool } = require('../db/pool');

router.get('/:id/transactions', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM inventory_transactions
       WHERE inventory_id = $1
       ORDER BY created_at DESC`,
      [id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/transactions', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { change_amount, reason } = req.body;
    const result = await pool.query(
      `INSERT INTO inventory_transactions (inventory_id, change_amount, reason)
       VALUES ($1, $2, $3) RETURNING *`,
      [id, change_amount, reason]
    );
    await pool.query(
      `UPDATE inventory SET quantity = quantity + $1, last_updated = NOW()
       WHERE id = $2`,
      [change_amount, id]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

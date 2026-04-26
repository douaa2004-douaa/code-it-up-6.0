const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/experiments.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(authenticate);

router.get('/',    ctrl.list);
router.get('/:id', param('id').isInt(), validate, ctrl.getOne);

router.post('/',
  body('project_id').isInt(),
  body('name').trim().notEmpty(),
  body('hypothesis').optional().trim(),
  validate,
  ctrl.create
);

router.patch('/:id/status',
  param('id').isInt(),
  body('status').isIn(['draft','running','completed','failed']),
  body('results').optional().isObject(),
  validate,
  ctrl.updateStatus
);

router.delete('/:id', param('id').isInt(), validate, ctrl.remove);

module.exports = router;

const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/agent.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(authenticate);

router.get('/',    ctrl.list);
router.get('/:id', param('id').isInt(), validate, ctrl.getOne);

router.post('/run',
  body('task_type').notEmpty().withMessage('task_type required'),
  body('project_id').optional().isInt(),
  body('payload').optional().isObject(),
  validate,
  ctrl.run
);

module.exports = router;

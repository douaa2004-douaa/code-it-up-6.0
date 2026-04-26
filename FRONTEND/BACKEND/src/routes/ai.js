const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/ai.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(authenticate);

router.get('/logs', ctrl.logs);

router.post('/research',
  body('query').trim().notEmpty().withMessage('query required'),
  body('project_id').optional().isInt(),
  validate,
  ctrl.research
);

router.post('/analyze',
  body('data').notEmpty().withMessage('data required'),
  body('question').trim().notEmpty().withMessage('question required'),
  body('project_id').optional().isInt(),
  validate,
  ctrl.analyze
);

router.post('/generate-task',
  body('context').trim().notEmpty().withMessage('context required'),
  body('project_id').optional().isInt(),
  validate,
  ctrl.generateTask
);

module.exports = router;

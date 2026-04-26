const router = require('express').Router();
const { param } = require('express-validator');
const ctrl = require('../controllers/notifications.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(authenticate);

router.get('/',             ctrl.list);
router.patch('/read-all',   ctrl.markAllRead);
router.patch('/:id/read',   param('id').isInt(), validate, ctrl.markRead);
router.delete('/:id',       param('id').isInt(), validate, ctrl.remove);

module.exports = router;

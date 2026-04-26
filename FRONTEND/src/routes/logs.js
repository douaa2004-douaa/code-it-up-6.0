const express = require('express');
const router = express.Router();

router.use('/agent',         require('./agent'));
router.use('/experiments',   require('./experiments'));
router.use('/notifications', require('./notifications'));

module.exports = router;

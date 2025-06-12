const express = require('express');
const router = express.Router();

const domainRoutes = require('./domain');
const historyRoutes = require('./history');

router.use('/domain', domainRoutes);
router.use('/history', historyRoutes);

module.exports = router; 
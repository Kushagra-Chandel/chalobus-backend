const express = require('express');
const router = express.Router();
const { getBuses, getBusById } = require('../controllers/busController');

router.get('/', getBuses);
router.get('/:id', getBusById);

module.exports = router;

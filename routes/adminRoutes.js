const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Get admin by RFID
router.get('/:rfid', adminController.getByRfid);

// Create new admin
router.post('/', adminController.create);

// Delete admin
router.delete('/:rfid', adminController.delete);

module.exports = router; 
const express = require('express');
const router = express.Router();
const cadetController = require('../controllers/cadetController');

// Get all cadets
router.get('/', cadetController.getAllCadets);

// Get cadet by ID
router.get('/:id', cadetController.getCadetById);

// Get cadet by RFID
router.get('/rfid/:rfid', cadetController.getCadetByRfid);

// Create new cadet
router.post('/', cadetController.createCadet);

// Update cadet
router.put('/:id', cadetController.updateCadet);

// Delete cadet
router.delete('/:id', cadetController.deleteCadet);

module.exports = router; 
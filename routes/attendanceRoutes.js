const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Get attendance by date
router.get('/date/:date', attendanceController.getByDate);

// Get attendance by cadet ID
router.get('/cadet/:cadetId', attendanceController.getByCadetId);

// Create attendance record
router.post('/', attendanceController.create);

// Update attendance status
router.put('/:cadetId/:date', attendanceController.update);

// Get attendance statistics
router.get('/stats/:cadetId', attendanceController.getStats);

module.exports = router; 
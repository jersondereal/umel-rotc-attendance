const Attendance = require('../models/Attendance');

// Get attendance by date
exports.getByDate = async (req, res) => {
    try {
        const attendance = await Attendance.findByDate(req.params.date);
        console.info('[AttendanceController] Attendance fetched for date:', {
            date: req.params.date,
            count: attendance.length,
            timestamp: new Date().toISOString()
        });
        res.json(attendance);
    } catch (error) {
        console.error('[AttendanceController] Error fetching attendance by date:', {
            date: req.params.date,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ message: 'Failed to fetch attendance' });
    }
};

// Get attendance by cadet ID
exports.getByCadetId = async (req, res) => {
    try {
        const attendance = await Attendance.findByCadetId(req.params.cadetId);
        console.info('[AttendanceController] Attendance fetched for cadet:', {
            cadetId: req.params.cadetId,
            count: attendance.length,
            timestamp: new Date().toISOString()
        });
        res.json(attendance);
    } catch (error) {
        console.error('[AttendanceController] Error fetching attendance by cadet:', {
            cadetId: req.params.cadetId,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ message: 'Failed to fetch attendance' });
    }
};

// Create attendance record
exports.create = async (req, res) => {
    try {
        const result = await Attendance.create(req.body);
        console.info('[AttendanceController] New attendance record created:', {
            cadetId: req.body.cadet_id,
            date: req.body.date,
            status: req.body.status,
            timestamp: new Date().toISOString()
        });
        res.status(201).json(result);
    } catch (error) {
        console.error('[AttendanceController] Error creating attendance record:', {
            data: req.body,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ message: 'Failed to create attendance record..' });
    }
};

// Update attendance status
exports.update = async (req, res) => {
    try {
        const result = await Attendance.update(req.params.cadetId, req.params.date, req.body.status);
        if (result.affectedRows === 0) {
            console.warn('[AttendanceController] Attendance record not found for update:', {
                cadetId: req.params.cadetId,
                date: req.params.date,
                timestamp: new Date().toISOString()
            });
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        console.info('[AttendanceController] Attendance record updated:', {
            cadetId: req.params.cadetId,
            date: req.params.date,
            status: req.body.status,
            timestamp: new Date().toISOString()
        });
        res.json(result);
    } catch (error) {
        console.error('[AttendanceController] Error updating attendance record:', {
            cadetId: req.params.cadetId,
            date: req.params.date,
            status: req.body.status,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ message: 'Failed to update attendance record' });
    }
};

// Get attendance statistics
exports.getStats = async (req, res) => {
    try {
        const stats = await Attendance.getStats(req.params.cadetId);
        console.info('[AttendanceController] Statistics fetched for cadet:', {
            cadetId: req.params.cadetId,
            timestamp: new Date().toISOString()
        });
        res.json(stats);
    } catch (error) {
        console.error('[AttendanceController] Error fetching attendance statistics:', {
            cadetId: req.params.cadetId,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ message: 'Failed to fetch attendance statistics' });
    }
}; 
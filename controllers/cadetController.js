const Cadet = require('../models/Cadet');
const Attendance = require('../models/Attendance');

exports.getAllCadets = async (req, res) => {
    try {
        const cadets = await Cadet.findAll();
        res.json(cadets);
    } catch (error) {
        console.error('[CadetController] Error fetching all cadets:', {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ message: 'Failed to fetch cadets' });
    }
};

exports.getCadetById = async (req, res) => {
    try {
        const cadet = await Cadet.findById(req.params.id);
        if (!cadet) {
            console.warn('[CadetController] Cadet not found:', {
                id: req.params.id,
                timestamp: new Date().toISOString()
            });
            return res.status(404).json({ message: 'Cadet not found' });
        }
        res.json(cadet);
    } catch (error) {
        console.error('[CadetController] Error fetching cadet by ID:', {
            id: req.params.id,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ message: 'Failed to fetch cadet' });
    }
};

exports.getCadetByRfid = async (req, res) => {
    try {
        const cadet = await Cadet.findByRfid(req.params.rfid);
        if (!cadet) {
            console.warn('[CadetController] Cadet not found by RFID:', {
                rfid: req.params.rfid,
                timestamp: new Date().toISOString()
            });
            return res.status(404).json({ message: 'Cadet not found' });
        }
        res.json(cadet);
    } catch (error) {
        console.error('[CadetController] Error fetching cadet by RFID:', {
            rfid: req.params.rfid,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ message: 'Failed to fetch cadet' });
    }
};

exports.createCadet = async (req, res) => {
    try {
        // Create cadet
        const result = await Cadet.create(req.body);
        
        // Create attendance record for today
        const today = new Date().toISOString().split('T')[0];
        await Attendance.create({
            cadet_id: req.body.id,
            date: today,
            status: 'absent'
        });

        console.info('[CadetController] New cadet created with attendance record:', {
            id: req.body.id,
            name: req.body.full_name,
            date: today,
            timestamp: new Date().toISOString()
        });
        
        res.status(201).json(result);
    } catch (error) {
        console.error('[CadetController] Error creating cadet:', {
            data: req.body,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ message: 'Failed to create cadet' });
    }
};

exports.updateCadet = async (req, res) => {
    try {
        const result = await Cadet.update(req.params.id, req.body);
        if (result.affectedRows === 0) {
            console.warn('[CadetController] Cadet not found for update:', {
                id: req.params.id,
                timestamp: new Date().toISOString()
            });
            return res.status(404).json({ message: 'Cadet not found' });
        }
        console.info('[CadetController] Cadet updated:', {
            id: req.params.id,
            timestamp: new Date().toISOString()
        });
        res.json(result);
    } catch (error) {
        console.error('[CadetController] Error updating cadet:', {
            id: req.params.id,
            data: req.body,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ message: 'Failed to update cadet' });
    }
};

exports.deleteCadet = async (req, res) => {
    try {
        const result = await Cadet.delete(req.params.id);
        if (result.affectedRows === 0) {
            console.warn('[CadetController] Cadet not found for deletion:', {
                id: req.params.id,
                timestamp: new Date().toISOString()
            });
            return res.status(404).json({ message: 'Cadet not found' });
        }
        console.info('[CadetController] Cadet deleted:', {
            id: req.params.id,
            timestamp: new Date().toISOString()
        });
        res.json(result);
    } catch (error) {
        console.error('[CadetController] Error deleting cadet:', {
            id: req.params.id,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ message: 'Failed to delete cadet' });
    }
}; 
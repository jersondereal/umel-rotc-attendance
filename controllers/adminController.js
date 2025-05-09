const Admin = require('../models/Admin');

exports.authenticateAdmin = async (req, res) => {
    try {
        const { rfid } = req.body;
        const admin = await Admin.findByRfid(rfid);
        if (!admin) {
            return res.status(401).json({ message: 'Invalid RFID' });
        }
        res.json({ message: 'Authentication successful', admin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getByRfid = async (req, res) => {
    try {
        const admin = await Admin.findByRfid(req.params.rfid);
        if (!admin) {
            console.warn('[AdminController] Admin not found by RFID:', {
                rfid: req.params.rfid,
                timestamp: new Date().toISOString()
            });
            return res.status(404).json({ message: 'Admin not found' });
        }
        console.info('[AdminController] Admin found by RFID:', {
            rfid: req.params.rfid,
            timestamp: new Date().toISOString()
        });
        res.json(admin);
    } catch (error) {
        console.error('[AdminController] Error fetching admin by RFID:', {
            rfid: req.params.rfid,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ message: 'Failed to fetch admin' });
    }
};

exports.create = async (req, res) => {
    try {
        const result = await Admin.create(req.body);
        console.info('[AdminController] New admin created:', {
            rfid: req.body.rfid,
            timestamp: new Date().toISOString()
        });
        res.status(201).json(result);
    } catch (error) {
        console.error('[AdminController] Error creating admin:', {
            data: req.body,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ message: 'Failed to create admin' });
    }
};

exports.delete = async (req, res) => {
    try {
        const result = await Admin.delete(req.params.rfid);
        if (result.affectedRows === 0) {
            console.warn('[AdminController] Admin not found for deletion:', {
                rfid: req.params.rfid,
                timestamp: new Date().toISOString()
            });
            return res.status(404).json({ message: 'Admin not found' });
        }
        console.info('[AdminController] Admin deleted:', {
            rfid: req.params.rfid,
            timestamp: new Date().toISOString()
        });
        res.json(result);
    } catch (error) {
        console.error('[AdminController] Error deleting admin:', {
            rfid: req.params.rfid,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ message: 'Failed to delete admin' });
    }
}; 
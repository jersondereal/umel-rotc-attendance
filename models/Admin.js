const db = require('../config/db');

class Admin {
    static async findByRfid(rfid) {
        const [rows] = await db.query(
            'SELECT * FROM admins WHERE rfid = ?',
            [rfid]
        );
        return rows[0];
    }

    static async create(adminData) {
        const { full_name, rfid } = adminData;
        const [result] = await db.query(
            'INSERT INTO admins (full_name, rfid) VALUES (?, ?)',
            [full_name, rfid]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.query(
            'DELETE FROM admins WHERE id = ?',
            [id]
        );
        return result;
    }
}

module.exports = Admin; 
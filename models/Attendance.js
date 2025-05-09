const db = require('../config/db');

class Attendance {
    static async findByDate(date) {
        const [rows] = await db.query(`
            SELECT a.*, c.id as cadet_id, c.rfid, c.full_name, c.course, c.year_section 
            FROM attendance a 
            JOIN cadets c ON a.cadet_id = c.id 
            WHERE a.date = ?
            ORDER BY c.full_name
        `, [date]);
        return rows;
    }

    static async findByCadetId(cadetId) {
        const [rows] = await db.query(`
            SELECT a.*, c.id as cadet_id, c.rfid, c.full_name, c.course, c.year_section 
            FROM attendance a 
            JOIN cadets c ON a.cadet_id = c.id 
            WHERE a.cadet_id = ? 
            ORDER BY a.date DESC
        `, [cadetId]);
        return rows;
    }

    static async create(attendanceData) {
        const { cadet_id, date, status } = attendanceData;
        const [result] = await db.query(
            'INSERT INTO attendance (cadet_id, date, status) VALUES (?, ?, ?)',
            [cadet_id, date, status]
        );
        return result;
    }

    static async update(cadetId, date, status) {
        const [result] = await db.query(
            'UPDATE attendance SET status = ? WHERE cadet_id = ? AND date = ?',
            [status, cadetId, date]
        );
        return result;
    }

    static async getStats(cadetId) {
        const [rows] = await db.query(`
            SELECT 
                COUNT(*) as total_days,
                SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_days,
                SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent_days,
                SUM(CASE WHEN status = 'excused' THEN 1 ELSE 0 END) as excused_days
            FROM attendance 
            WHERE cadet_id = ?
        `, [cadetId]);
        return rows[0];
    }
}

module.exports = Attendance; 
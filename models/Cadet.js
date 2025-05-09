const db = require('../config/db');

class Cadet {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM cadets ORDER BY full_name');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM cadets WHERE id = ?', [id]);
        return rows[0];
    }

    static async findByRfid(rfid) {
        const [rows] = await db.query('SELECT * FROM cadets WHERE rfid = ?', [rfid]);
        return rows[0];
    }

    static async create(cadetData) {
        const { id, rfid, full_name, course, year_section } = cadetData;
        const [result] = await db.query(
            'INSERT INTO cadets (id, rfid, full_name, course, year_section) VALUES (?, ?, ?, ?, ?)',
            [id, rfid, full_name, course, year_section]
        );
        return result;
    }

    static async update(id, cadetData) {
        const { rfid, full_name, course, year_section } = cadetData;
        const [result] = await db.query(
            'UPDATE cadets SET rfid = ?, full_name = ?, course = ?, year_section = ? WHERE id = ?',
            [rfid, full_name, course, year_section, id]
        );
        return result;
    }

    static async delete(id) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Delete attendance records first
            await connection.query('DELETE FROM attendance WHERE cadet_id = ?', [id]);
            
            // Then delete the cadet
            const [result] = await connection.query('DELETE FROM cadets WHERE id = ?', [id]);
            
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = Cadet; 
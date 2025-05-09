-- Create database
CREATE DATABASE IF NOT EXISTS umel_rotc_attendance;
USE umel_rotc_attendance;
-- Create cadets table
CREATE TABLE IF NOT EXISTS cadets (
    id VARCHAR(20) PRIMARY KEY,
    rfid VARCHAR(10) UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    course VARCHAR(50) NOT NULL,
    year_section VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cadet_id VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'excused') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cadet_id) REFERENCES cadets(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (cadet_id, date)
);
-- Create admins table
CREATE TABLE IF NOT EXISTS admins (rfid VARCHAR(10) PRIMARY KEY);
-- Create indexes for better query performance
CREATE INDEX idx_cadet_rfid ON cadets(rfid);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_cadet_date ON attendance(cadet_id, date);
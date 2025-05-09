-- Sample data for cadets table
INSERT INTO cadets (id, rfid, full_name, course, year_section)
VALUES (
        '22-4321',
        '1234567890',
        'John Doe',
        'BSIT',
        '3 - A'
    ),
    (
        '22-4322',
        '2345678901',
        'Jane Smith',
        'BSCS',
        '2 - B'
    ),
    (
        '22-4323',
        '3456789012',
        'Mike Johnson',
        'BSIT',
        '4 - C'
    ),
    (
        '22-4324',
        '4567890123',
        'Sarah Williams',
        'BSCS',
        '1 - A'
    ),
    (
        '22-4325',
        '5678901234',
        'David Brown',
        'BSIT',
        '3 - B'
    ),
    (
        '22-4326',
        '6789012345',
        'Emily Davis',
        'BSCS',
        '2 - A'
    ),
    (
        '22-4327',
        '7890123456',
        'James Wilson',
        'BSIT',
        '4 - A'
    ),
    (
        '22-4328',
        '8901234567',
        'Lisa Anderson',
        'BSCS',
        '1 - B'
    ),
    (
        '22-4329',
        '9012345678',
        'Robert Taylor',
        'BSIT',
        '3 - C'
    ),
    (
        '22-4330',
        '0123456789',
        'Mary Thomas',
        'BSCS',
        '2 - C'
    );
-- Sample attendance data for all cadets for today
INSERT INTO attendance (cadet_id, date, status)
VALUES ('22-4321', CURDATE(), 'present'),
    ('22-4322', CURDATE(), 'present'),
    ('22-4323', CURDATE(), 'absent'),
    ('22-4324', CURDATE(), 'present'),
    ('22-4325', CURDATE(), 'excused'),
    ('22-4326', CURDATE(), 'present'),
    ('22-4327', CURDATE(), 'present'),
    ('22-4328', CURDATE(), 'absent'),
    ('22-4329', CURDATE(), 'present'),
    ('22-4330', CURDATE(), 'present');
-- Sample data for admins table
INSERT INTO admins (rfid)
VALUES ('9999999999'),
    ('8888888888'),
    ('7777777777');
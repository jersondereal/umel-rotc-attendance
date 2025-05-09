const API_BASE_URL = 'http://localhost:3000/api';

// Cadet API calls
const cadetAPI = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/cadets`);
        if (!response.ok) throw new Error('Failed to fetch cadets');
        return response.json();
    },

    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/cadets/${id}`);
        if (!response.ok) throw new Error('Failed to fetch cadet');
        return response.json();
    },

    getByRfid: async (rfid) => {
        const response = await fetch(`${API_BASE_URL}/cadets/rfid/${rfid}`);
        if (!response.ok) throw new Error('Failed to fetch cadet');
        return response.json();
    },

    create: async (cadetData) => {
        const response = await fetch(`${API_BASE_URL}/cadets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cadetData)
        });
        if (!response.ok) throw new Error('Failed to create cadet');
        return response.json();
    },

    update: async (id, cadetData) => {
        const response = await fetch(`${API_BASE_URL}/cadets/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cadetData)
        });
        if (!response.ok) throw new Error('Failed to update cadet');
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/cadets/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete cadet');
        return response.json();
    }
};

// Attendance API calls
const attendanceAPI = {
    getByDate: async (date) => {
        const response = await fetch(`${API_BASE_URL}/attendance/date/${date}`);
        if (!response.ok) throw new Error('Failed to fetch attendance');
        return response.json();
    },

    getByCadetId: async (cadetId) => {
        const response = await fetch(`${API_BASE_URL}/attendance/cadet/${cadetId}`);
        if (!response.ok) throw new Error('Failed to fetch attendance');
        return response.json();
    },

    create: async (attendanceData) => {
        const response = await fetch(`${API_BASE_URL}/attendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(attendanceData)
        });
        if (!response.ok) throw new Error('Failed to create attendance record');
        return response.json();
    },

    update: async (cadetId, date, status) => {
        console.log(cadetId, date, status);
        const response = await fetch(`${API_BASE_URL}/attendance/${cadetId}/${date}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update attendance');
        return response.json();
    },

    getStats: async (cadetId) => {
        const response = await fetch(`${API_BASE_URL}/attendance/stats/${cadetId}`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        return response.json();
    }
};

// Admin API calls
const adminAPI = {
    authenticate: async (rfid) => {
        const response = await fetch(`${API_BASE_URL}/admins/authenticate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rfid })
        });
        if (!response.ok) throw new Error('Authentication failed');
        return response.json();
    },

    create: async (adminData) => {
        const response = await fetch(`${API_BASE_URL}/admins`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adminData)
        });
        if (!response.ok) throw new Error('Failed to create admin');
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/admins/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete admin');
        return response.json();
    }
};

export { adminAPI, attendanceAPI, cadetAPI };


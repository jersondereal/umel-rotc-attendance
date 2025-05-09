import { attendanceAPI, cadetAPI } from './api.js';

// Convert to Manila time
function formatToPHTManual(date) {
    // Convert to Manila time by adding 8 hours
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const pht = new Date(utc + (3600000 * 8));
  
    const year = pht.getFullYear();
    const month = String(pht.getMonth() + 1).padStart(2, '0');
    const day = String(pht.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`; // e.g. '2025-05-09'
}

// Set today's date as default
function setDefaultDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    document.getElementById('attendance-date').value = formattedDate;
}

// Check if selected date is today
function isToday(dateString) {
    const today = new Date();
    const selectedDate = new Date(dateString);
    return today.toDateString() === selectedDate.toDateString();
}

// Handle date change
async function handleDateChange() {
    const dateInput = document.getElementById('attendance-date');
    const markAttendanceInput = document.querySelector('.input-bar:nth-child(3)');
    
    if (!isToday(dateInput.value)) {
        markAttendanceInput.classList.add('disabled');
        markAttendanceInput.querySelector('input').disabled = true;
    } else {
        markAttendanceInput.classList.remove('disabled');
        markAttendanceInput.querySelector('input').disabled = false;
    }

    try {
        // Fetch attendance for the selected date
        let attendance = await attendanceAPI.getByDate(dateInput.value);
        
        // If it's today's date, check for missing records
        if (isToday(dateInput.value)) {
            // Get all cadets
            const cadets = await cadetAPI.getAll();
            
            // Get existing cadet IDs in attendance
            const existingCadetIds = new Set(attendance.map(record => record.cadet_id));
            
            // Find cadets without attendance records
            const missingCadets = cadets.filter(cadet => !existingCadetIds.has(cadet.id));
            
            // Create attendance records for missing cadets
            if (missingCadets.length > 0) {
                for (const cadet of missingCadets) {
                    await attendanceAPI.create({
                        cadet_id: cadet.id,
                        date: dateInput.value,
                        status: 'absent'
                    });
                }
                
                // Fetch the updated attendance records
                attendance = await attendanceAPI.getByDate(dateInput.value);
                
                // Show success message
                showToast(`Added attendance records for ${missingCadets.length} cadets`);
            }
        }
        
        displayAttendance(attendance);
    } catch (error) {
        console.error('Failed to fetch attendance:', error);
        showToast('Failed to fetch attendance', 'error');
    }
}

// Store current attendance data and sort state
let currentAttendanceData = [];
let currentSort = {
    column: 'full_name',
    direction: 'asc'
};

// Display attendance data in the grid
function displayAttendance(attendanceData) {
    currentAttendanceData = attendanceData; // Store the data
    // Sort by name ascending by default
    currentSort = { column: 'full_name', direction: 'asc' };
    filterAndDisplayAttendance(''); // Display all data initially
}

// Sort data based on column and direction
function sortData(data, column, direction) {
    return [...data].sort((a, b) => {
        let valueA = a[column];
        let valueB = b[column];
        
        // Handle status column specially
        if (column === 'status') {
            const statusOrder = { present: 1, excused: 2, absent: 3 };
            valueA = statusOrder[a.status];
            valueB = statusOrder[b.status];
        }
        
        if (direction === 'asc') {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });
}

// Update header sort indicators
function updateHeaderSortIndicators() {
    const headers = document.querySelectorAll('.grid-header > div');
    headers.forEach(header => {
        const column = header.dataset.column;
        if (column === currentSort.column) {
            header.innerHTML = `
                <i class="fas fa-arrow-${currentSort.direction === 'asc' ? 'up' : 'down'}"></i>
                ${header.textContent.replace(/[↑↓]/, '')}
            `;
        } else {
            header.innerHTML = header.textContent.replace(/[↑↓]/, '');
        }
    });
}

// Filter and display attendance data
function filterAndDisplayAttendance(searchTerm) {
    const grid = document.querySelector('.attendance-grid');
    // Clear existing rows except header
    const header = grid.querySelector('.grid-header');
    grid.innerHTML = '';
    grid.appendChild(header);

    // Filter the data
    let filteredData = currentAttendanceData.filter(record => {
        const searchLower = searchTerm.toLowerCase();
        return record.cadet_id.toLowerCase().includes(searchLower) ||
               record.rfid.toLowerCase().includes(searchLower) ||
               record.full_name.toLowerCase().includes(searchLower);
    });

    // Sort the filtered data
    filteredData = sortData(filteredData, currentSort.column, currentSort.direction);

    filteredData.forEach(record => {
        const row = document.createElement('div');
        row.className = 'grid-row';
        row.dataset.rfid = record.rfid;
        row.innerHTML = `
            <div>${record.cadet_id}</div>
            <div>${record.full_name}</div>
            <div>${record.course}</div>
            <div>${record.year_section}</div>
            <div><span class="status ${record.status}">${record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span></div>
            <div class="actions">
                <button class="btn btn-secondary view-btn"><i class="fas fa-chart-column"></i></button>
                <button class="btn btn-secondary edit-btn"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;

        // Add event listeners
        row.querySelector('.view-btn').addEventListener('click', () => showStatsModal(record.cadet_id));
        row.querySelector('.edit-btn').addEventListener('click', () => showEditModal(record));
        row.querySelector('.delete-btn').addEventListener('click', () => showDeleteModal(record));

        grid.appendChild(row);
    });

    // Update sort indicators
    updateHeaderSortIndicators();
}

// Handle header click for sorting
function handleHeaderClick(e) {
    const header = e.target.closest('div');
    if (!header || !header.dataset.column) return;

    const column = header.dataset.column;
    
    // Toggle sort direction if clicking the same column
    if (column === currentSort.column) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.column = column;
        currentSort.direction = 'asc';
    }

    // Re-display the data with new sort
    filterAndDisplayAttendance(document.querySelector('.search-bar input').value);
}

// Modal functions
async function showEditModal(record) {
    const modal = document.getElementById('editModal');
    
    // Fill form with current data
    document.getElementById('editId').value = record.cadet_id;
    document.getElementById('editRfid').value = record.rfid;
    document.getElementById('editName').value = record.full_name;
    document.getElementById('editCourse').value = record.course;
    document.getElementById('editYearSec').value = record.year_section;
    document.getElementById('editStatus').value = record.status;
    
    // Show modal
    modal.style.display = 'flex';
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
}

async function handleEditFormSubmit(e) {
    e.preventDefault();
    
    const cadetData = {
        rfid: document.getElementById('editRfid').value,
        full_name: document.getElementById('editName').value,
        course: document.getElementById('editCourse').value,
        year_section: document.getElementById('editYearSec').value
    };

    const status = document.getElementById('editStatus').value;
    const cadetId = document.getElementById('editId').value;
    const date = document.getElementById('attendance-date').value;

    try {
        await cadetAPI.update(cadetId, cadetData);
        await attendanceAPI.update(cadetId, date, status);
        await handleDateChange(); // Refresh the display
        closeEditModal();
    } catch (error) {
        console.error('Failed to update:', error);
    }
}

// Delete Modal Functionality
function showDeleteModal(record) {
    const deleteModal = document.getElementById('deleteModal');
    document.getElementById('deleteId').textContent = record.cadet_id;
    document.getElementById('deleteName').textContent = record.full_name;
    deleteModal.dataset.cadetId = record.cadet_id;
    deleteModal.style.display = 'flex';
}

async function handleDelete() {
    const deleteModal = document.getElementById('deleteModal');
    const cadetId = deleteModal.dataset.cadetId;

    try {
        await cadetAPI.delete(cadetId);
        showToast('Cadet and all attendance records deleted successfully');
        await handleDateChange(); // Refresh the display
        deleteModal.style.display = 'none';
    } catch (error) {
        console.error('Failed to delete cadet:', error);
        showToast('Failed to delete cadet', 'error');
    }
}

// Add Cadet Modal Functionality
function showAddCadetModal() {
    const addCadetModal = document.getElementById('addCadetModal');
    addCadetModal.style.display = 'flex';
}

function closeAddCadetModal() {
    const addCadetModal = document.getElementById('addCadetModal');
    addCadetModal.style.display = 'none';
    document.getElementById('addCadetForm').reset();
}

async function handleAddCadetFormSubmit(e) {
    e.preventDefault();
    
    const cadetData = {
        id: document.getElementById('addId').value,
        rfid: document.getElementById('addRfid').value,
        full_name: document.getElementById('addName').value,
        course: document.getElementById('addCourse').value,
        year_section: document.getElementById('addYearSec').value
    };

    try {
        // Create the cadet
        await cadetAPI.create(cadetData);
        
        // Get today's date
        const today = formatToPHTManual(new Date());
        
        // Create attendance record for today
        await attendanceAPI.create({
            cadet_id: cadetData.id,
            date: today,
            status: 'absent'
        });
        
        showToast('Cadet added successfully');
        await handleDateChange(); // Refresh the display
        closeAddCadetModal();
    } catch (error) {
        console.error('Failed to add cadet:', error);
        showToast('Failed to add cadet', 'error');
    }
}

// Statistics Modal Functionality
async function showStatsModal(cadetId) {
    try {
        const stats = await attendanceAPI.getStats(cadetId);
        const cadet = await cadetAPI.getById(cadetId);
        
        // Calculate rates
        const totalDays = stats.total_days;
        const attendanceRate = totalDays ? ((stats.present_days / totalDays) * 100).toFixed(1) : 0;
        const absenteeRate = totalDays ? ((stats.absent_days / totalDays) * 100).toFixed(1) : 0;
        
        // Update stats display
        document.getElementById('statsName').textContent = cadet.full_name;
        document.getElementById('statsId').textContent = cadet.id;
        document.getElementById('attendanceRate').textContent = `${attendanceRate}%`;
        document.getElementById('absenteeRate').textContent = `${absenteeRate}%`;
        document.getElementById('presentDays').textContent = stats.present_days;
        document.getElementById('absentDays').textContent = stats.absent_days;
        document.getElementById('excusedDays').textContent = stats.excused_days;
        
        // Show modal
        document.getElementById('statsModal').style.display = 'flex';
    } catch (error) {
        console.error('Failed to fetch stats:', error);
    }
}

function closeStatsModal() {
    document.getElementById('statsModal').style.display = 'none';
}

// Toast functions
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Handle RFID input
async function handleRfidInput(e) {
    if (e.key === 'Enter') {
        const rfidInput = e.target;
        const rfid = rfidInput.value.trim();
        
        if (!rfid) return;

        try {
            // Get cadet by RFID
            const cadet = await cadetAPI.getByRfid(rfid);
            if (!cadet) {
                showToast('Cadet not found', 'error');
                return;
            }

            // Get today's date
            const today = formatToPHTManual(new Date());

            // Update attendance status to present
            const response = await attendanceAPI.update(cadet.id, today, 'present');
            console.log(response);
            
            // Show success message
            showToast(`Attendance marked for ${cadet.full_name}`);
            
            // Clear input
            rfidInput.value = '';
            
            // Refresh attendance display
            await handleDateChange();
        } catch (error) {
            console.error('Failed to process RFID:', error);
            showToast('Failed to process RFID', 'error');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setDefaultDate();
    
    // Add event listener for date changes
    const dateInput = document.getElementById('attendance-date');
    dateInput.addEventListener('change', handleDateChange);
    
    // Add event listener for RFID input
    const rfidInput = document.querySelector('.rfid-input input');
    rfidInput.addEventListener('keypress', handleRfidInput);
    
    // Add event listener for search input
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', (e) => {
        filterAndDisplayAttendance(e.target.value);
    });
    
    // Add event listeners for grid headers
    const gridHeader = document.querySelector('.grid-header');
    gridHeader.addEventListener('click', handleHeaderClick);
    
    // Initial load
    handleDateChange();

    // Add event listeners for modals
    document.getElementById('editForm').addEventListener('submit', handleEditFormSubmit);
    document.getElementById('addCadetForm').addEventListener('submit', handleAddCadetFormSubmit);
    document.querySelector('.delete-confirm-btn').addEventListener('click', handleDelete);
    
    // Add event listeners for modal close buttons
    document.querySelectorAll('.close-btn, .cancel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            modal.style.display = 'none';
        });
    });

    // Add event listener for Add Cadet button
    document.querySelector('.add-cadet-btn').addEventListener('click', showAddCadetModal);

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}); 
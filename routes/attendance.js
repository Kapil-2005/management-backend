const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// @route   POST /api/attendance/mark
// @desc    Mark attendance for an employee
router.post('/mark', async (req, res) => {
    const { employeeId, date, status } = req.body;

    try {
        const employee = await Employee.findById(employeeId);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        // Update the attendance history map
        // Note: Mongoose needs to be notified of changes to Maps if you don't use .set()
        employee.attendanceHistory.set(date, status);

        await employee.save();
        res.json({ message: 'Attendance marked successfully', employee });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/attendance/:employeeId
// @desc    Get attendance history for an employee
router.get('/:employeeId', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.employeeId);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json(employee.attendanceHistory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

/**
 * Leave Routes
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const {
  applyLeave,
  getLeaves,
  getLeave,
  updateLeaveStatus,
  deleteLeave,
  getLeaveStats,
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const applyLeaveValidation = [
  body('leaveType').isIn(['Casual', 'Sick', 'Earned', 'Maternity', 'Paternity', 'Compensatory'])
    .withMessage('Invalid leave type'),
  body('fromDate').isISO8601().withMessage('Valid from date is required'),
  body('toDate').isISO8601().withMessage('Valid to date is required'),
  body('reason').trim().notEmpty().withMessage('Reason is required'),
];

const updateStatusValidation = [
  body('status').isIn(['Approved', 'Rejected']).withMessage('Status must be Approved or Rejected'),
];

// Routes
router.post('/', protect, authorize('faculty'), applyLeaveValidation, validate, applyLeave);
router.get('/', protect, getLeaves);
router.get('/stats', protect, authorize('admin'), getLeaveStats);
router.get('/:id', protect, getLeave);
router.put('/:id/status', protect, authorize('admin'), updateStatusValidation, validate, updateLeaveStatus);
router.delete('/:id', protect, authorize('faculty'), deleteLeave);

module.exports = router;

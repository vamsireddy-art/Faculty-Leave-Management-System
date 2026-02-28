/**
 * User Routes
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getLeaveBalance,
  updateLeaveBalance,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const updateBalanceValidation = [
  body('leaveType').isIn(['Casual', 'Sick', 'Earned', 'Maternity', 'Paternity', 'Compensatory'])
    .withMessage('Invalid leave type'),
  body('total').isInt({ min: 0 }).withMessage('Total must be a positive number'),
];

// Routes
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, getUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.get('/:id/balance', protect, getLeaveBalance);
router.put('/:id/balance', protect, authorize('admin'), updateBalanceValidation, validate, updateLeaveBalance);

module.exports = router;

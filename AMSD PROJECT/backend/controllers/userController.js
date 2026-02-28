/**
 * User Controller
 * Handles user management operations
 */

const User = require('../models/User');
const LeaveBalance = require('../models/LeaveBalance');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
exports.getUsers = async (req, res, next) => {
  try {
    let query = {};

    // Filter by role
    if (req.query.role) {
      query.role = req.query.role;
    }

    // Filter by department
    if (req.query.department) {
      query.department = req.query.department;
    }

    // Filter by active status
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    const users = await User.find(query)
      .populate('department', 'name code')
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single user
 * @route   GET /api/users/:id
 * @access  Private
 */
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('department', 'name code')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private
 */
exports.updateUser = async (req, res, next) => {
  try {
    // Fields that can be updated
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      designation: req.body.designation,
    };

    // Admin can update additional fields
    if (req.user.role === 'admin') {
      if (req.body.department) fieldsToUpdate.department = req.body.department;
      if (req.body.role) fieldsToUpdate.role = req.body.role;
      if (req.body.isActive !== undefined) fieldsToUpdate.isActive = req.body.isActive;
      if (req.body.employeeId) fieldsToUpdate.employeeId = req.body.employeeId;
    }

    // Faculty can only update their own profile
    if (req.user.role === 'faculty' && req.params.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
      }
    ).populate('department', 'name code');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete associated leave balance
    await LeaveBalance.findOneAndDelete({ faculty: user._id });

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's leave balance
 * @route   GET /api/users/:id/balance
 * @access  Private
 */
exports.getLeaveBalance = async (req, res, next) => {
  try {
    // Faculty can only view their own balance
    if (req.user.role === 'faculty' && req.params.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this balance',
      });
    }

    const leaveBalance = await LeaveBalance.findOne({ faculty: req.params.id })
      .populate('faculty', 'name email employeeId');

    if (!leaveBalance) {
      return res.status(404).json({
        success: false,
        message: 'Leave balance not found',
      });
    }

    res.status(200).json({
      success: true,
      leaveBalance,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user's leave balance (Admin only)
 * @route   PUT /api/users/:id/balance
 * @access  Private/Admin
 */
exports.updateLeaveBalance = async (req, res, next) => {
  try {
    const { leaveType, total } = req.body;

    const leaveBalance = await LeaveBalance.findOne({ faculty: req.params.id });

    if (!leaveBalance) {
      return res.status(404).json({
        success: false,
        message: 'Leave balance not found',
      });
    }

    const type = leaveType.toLowerCase();
    if (leaveBalance[type]) {
      leaveBalance[type].total = total;
      leaveBalance[type].available = total - leaveBalance[type].used;
      await leaveBalance.save();
    }

    res.status(200).json({
      success: true,
      message: 'Leave balance updated successfully',
      leaveBalance,
    });
  } catch (error) {
    next(error);
  }
};

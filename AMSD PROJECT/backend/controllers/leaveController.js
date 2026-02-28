/**
 * Leave Controller
 * Handles leave management operations
 */

const Leave = require('../models/Leave');
const LeaveBalance = require('../models/LeaveBalance');
const User = require('../models/User');
const { sendLeaveApplicationNotification, sendLeaveStatusNotification } = require('../utils/notificationService');

/**
 * @desc    Apply for leave
 * @route   POST /api/leaves
 * @access  Private/Faculty
 */
exports.applyLeave = async (req, res, next) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;

    // Get leave balance
    const leaveBalance = await LeaveBalance.findOne({ faculty: req.user.id });

    if (!leaveBalance) {
      return res.status(404).json({
        success: false,
        message: 'Leave balance not found',
      });
    }

    // Calculate number of days
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const timeDiff = to.getTime() - from.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    // Check if sufficient balance
    if (!leaveBalance.hasBalance(leaveType, days)) {
      return res.status(400).json({
        success: false,
        message: `Insufficient ${leaveType} leave balance`,
      });
    }

    // Create leave application
    const leave = await Leave.create({
      faculty: req.user.id,
      leaveType,
      fromDate,
      toDate,
      numberOfDays: days,
      reason,
    });

    // Populate faculty details
    await leave.populate('faculty', 'name email department');

    // Get admin email for notification
    const admin = await User.findOne({ role: 'admin', department: req.user.department });
    
    if (admin) {
      // Send notification to admin
      await sendLeaveApplicationNotification(leave, req.user, admin.email);
    }

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      leave,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all leaves (Admin: all, Faculty: own)
 * @route   GET /api/leaves
 * @access  Private
 */
exports.getLeaves = async (req, res, next) => {
  try {
    let query = {};

    // If faculty, show only own leaves
    if (req.user.role === 'faculty') {
      query.faculty = req.user.id;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by leave type
    if (req.query.leaveType) {
      query.leaveType = req.query.leaveType;
    }

    // Filter by date range
    if (req.query.fromDate && req.query.toDate) {
      query.fromDate = { $gte: new Date(req.query.fromDate) };
      query.toDate = { $lte: new Date(req.query.toDate) };
    }

    const leaves = await Leave.find(query)
      .populate('faculty', 'name email department employeeId')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single leave
 * @route   GET /api/leaves/:id
 * @access  Private
 */
exports.getLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('faculty', 'name email department employeeId phone')
      .populate('reviewedBy', 'name email');

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave not found',
      });
    }

    // Check authorization
    if (req.user.role === 'faculty' && leave.faculty._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this leave',
      });
    }

    res.status(200).json({
      success: true,
      leave,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update leave status (Approve/Reject)
 * @route   PUT /api/leaves/:id/status
 * @access  Private/Admin
 */
exports.updateLeaveStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    const leave = await Leave.findById(req.params.id).populate('faculty', 'name email');

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave not found',
      });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Leave already processed',
      });
    }

    // Update leave status
    leave.status = status;
    leave.reviewedBy = req.user.id;
    leave.reviewedAt = Date.now();

    if (status === 'Rejected' && rejectionReason) {
      leave.rejectionReason = rejectionReason;
    }

    await leave.save();

    // If approved, update leave balance
    if (status === 'Approved') {
      const leaveBalance = await LeaveBalance.findOne({ faculty: leave.faculty._id });
      if (leaveBalance) {
        leaveBalance.updateBalance(leave.leaveType, leave.numberOfDays);
        await leaveBalance.save();
      }
    }

    // Send notification to faculty
    await sendLeaveStatusNotification(leave, leave.faculty, status);

    res.status(200).json({
      success: true,
      message: `Leave ${status.toLowerCase()} successfully`,
      leave,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete leave (only pending leaves by owner)
 * @route   DELETE /api/leaves/:id
 * @access  Private/Faculty
 */
exports.deleteLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave not found',
      });
    }

    // Check authorization
    if (leave.faculty.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this leave',
      });
    }

    // Only pending leaves can be deleted
    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete processed leave',
      });
    }

    await leave.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Leave deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get leave statistics
 * @route   GET /api/leaves/stats
 * @access  Private/Admin
 */
exports.getLeaveStats = async (req, res, next) => {
  try {
    const year = req.query.year || new Date().getFullYear();

    const stats = await Leave.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            status: '$status',
            leaveType: '$leaveType',
          },
          count: { $sum: 1 },
          totalDays: { $sum: '$numberOfDays' },
        },
      },
      {
        $sort: { '_id.month': 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

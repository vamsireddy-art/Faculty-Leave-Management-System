/**
 * Leave Model
 * Stores leave application information
 */

const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Faculty reference is required'],
  },
  leaveType: {
    type: String,
    enum: ['Casual', 'Sick', 'Earned', 'Maternity', 'Paternity', 'Compensatory'],
    required: [true, 'Leave type is required'],
  },
  fromDate: {
    type: Date,
    required: [true, 'From date is required'],
  },
  toDate: {
    type: Date,
    required: [true, 'To date is required'],
  },
  numberOfDays: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Validate dates
leaveSchema.pre('validate', function (next) {
  if (this.fromDate && this.toDate) {
    if (this.fromDate > this.toDate) {
      return next(new Error('From date cannot be after To date'));
    }
    
    // Calculate number of days
    const timeDiff = this.toDate.getTime() - this.fromDate.getTime();
    this.numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  }
  next();
});

// Update timestamp on save
leaveSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
leaveSchema.index({ faculty: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Leave', leaveSchema);

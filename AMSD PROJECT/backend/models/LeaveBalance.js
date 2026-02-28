/**
 * LeaveBalance Model
 * Stores leave balance information for each faculty member
 */

const mongoose = require('mongoose');

const leaveBalanceSchema = new mongoose.Schema({
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  year: {
    type: Number,
    default: () => new Date().getFullYear(),
  },
  casual: {
    total: { type: Number, default: 12 },
    used: { type: Number, default: 0 },
    available: { type: Number, default: 12 },
  },
  sick: {
    total: { type: Number, default: 12 },
    used: { type: Number, default: 0 },
    available: { type: Number, default: 12 },
  },
  earned: {
    total: { type: Number, default: 15 },
    used: { type: Number, default: 0 },
    available: { type: Number, default: 15 },
  },
  maternity: {
    total: { type: Number, default: 180 },
    used: { type: Number, default: 0 },
    available: { type: Number, default: 180 },
  },
  paternity: {
    total: { type: Number, default: 15 },
    used: { type: Number, default: 0 },
    available: { type: Number, default: 15 },
  },
  compensatory: {
    total: { type: Number, default: 10 },
    used: { type: Number, default: 0 },
    available: { type: Number, default: 10 },
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

// Method to update leave balance
leaveBalanceSchema.methods.updateBalance = function (leaveType, days) {
  const type = leaveType.toLowerCase();
  if (this[type]) {
    this[type].used += days;
    this[type].available = this[type].total - this[type].used;
  }
};

// Method to check if sufficient balance exists
leaveBalanceSchema.methods.hasBalance = function (leaveType, days) {
  const type = leaveType.toLowerCase();
  return this[type] && this[type].available >= days;
};

// Update timestamp on save
leaveBalanceSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('LeaveBalance', leaveBalanceSchema);

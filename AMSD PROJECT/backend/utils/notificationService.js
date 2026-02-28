/**
 * Notification Service
 * Handles creating and sending notifications
 */

const Notification = require('../models/Notification');
const sendEmail = require('../config/email');

/**
 * Create notification
 * @param {Object} data - Notification data
 */
exports.createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error.message);
    throw error;
  }
};

/**
 * Send leave application notification to admin
 * @param {Object} leave - Leave object
 * @param {Object} faculty - Faculty object
 */
exports.sendLeaveApplicationNotification = async (leave, faculty, adminEmail) => {
  try {
    // Create notification in database
    await this.createNotification({
      recipient: leave.reviewedBy || null,
      sender: faculty._id,
      type: 'leave_applied',
      title: 'New Leave Application',
      message: `${faculty.name} has applied for ${leave.leaveType} leave from ${leave.fromDate.toDateString()} to ${leave.toDate.toDateString()}`,
      relatedLeave: leave._id,
    });

    // Send email notification
    const emailOptions = {
      to: adminEmail,
      subject: 'New Leave Application - FLMS',
      html: `
        <h2>New Leave Application</h2>
        <p><strong>Faculty:</strong> ${faculty.name}</p>
        <p><strong>Leave Type:</strong> ${leave.leaveType}</p>
        <p><strong>From:</strong> ${leave.fromDate.toDateString()}</p>
        <p><strong>To:</strong> ${leave.toDate.toDateString()}</p>
        <p><strong>Days:</strong> ${leave.numberOfDays}</p>
        <p><strong>Reason:</strong> ${leave.reason}</p>
        <p>Please login to the system to review this application.</p>
      `,
    };

    await sendEmail(emailOptions);
  } catch (error) {
    console.error('Error sending leave application notification:', error.message);
  }
};

/**
 * Send leave status notification to faculty
 * @param {Object} leave - Leave object
 * @param {Object} faculty - Faculty object
 * @param {String} status - Leave status (Approved/Rejected)
 */
exports.sendLeaveStatusNotification = async (leave, faculty, status) => {
  try {
    const type = status === 'Approved' ? 'leave_approved' : 'leave_rejected';
    const title = status === 'Approved' ? 'Leave Approved' : 'Leave Rejected';
    
    let message = `Your ${leave.leaveType} leave application for ${leave.numberOfDays} days has been ${status.toLowerCase()}`;
    
    if (status === 'Rejected' && leave.rejectionReason) {
      message += `. Reason: ${leave.rejectionReason}`;
    }

    // Create notification in database
    await this.createNotification({
      recipient: faculty._id,
      sender: leave.reviewedBy,
      type,
      title,
      message,
      relatedLeave: leave._id,
    });

    // Send email notification
    const emailOptions = {
      to: faculty.email,
      subject: `Leave ${status} - FLMS`,
      html: `
        <h2>Leave Application ${status}</h2>
        <p>Dear ${faculty.name},</p>
        <p>Your leave application has been <strong>${status.toLowerCase()}</strong>.</p>
        <p><strong>Leave Type:</strong> ${leave.leaveType}</p>
        <p><strong>From:</strong> ${leave.fromDate.toDateString()}</p>
        <p><strong>To:</strong> ${leave.toDate.toDateString()}</p>
        <p><strong>Days:</strong> ${leave.numberOfDays}</p>
        ${status === 'Rejected' && leave.rejectionReason ? `<p><strong>Reason:</strong> ${leave.rejectionReason}</p>` : ''}
      `,
    };

    await sendEmail(emailOptions);
  } catch (error) {
    console.error('Error sending leave status notification:', error.message);
  }
};

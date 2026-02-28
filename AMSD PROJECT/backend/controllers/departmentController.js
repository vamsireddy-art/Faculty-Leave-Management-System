/**
 * Department Controller
 * Handles department management operations
 */

const Department = require('../models/Department');
const User = require('../models/User');

/**
 * @desc    Get all departments
 * @route   GET /api/departments
 * @access  Private
 */
exports.getDepartments = async (req, res, next) => {
  try {
    let query = {};

    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    const departments = await Department.find(query)
      .populate('hod', 'name email')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single department
 * @route   GET /api/departments/:id
 * @access  Private
 */
exports.getDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('hod', 'name email phone');

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    // Get faculty count
    const facultyCount = await User.countDocuments({ department: department._id });

    res.status(200).json({
      success: true,
      department: {
        ...department.toObject(),
        facultyCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create department
 * @route   POST /api/departments
 * @access  Private/Admin
 */
exports.createDepartment = async (req, res, next) => {
  try {
    const { name, code, hod, description } = req.body;

    const department = await Department.create({
      name,
      code,
      hod,
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      department,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update department
 * @route   PUT /api/departments/:id
 * @access  Private/Admin
 */
exports.updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('hod', 'name email');

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      department,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete department
 * @route   DELETE /api/departments/:id
 * @access  Private/Admin
 */
exports.deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    // Check if department has users
    const userCount = await User.countDocuments({ department: department._id });

    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete department with existing users',
      });
    }

    await department.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

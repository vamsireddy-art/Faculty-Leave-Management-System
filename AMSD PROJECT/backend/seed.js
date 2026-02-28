/**
 * Database Seeder
 * Creates initial test data for the application
 * Run this file once to populate the database with test users
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Department = require('./models/Department');
const LeaveBalance = require('./models/LeaveBalance');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Department.deleteMany({});
    await LeaveBalance.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create Department
    console.log('📁 Creating department...');
    const department = await Department.create({
      name: 'Computer Science',
      code: 'CS',
      description: 'Department of Computer Science and Engineering',
    });
    console.log('✅ Department created:', department.name);

    // Create Admin User
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@flms.com',
      password: 'admin123', // Will be hashed automatically
      role: 'admin',
      department: department._id,
      phone: '+1234567890',
      designation: 'Head of Department',
      employeeId: 'ADMIN001',
      isActive: true,
    });
    console.log('✅ Admin user created');
    console.log('   Email: admin@flms.com');
    console.log('   Password: admin123');

    // Create Admin Leave Balance
    await LeaveBalance.create({
      faculty: admin._id,
      year: new Date().getFullYear(),
    });
    console.log('✅ Admin leave balance created');

    // Create Faculty User
    console.log('👤 Creating faculty user...');
    const faculty = await User.create({
      name: 'Faculty User',
      email: 'faculty@flms.com',
      password: 'faculty123', // Will be hashed automatically
      role: 'faculty',
      department: department._id,
      phone: '+1234567891',
      designation: 'Assistant Professor',
      employeeId: 'FAC001',
      isActive: true,
    });
    console.log('✅ Faculty user created');
    console.log('   Email: faculty@flms.com');
    console.log('   Password: faculty123');

    // Create Faculty Leave Balance
    await LeaveBalance.create({
      faculty: faculty._id,
      year: new Date().getFullYear(),
    });
    console.log('✅ Faculty leave balance created');

    // Create another Faculty User
    console.log('👤 Creating second faculty user...');
    const faculty2 = await User.create({
      name: 'John Doe',
      email: 'john.doe@flms.com',
      password: 'john123', // Will be hashed automatically
      role: 'faculty',
      department: department._id,
      phone: '+1234567892',
      designation: 'Associate Professor',
      employeeId: 'FAC002',
      isActive: true,
    });
    console.log('✅ Second faculty user created');
    console.log('   Email: john.doe@flms.com');
    console.log('   Password: john123');

    // Create Leave Balance for second faculty
    await LeaveBalance.create({
      faculty: faculty2._id,
      year: new Date().getFullYear(),
    });
    console.log('✅ Second faculty leave balance created');

    // Update department HOD
    department.hod = admin._id;
    await department.save();
    console.log('✅ Department HOD updated');

    console.log('\n===========================================');
    console.log('🎉 Database seeding completed successfully!');
    console.log('===========================================\n');
    console.log('📝 Test Credentials:\n');
    console.log('ADMIN:');
    console.log('  Email: admin@flms.com');
    console.log('  Password: admin123\n');
    console.log('FACULTY 1:');
    console.log('  Email: faculty@flms.com');
    console.log('  Password: faculty123\n');
    console.log('FACULTY 2:');
    console.log('  Email: john.doe@flms.com');
    console.log('  Password: john123\n');
    console.log('===========================================\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run seeder
const runSeeder = async () => {
  await connectDB();
  await seedDatabase();
};

runSeeder();

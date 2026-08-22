const mongoose = require('mongoose');
const User = require('./models/User');
const EmployeeProfile = require('./models/EmployeeProfile');
const Attendance = require('./models/Attendance');
const LeaveRequest = require('./models/LeaveRequest');
const Payroll = require('./models/Payroll');
const dotenv = require('dotenv');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await EmployeeProfile.deleteMany({});
    await Attendance.deleteMany({});
    await LeaveRequest.deleteMany({});
    await Payroll.deleteMany({});

    console.log('Cleared existing data');

    // Create Admin
    const admin = await User.create({
      employeeId: 'ADMIN001',
      email: 'admin@hrms.com',
      password: 'admin123',
      role: 'hr',
      isEmailVerified: true
    });

    const adminProfile = await EmployeeProfile.create({
      user: admin._id,
      firstName: 'System',
      lastName: 'Admin',
      jobTitle: 'HR Manager',
      department: 'Human Resources',
      hireDate: new Date('2020-01-01'),
      salary: 75000,
      salaryStructure: {
        basic: 50000,
        allowances: 15000,
        deductions: 5000
      }
    });

    admin.profile = adminProfile._id;
    await admin.save();

    // Create Sample Employees
    const employees = [];
    for (let i = 1; i <= 5; i++) {
      const employee = await User.create({
        employeeId: `EMP${String(i).padStart(3, '0')}`,
        email: `employee${i}@hrms.com`,
        password: 'employee123',
        role: 'employee',
        isEmailVerified: true
      });

      const profile = await EmployeeProfile.create({
        user: employee._id,
        firstName: `Employee${i}`,
        lastName: `Last${i}`,
        jobTitle: ['Software Developer', 'Designer', 'Manager', 'Analyst', 'Tester'][i-1],
        department: ['Engineering', 'Design', 'Management', 'Analytics', 'QA'][i-1],
        hireDate: new Date(2023, i, 1),
        salary: 50000 + (i * 5000),
        salaryStructure: {
          basic: 30000 + (i * 3000),
          allowances: 12000 + (i * 1000),
          deductions: 2000 + (i * 200)
        }
      });

      employee.profile = profile._id;
      await employee.save();
      employees.push(employee);
    }

    // Create Sample Attendance
    const today = new Date();
    for (let emp of employees) {
      await Attendance.create({
        user: emp._id,
        date: today,
        checkIn: new Date(today.setHours(9, 0, 0)),
        checkOut: new Date(today.setHours(17, 0, 0)),
        status: 'present',
        remarks: 'Regular attendance'
      });

      // Add some past attendance
      const pastDate = new Date(today);
      pastDate.setDate(pastDate.getDate() - 1);
      await Attendance.create({
        user: emp._id,
        date: pastDate,
        checkIn: new Date(pastDate.setHours(9, 30, 0)),
        checkOut: new Date(pastDate.setHours(17, 30, 0)),
        status: 'present',
        remarks: 'Regular attendance'
      });
    }

    // Create Sample Leave Requests
    for (let emp of employees) {
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() + 10);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 2);

      await LeaveRequest.create({
        user: emp._id,
        leaveType: ['paid', 'sick', 'unpaid'][Math.floor(Math.random() * 3)],
        startDate: startDate,
        endDate: endDate,
        remarks: 'Sample leave request',
        status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)]
      });
    }

    // Create Sample Payroll
    const currentMonth = new Date().toISOString().slice(0, 7);
    for (let emp of employees) {
      const basic = 30000 + Math.floor(Math.random() * 20000);
      const allowances = 10000 + Math.floor(Math.random() * 10000);
      const deductions = 2000 + Math.floor(Math.random() * 3000);
      
      await Payroll.create({
        user: emp._id,
        month: currentMonth,
        basicSalary: basic,
        allowances: allowances,
        deductions: deductions,
        totalSalary: basic + allowances - deductions,
        status: 'processed'
      });
    }

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Sample Data Created:');
    console.log(`   - 1 Admin User (admin@hrms.com / admin123)`);
    console.log(`   - 5 Employee Users (employee1@hrms.com / employee123)`);
    console.log(`   - Attendance records for all employees`);
    console.log(`   - Leave requests for all employees`);
    console.log(`   - Payroll records for all employees`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
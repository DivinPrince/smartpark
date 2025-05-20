import 'dotenv/config';
import { db } from './index.js';
import { users, department, employee, salary } from './schema.js';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Seed admin user
    const existingAdmin = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, 'admin@gmail.com')
    });
    
    if (!existingAdmin) {
      // Hash the admin password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Insert admin user
      await db.insert(users).values({
        name: 'Administrator',
        email: 'admin@gmail.com',
        password: hashedPassword
      });
      
      console.log('✅ Admin user created successfully');
    } else {
      console.log('ℹ️ Admin user already exists, skipping creation');
    }
    
    // Seed departments
    const departmentData = [
      { departpentName: 'Human Resources', grossSalary: '500000' },
      { departpentName: 'Engineering', grossSalary: '800000' },
      { departpentName: 'Marketing', grossSalary: '600000' },
      { departpentName: 'Finance', grossSalary: '750000' }
    ];
    
    for (const dept of departmentData) {
      // Check if department exists
      const existingDept = await db.query.department.findFirst({
        where: (department, { eq }) => eq(department.departpentName, dept.departpentName)
      });
      
      if (!existingDept) {
        await db.insert(department).values(dept);
        console.log(`✅ Department "${dept.departpentName}" created successfully`);
      } else {
        console.log(`ℹ️ Department "${dept.departpentName}" already exists, skipping creation`);
      }
    }
    
    // Get department IDs for reference
    const departments = await db.select().from(department);
    
    // Seed employees (if departments exist)
    if (departments.length > 0) {
      const employeeData = [
        {
          departmentCode: departments[0].departmentCode,
          firstName: 'John',
          lastName: 'Doe',
          position: 'HR Manager',
          address: '123 Main St',
          telephone: '555-1234',
          gender: 'Male',
          hiredDate: new Date('2020-01-15')
        },
        {
          departmentCode: departments[1].departmentCode,
          firstName: 'Jane',
          lastName: 'Smith',
          position: 'Senior Developer',
          address: '456 Tech Ave',
          telephone: '555-5678',
          gender: 'Female',
          hiredDate: new Date('2019-06-20')
        },
        {
          departmentCode: departments[2].departmentCode,
          firstName: 'Michael',
          lastName: 'Johnson',
          position: 'Marketing Specialist',
          address: '789 Brand Blvd',
          telephone: '555-9012',
          gender: 'Male',
          hiredDate: new Date('2021-03-10')
        }
      ];
      
      for (const emp of employeeData) {
        // Check if employee exists by name and department
        const existingEmp = await db.query.employee.findFirst({
          where: (employee, { eq, and }) => 
            and(
              eq(employee.firstName, emp.firstName),
              eq(employee.lastName, emp.lastName),
              eq(employee.departmentCode, emp.departmentCode)
            )
        });
        
        if (!existingEmp) {
          // Insert employee
          const result = await db.insert(employee).values(emp);
          console.log(`✅ Employee "${emp.firstName} ${emp.lastName}" created successfully`);
          
          // Get the employee ID
          const empId = result.insertId || (Array.isArray(result) && result[0]?.insertId) || result[0]?.id || result;
          
          // Create salary entry for the employee
          const salaryData = {
            employeeNumber: empId,
            totalDeduction: '10000',
            grossSalary: 75000,
            netSalary: 65000
          };
          
          await db.insert(salary).values(salaryData);
          console.log(`✅ Salary for "${emp.firstName} ${emp.lastName}" created successfully`);
        } else {
          console.log(`ℹ️ Employee "${emp.firstName} ${emp.lastName}" already exists, skipping creation`);
        }
      }
    }
    
    console.log('✅ Seeding completed successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed(); 
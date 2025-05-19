import { db } from "../../db/index.js";
import { employee, department, salary } from "../../db/schema.js";
import { eq, and } from "drizzle-orm";

export class EmployeeService {
  async getAllEmployees() {
    try {
      // Fetch employees and departments separately
      const employees = await db.select().from(employee);
      const departments = await db.select().from(department);
      
      // Manually join employees with their departments
      const enrichedEmployees = employees.map(emp => {
        const empDepartment = departments.find(dept => 
          dept.departmentCode === emp.departmentCode
        );
        
        return {
          ...emp,
          department: empDepartment || null
        };
      });
      
      return enrichedEmployees;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw new Error("Failed to fetch employees");
    }
  }

  async getEmployeeById(employeeNumber) {
    try {
      // Fetch the employee
      const emp = await db.select().from(employee)
        .where(eq(employee.employeeNumber, employeeNumber))
        .limit(1);
      
      if (!emp || emp.length === 0) {
        return null;
      }
      
      // Fetch the department
      const dept = await db.select().from(department)
        .where(eq(department.departmentCode, emp[0].departmentCode))
        .limit(1);
      
      // Return employee with department
      return {
        ...emp[0],
        department: dept[0] || null
      };
    } catch (error) {
      console.error(`Error fetching employee ${employeeNumber}:`, error);
      throw new Error("Failed to fetch employee");
    }
  }

  async createEmployee(employeeData) {
    try {
      // Verify department exists
      const departmentExists = await db.select().from(department)
        .where(eq(department.departmentCode, employeeData.departmentCode))
        .limit(1);
      
      if (!departmentExists || departmentExists.length === 0) {
        throw new Error("Department does not exist");
      }
      
      // Process date properly - convert string date to Date object
      const processedData = {
        ...employeeData,
        hiredDate: employeeData.hiredDate ? new Date(employeeData.hiredDate) : new Date()
      };
      
      const result = await db.insert(employee).values(processedData);
      
      // Get the employee ID
      const employeeNumber = result.insertId || 
                            (Array.isArray(result) && result[0]?.insertId) || 
                            result[0]?.employeeNumber || 
                            result;
      
      // Fetch the inserted employee
      const newEmployee = await this.getEmployeeById(employeeNumber);
      return newEmployee;
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  }

  async updateEmployee(employeeNumber, employeeData) {
    try {
      // If department code is being updated, verify it exists
      if (employeeData.departmentCode) {
        const departmentExists = await db.select().from(department)
          .where(eq(department.departmentCode, employeeData.departmentCode))
          .limit(1);
        
        if (!departmentExists || departmentExists.length === 0) {
          throw new Error("Department does not exist");
        }
      }
      
      // Process date properly if it's being updated
      const processedData = { ...employeeData };
      if (employeeData.hiredDate) {
        processedData.hiredDate = new Date(employeeData.hiredDate);
      }
      
      await db.update(employee)
        .set(processedData)
        .where(eq(employee.employeeNumber, employeeNumber));
      
      // Fetch and return the updated employee
      const updatedEmployee = await this.getEmployeeById(employeeNumber);
      return updatedEmployee;
    } catch (error) {
      console.error(`Error updating employee ${employeeNumber}:`, error);
      throw error;
    }
  }

  async deleteEmployee(employeeNumber) {
    try {
      // Check if employee has salary records before deletion
      const hasSalaryRecords = await db.select().from(salary)
        .where(eq(salary.employeeNumber, employeeNumber))
        .limit(1);
      
      if (hasSalaryRecords && hasSalaryRecords.length > 0) {
        throw new Error("Cannot delete employee with salary records");
      }
      
      await db.delete(employee)
        .where(eq(employee.employeeNumber, employeeNumber));
      
      return true;
    } catch (error) {
      console.error(`Error deleting employee ${employeeNumber}:`, error);
      throw error;
    }
  }

  async getEmployeesByDepartment(departmentCode) {
    try {
      const employees = await db.select().from(employee)
        .where(eq(employee.departmentCode, departmentCode));
      
      return employees;
    } catch (error) {
      console.error(`Error fetching employees for department ${departmentCode}:`, error);
      throw new Error("Failed to fetch department employees");
    }
  }
  
  async getEmployeeSalary(employeeNumber) {
    try {
      const salaryData = await db.select().from(salary)
        .where(eq(salary.employeeNumber, employeeNumber))
        .limit(1);
      
      return salaryData[0] || null;
    } catch (error) {
      console.error(`Error fetching salary for employee ${employeeNumber}:`, error);
      throw new Error("Failed to fetch employee salary");
    }
  }
}
import { db } from "../../db/index.js";
import { salary, employee } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export class SalaryService {
  async getAllSalaries() {
    try {
      // Fetch salaries and employees separately
      const salaries = await db.select().from(salary);
      const employees = await db.select().from(employee);
      
      // Manually join salaries with their employees
      const enrichedSalaries = salaries.map(sal => {
        const emp = employees.find(e => e.employeeNumber === sal.employeeNumber);
        
        return {
          ...sal,
          employee: emp || null
        };
      });
      
      return enrichedSalaries;
    } catch (error) {
      console.error("Error fetching salaries:", error);
      throw new Error("Failed to fetch salaries");
    }
  }

  async getSalaryById(id) {
    try {
      // Fetch the salary
      const salaryData = await db.select().from(salary)
        .where(eq(salary.id, id))
        .limit(1);
      
      if (!salaryData || salaryData.length === 0) {
        return null;
      }
      
      // Fetch the employee
      const emp = await db.select().from(employee)
        .where(eq(employee.employeeNumber, salaryData[0].employeeNumber))
        .limit(1);
      
      // Return salary with employee data
      return {
        ...salaryData[0],
        employee: emp[0] || null
      };
    } catch (error) {
      console.error(`Error fetching salary ${id}:`, error);
      throw new Error("Failed to fetch salary");
    }
  }

  async getSalaryByEmployeeNumber(employeeNumber) {
    try {
      // Fetch the salary
      const salaryData = await db.select().from(salary)
        .where(eq(salary.employeeNumber, employeeNumber))
        .limit(1);
      
      if (!salaryData || salaryData.length === 0) {
        return null;
      }
      
      // Fetch the employee
      const emp = await db.select().from(employee)
        .where(eq(employee.employeeNumber, employeeNumber))
        .limit(1);
      
      // Return salary with employee data
      return {
        ...salaryData[0],
        employee: emp[0] || null
      };
    } catch (error) {
      console.error(`Error fetching salary for employee ${employeeNumber}:`, error);
      throw new Error("Failed to fetch employee salary");
    }
  }

  async createSalary(salaryData) {
    try {
      // Verify employee exists
      const employeeExists = await db.select().from(employee)
        .where(eq(employee.employeeNumber, salaryData.employeeNumber))
        .limit(1);
      
      if (!employeeExists || employeeExists.length === 0) {
        throw new Error("Employee does not exist");
      }
      
      // Check if salary record already exists for this employee
      const existingSalary = await this.getSalaryByEmployeeNumber(salaryData.employeeNumber);
      
      if (existingSalary) {
        throw new Error("Salary record already exists for this employee");
      }
      
      // Calculate net salary
      const netSalary = salaryData.grossSalary - parseFloat(salaryData.totalDeduction);
      
      // Insert with calculated net salary
      const result = await db.insert(salary).values({
        ...salaryData,
        netSalary
      });
      
      // Get the salary ID
      const salaryId = result.insertId || 
                       (Array.isArray(result) && result[0]?.insertId) || 
                       result[0]?.id || 
                       result;
      
      // Fetch the inserted salary
      const newSalary = await this.getSalaryById(salaryId);
      return newSalary;
    } catch (error) {
      console.error("Error creating salary:", error);
      throw error;
    }
  }

  async updateSalary(id, salaryData) {
    try {
      // If employee number is being updated, verify employee exists
      if (salaryData.employeeNumber) {
        const employeeExists = await db.select().from(employee)
          .where(eq(employee.employeeNumber, salaryData.employeeNumber))
          .limit(1);
        
        if (!employeeExists || employeeExists.length === 0) {
          throw new Error("Employee does not exist");
        }
        
        // Check if salary record already exists for this employee (if changing employee)
        const existingSalary = await this.getSalaryByEmployeeNumber(salaryData.employeeNumber);
        
        if (existingSalary && existingSalary.id !== id) {
          throw new Error("Salary record already exists for this employee");
        }
      }
      
      // Get current salary data to calculate new net salary
      const currentSalary = await this.getSalaryById(id);
      if (!currentSalary) {
        throw new Error("Salary record not found");
      }
      
      const updateData = { ...salaryData };
      
      // Recalculate net salary if either gross salary or deduction changes
      if (salaryData.grossSalary !== undefined || salaryData.totalDeduction !== undefined) {
        const grossSalary = salaryData.grossSalary ?? currentSalary.grossSalary;
        const totalDeduction = salaryData.totalDeduction ?? currentSalary.totalDeduction;
        
        updateData.netSalary = grossSalary - parseFloat(totalDeduction);
      }
      
      await db.update(salary)
        .set(updateData)
        .where(eq(salary.id, id));
      
      // Fetch and return the updated salary
      const updatedSalary = await this.getSalaryById(id);
      return updatedSalary;
    } catch (error) {
      console.error(`Error updating salary ${id}:`, error);
      throw error;
    }
  }

  async deleteSalary(id) {
    try {
      await db.delete(salary)
        .where(eq(salary.id, id));
      
      return true;
    } catch (error) {
      console.error(`Error deleting salary ${id}:`, error);
      throw error;
    }
  }
} 
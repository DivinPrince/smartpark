import { db } from "../../db/index.js";
import { employee, department, salary } from "../../db/schema.js";
import { eq, sql, count, sum, avg, min, max } from "drizzle-orm";

export class ReportsService {
  // Get department summary (employee count, avg salary, etc.)
  async getDepartmentSummary() {
    try {
      // First get all departments
      const departments = await db.select().from(department);
      
      // For each department, get stats
      const results = await Promise.all(
        departments.map(async (dept) => {
          // Get employees in department
          const employees = await db.select().from(employee)
            .where(eq(employee.departmentCode, dept.departmentCode));
          
          // Get employee IDs for salary calculations
          const employeeIds = employees.map(emp => emp.employeeNumber);
          
          // Get salary stats if there are employees
          let salaryStats = {
            avgGrossSalary: 0,
            avgNetSalary: 0,
            totalGrossSalary: 0,
            totalNetSalary: 0
          };
          
          if (employeeIds.length > 0) {
            // Get all salaries for employees in this department
            const salaries = await db.select().from(salary)
              .where(sql`${salary.employeeNumber} IN (${employeeIds.join(',')})`);
            
            if (salaries.length > 0) {
              // Calculate salary statistics
              const grossSalaries = salaries.map(s => Number(s.grossSalary));
              const netSalaries = salaries.map(s => Number(s.netSalary));
              
              salaryStats = {
                avgGrossSalary: grossSalaries.reduce((a, b) => a + b, 0) / grossSalaries.length,
                avgNetSalary: netSalaries.reduce((a, b) => a + b, 0) / netSalaries.length,
                totalGrossSalary: grossSalaries.reduce((a, b) => a + b, 0),
                totalNetSalary: netSalaries.reduce((a, b) => a + b, 0)
              };
            }
          }
          
          return {
            department: dept,
            employeeCount: employees.length,
            ...salaryStats
          };
        })
      );
      
      return results;
    } catch (error) {
      console.error("Error generating department summary report:", error);
      throw new Error("Failed to generate department summary report");
    }
  }
  
  // Get salary distribution report
  async getSalaryDistribution() {
    try {
      // Get all salaries
      const salaries = await db.select().from(salary);
      
      // Define salary ranges
      const ranges = [
        { min: 0, max: 10000, count: 0 },
        { min: 10001, max: 20000, count: 0 },
        { min: 20001, max: 30000, count: 0 },
        { min: 30001, max: 40000, count: 0 },
        { min: 40001, max: 50000, count: 0 },
        { min: 50001, max: Infinity, count: 0 }
      ];
      
      // Categorize salaries
      salaries.forEach(sal => {
        const grossSalary = Number(sal.grossSalary);
        const range = ranges.find(r => grossSalary >= r.min && grossSalary <= r.max);
        if (range) {
          range.count++;
        }
      });
      
      return {
        totalEmployees: salaries.length,
        ranges
      };
    } catch (error) {
      console.error("Error generating salary distribution report:", error);
      throw new Error("Failed to generate salary distribution report");
    }
  }
  
  // Get gender distribution report
  async getGenderDistribution() {
    try {
      // Get all employees
      const employees = await db.select().from(employee);
      
      // Count by gender
      const genderCounts = {
        male: 0,
        female: 0,
        other: 0
      };
      
      employees.forEach(emp => {
        const gender = emp.gender.toLowerCase();
        if (gender === 'male') {
          genderCounts.male++;
        } else if (gender === 'female') {
          genderCounts.female++;
        } else {
          genderCounts.other++;
        }
      });
      
      return {
        totalEmployees: employees.length,
        distribution: genderCounts
      };
    } catch (error) {
      console.error("Error generating gender distribution report:", error);
      throw new Error("Failed to generate gender distribution report");
    }
  }
  
  // Get employee tenure report
  async getEmployeeTenure() {
    try {
      // Get all employees
      const employees = await db.select().from(employee);
      
      // Define tenure ranges (in years)
      const ranges = [
        { min: 0, max: 0.0833, count: 0, employees: [] }, // Less than a month (0.0833 years = 1 month)
        { min: 0.0833, max: 1, count: 0, employees: [] }, // 1 month to 1 year
        { min: 1, max: 3, count: 0, employees: [] },
        { min: 3, max: 5, count: 0, employees: [] },
        { min: 5, max: 10, count: 0, employees: [] },
        { min: 10, max: Infinity, count: 0, employees: [] }
      ];
      
      // Calculate tenure for each employee
      const today = new Date();
      
      employees.forEach(emp => {
        const hiredDate = new Date(emp.hiredDate);
        const tenureYears = (today - hiredDate) / (1000 * 60 * 60 * 24 * 365.25);
        
        const range = ranges.find(r => tenureYears >= r.min && tenureYears < r.max);
        if (range) {
          range.count++;
          range.employees.push({
            employeeNumber: emp.employeeNumber,
            name: `${emp.firstName} ${emp.lastName}`,
            hiredDate: emp.hiredDate,
            tenureYears: parseFloat(tenureYears.toFixed(1))
          });
        }
      });
      
      return {
        totalEmployees: employees.length,
        ranges: ranges.map(({ min, max, count, employees }, index) => ({ 
          range: index === 0 ? 'Less than a month' : 
                 index === 1 ? '1 month - 1 year' :
                 `${min}-${max === Infinity ? '+' : max} years`,
          count,
          employees
        }))
      };
    } catch (error) {
      console.error("Error generating employee tenure report:", error);
      throw new Error("Failed to generate employee tenure report");
    }
  }
} 
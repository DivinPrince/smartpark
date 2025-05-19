import { db } from "../../db/index.js";
import { department, employee } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export class DepartmentService {
  async getAllDepartments() {
    try {
      const departments = await db.query.department.findMany();
      return departments;
    } catch (error) {
      console.error("Error fetching departments:", error);
      throw new Error("Failed to fetch departments");
    }
  }

  async getDepartmentById(departmentCode) {
    try {
      const dept = await db.query.department.findFirst({
        where: eq(department.departmentCode, departmentCode),
      });
      
      return dept;
    } catch (error) {
      console.error(`Error fetching department ${departmentCode}:`, error);
      throw new Error("Failed to fetch department");
    }
  }

  async createDepartment(departmentData) {
    try {
      const result = await db.insert(department).values(departmentData);
      
      // Get the department ID (handling different driver formats)
      const departmentCode = result.insertId || 
                           (Array.isArray(result) && result[0]?.insertId) || 
                           result[0]?.departmentCode || 
                           result;
      
      // Fetch the inserted department
      const newDepartment = await this.getDepartmentById(departmentCode);
      return newDepartment;
    } catch (error) {
      console.error("Error creating department:", error);
      throw new Error("Failed to create department");
    }
  }

  async updateDepartment(departmentCode, departmentData) {
    try {
      await db.update(department)
        .set(departmentData)
        .where(eq(department.departmentCode, departmentCode));
      
      // Fetch and return the updated department
      const updatedDepartment = await this.getDepartmentById(departmentCode);
      return updatedDepartment;
    } catch (error) {
      console.error(`Error updating department ${departmentCode}:`, error);
      throw new Error("Failed to update department");
    }
  }

  async deleteDepartment(departmentCode) {
    try {
      // Check if department has employees before deletion
      const hasEmployees = await db.query.employee.findFirst({
        where: eq(employee.departmentCode, departmentCode)
      });
      
      if (hasEmployees) {
        throw new Error("Cannot delete department with assigned employees");
      }
      
      await db.delete(department)
        .where(eq(department.departmentCode, departmentCode));
      
      return true;
    } catch (error) {
      console.error(`Error deleting department ${departmentCode}:`, error);
      throw error;
    }
  }

  async getDepartmentEmployees(departmentCode) {
    try {
      const employees = await db.query.employee.findMany({
        where: eq(employee.departmentCode, departmentCode)
      });
      
      return employees;
    } catch (error) {
      console.error(`Error fetching employees for department ${departmentCode}:`, error);
      throw new Error("Failed to fetch department employees");
    }
  }
}

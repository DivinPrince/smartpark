import { departmentService } from "./department.module.js";

export class DepartmentController {
  async getAllDepartments(req, res) {
    try {
      const departments = await departmentService.getAllDepartments();
      return res.status(200).json(departments);
    } catch (error) {
      console.error("Error in getAllDepartments controller:", error);
      return res.status(500).json({ message: error.message || "Failed to fetch departments" });
    }
  }

  async getDepartmentById(req, res) {
    try {
      const departmentCode = parseInt(req.params.id);
      
      if (isNaN(departmentCode)) {
        return res.status(400).json({ message: "Invalid department code" });
      }
      
      const department = await departmentService.getDepartmentById(departmentCode);
      
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
      
      return res.status(200).json(department);
    } catch (error) {
      console.error("Error in getDepartmentById controller:", error);
      return res.status(500).json({ message: error.message || "Failed to fetch department" });
    }
  }

  async createDepartment(req, res) {
    try {
      const { departpentName, grossSalary } = req.body;
      
      if (!departpentName || !grossSalary) {
        return res.status(400).json({ message: "Department name and gross salary are required" });
      }
      
      const newDepartment = await departmentService.createDepartment({
        departpentName,
        grossSalary
      });
      
      return res.status(201).json(newDepartment);
    } catch (error) {
      console.error("Error in createDepartment controller:", error);
      return res.status(500).json({ message: error.message || "Failed to create department" });
    }
  }

  async updateDepartment(req, res) {
    try {
      const departmentCode = parseInt(req.params.id);
      
      if (isNaN(departmentCode)) {
        return res.status(400).json({ message: "Invalid department code" });
      }
      
      const { departpentName, grossSalary } = req.body;
      
      // Check if department exists
      const existingDepartment = await departmentService.getDepartmentById(departmentCode);
      
      if (!existingDepartment) {
        return res.status(404).json({ message: "Department not found" });
      }
      
      const updateData = {};
      if (departpentName) updateData.departpentName = departpentName;
      if (grossSalary) updateData.grossSalary = grossSalary;
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No valid update fields provided" });
      }
      
      const updatedDepartment = await departmentService.updateDepartment(
        departmentCode, 
        updateData
      );
      
      return res.status(200).json(updatedDepartment);
    } catch (error) {
      console.error("Error in updateDepartment controller:", error);
      return res.status(500).json({ message: error.message || "Failed to update department" });
    }
  }

  async deleteDepartment(req, res) {
    try {
      const departmentCode = parseInt(req.params.id);
      
      if (isNaN(departmentCode)) {
        return res.status(400).json({ message: "Invalid department code" });
      }
      
      // Check if department exists
      const existingDepartment = await departmentService.getDepartmentById(departmentCode);
      
      if (!existingDepartment) {
        return res.status(404).json({ message: "Department not found" });
      }
      
      await departmentService.deleteDepartment(departmentCode);
      
      return res.status(200).json({ message: "Department deleted successfully" });
    } catch (error) {
      console.error("Error in deleteDepartment controller:", error);
      
      if (error.message === "Cannot delete department with assigned employees") {
        return res.status(400).json({ message: error.message });
      }
      
      return res.status(500).json({ message: error.message || "Failed to delete department" });
    }
  }

  async getDepartmentEmployees(req, res) {
    try {
      const departmentCode = parseInt(req.params.id);
      
      if (isNaN(departmentCode)) {
        return res.status(400).json({ message: "Invalid department code" });
      }
      
      // Check if department exists
      const existingDepartment = await departmentService.getDepartmentById(departmentCode);
      
      if (!existingDepartment) {
        return res.status(404).json({ message: "Department not found" });
      }
      
      const employees = await departmentService.getDepartmentEmployees(departmentCode);
      
      return res.status(200).json(employees);
    } catch (error) {
      console.error("Error in getDepartmentEmployees controller:", error);
      return res.status(500).json({ message: error.message || "Failed to fetch department employees" });
    }
  }
}

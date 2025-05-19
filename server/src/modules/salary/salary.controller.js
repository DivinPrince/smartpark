import { salaryService } from "./salary.module.js";

export class SalaryController {
  async getAllSalaries(req, res) {
    try {
      const salaries = await salaryService.getAllSalaries();
      return res.status(200).json(salaries);
    } catch (error) {
      console.error("Error in getAllSalaries controller:", error);
      return res.status(500).json({ message: error.message || "Failed to fetch salaries" });
    }
  }

  async getSalaryById(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid salary ID" });
      }
      
      const salaryData = await salaryService.getSalaryById(id);
      
      if (!salaryData) {
        return res.status(404).json({ message: "Salary record not found" });
      }
      
      return res.status(200).json(salaryData);
    } catch (error) {
      console.error("Error in getSalaryById controller:", error);
      return res.status(500).json({ message: error.message || "Failed to fetch salary" });
    }
  }

  async getSalaryByEmployeeNumber(req, res) {
    try {
      const employeeNumber = parseInt(req.params.employeeNumber);
      
      if (isNaN(employeeNumber)) {
        return res.status(400).json({ message: "Invalid employee number" });
      }
      
      const salaryData = await salaryService.getSalaryByEmployeeNumber(employeeNumber);
      
      if (!salaryData) {
        return res.status(404).json({ message: "Salary record not found for this employee" });
      }
      
      return res.status(200).json(salaryData);
    } catch (error) {
      console.error("Error in getSalaryByEmployeeNumber controller:", error);
      return res.status(500).json({ message: error.message || "Failed to fetch employee salary" });
    }
  }

  async createSalary(req, res) {
    try {
      const { 
        employeeNumber, 
        totalDeduction, 
        grossSalary 
      } = req.body;
      
      // Validate required fields
      if (!employeeNumber || totalDeduction === undefined || grossSalary === undefined) {
        return res.status(400).json({ message: "Employee number, total deduction, and gross salary are required" });
      }
      
      const newSalary = await salaryService.createSalary({
        employeeNumber: parseInt(employeeNumber),
        totalDeduction,
        grossSalary: parseInt(grossSalary)
      });
      
      return res.status(201).json(newSalary);
    } catch (error) {
      console.error("Error in createSalary controller:", error);
      
      if (error.message === "Employee does not exist" || 
          error.message === "Salary record already exists for this employee") {
        return res.status(400).json({ message: error.message });
      }
      
      return res.status(500).json({ message: error.message || "Failed to create salary" });
    }
  }

  async updateSalary(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid salary ID" });
      }
      
      // Check if salary exists
      const existingSalary = await salaryService.getSalaryById(id);
      
      if (!existingSalary) {
        return res.status(404).json({ message: "Salary record not found" });
      }
      
      const { 
        employeeNumber, 
        totalDeduction, 
        grossSalary 
      } = req.body;
      
      const updateData = {};
      if (employeeNumber) updateData.employeeNumber = parseInt(employeeNumber);
      if (totalDeduction !== undefined) updateData.totalDeduction = totalDeduction;
      if (grossSalary !== undefined) updateData.grossSalary = parseInt(grossSalary);
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No valid update fields provided" });
      }
      
      const updatedSalary = await salaryService.updateSalary(id, updateData);
      
      return res.status(200).json(updatedSalary);
    } catch (error) {
      console.error("Error in updateSalary controller:", error);
      
      if (error.message === "Employee does not exist" || 
          error.message === "Salary record already exists for this employee") {
        return res.status(400).json({ message: error.message });
      }
      
      return res.status(500).json({ message: error.message || "Failed to update salary" });
    }
  }

  async deleteSalary(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid salary ID" });
      }
      
      // Check if salary exists
      const existingSalary = await salaryService.getSalaryById(id);
      
      if (!existingSalary) {
        return res.status(404).json({ message: "Salary record not found" });
      }
      
      await salaryService.deleteSalary(id);
      
      return res.status(200).json({ message: "Salary record deleted successfully" });
    } catch (error) {
      console.error("Error in deleteSalary controller:", error);
      return res.status(500).json({ message: error.message || "Failed to delete salary" });
    }
  }
} 
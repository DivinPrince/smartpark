import { employeeService } from "./empolyee.module.js";

export class EmployeeController {
  async getAllEmployees(req, res) {
    try {
      const employees = await employeeService.getAllEmployees();
      return res.status(200).json(employees);
    } catch (error) {
      console.error("Error in getAllEmployees controller:", error);
      return res.status(500).json({ message: error.message || "Failed to fetch employees" });
    }
  }

  async getEmployeeById(req, res) {
    try {
      const employeeNumber = parseInt(req.params.id);
      
      if (isNaN(employeeNumber)) {
        return res.status(400).json({ message: "Invalid employee number" });
      }
      
      const employee = await employeeService.getEmployeeById(employeeNumber);
      
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      return res.status(200).json(employee);
    } catch (error) {
      console.error("Error in getEmployeeById controller:", error);
      return res.status(500).json({ message: error.message || "Failed to fetch employee" });
    }
  }

  async createEmployee(req, res) {
    try {
      const { 
        departmentCode, 
        firstName, 
        lastName, 
        position, 
        address, 
        telephone, 
        gender,
        hiredDate
      } = req.body;
      
      // Validate required fields
      if (!departmentCode || !firstName || !lastName || !position || !address || !telephone || !gender) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      // Use current date if hiredDate is not provided
      const newEmployee = await employeeService.createEmployee({
        departmentCode: parseInt(departmentCode),
        firstName,
        lastName,
        position,
        address,
        telephone,
        gender,
        hiredDate: hiredDate || new Date()
      });
      
      return res.status(201).json(newEmployee);
    } catch (error) {
      console.error("Error in createEmployee controller:", error);
      
      if (error.message === "Department does not exist") {
        return res.status(400).json({ message: error.message });
      }
      
      return res.status(500).json({ message: error.message || "Failed to create employee" });
    }
  }

  async updateEmployee(req, res) {
    try {
      const employeeNumber = parseInt(req.params.id);
      
      if (isNaN(employeeNumber)) {
        return res.status(400).json({ message: "Invalid employee number" });
      }
      
      // Check if employee exists
      const existingEmployee = await employeeService.getEmployeeById(employeeNumber);
      
      if (!existingEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      const { 
        departmentCode, 
        firstName, 
        lastName, 
        position, 
        address, 
        telephone, 
        gender,
        hiredDate
      } = req.body;
      
      const updateData = {};
      if (departmentCode) updateData.departmentCode = parseInt(departmentCode);
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (position) updateData.position = position;
      if (address) updateData.address = address;
      if (telephone) updateData.telephone = telephone;
      if (gender) updateData.gender = gender;
      if (hiredDate) updateData.hiredDate = hiredDate;
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No valid update fields provided" });
      }
      
      const updatedEmployee = await employeeService.updateEmployee(
        employeeNumber,
        updateData
      );
      
      return res.status(200).json(updatedEmployee);
    } catch (error) {
      console.error("Error in updateEmployee controller:", error);
      
      if (error.message === "Department does not exist") {
        return res.status(400).json({ message: error.message });
      }
      
      return res.status(500).json({ message: error.message || "Failed to update employee" });
    }
  }

  async deleteEmployee(req, res) {
    try {
      const employeeNumber = parseInt(req.params.id);
      
      if (isNaN(employeeNumber)) {
        return res.status(400).json({ message: "Invalid employee number" });
      }
      
      // Check if employee exists
      const existingEmployee = await employeeService.getEmployeeById(employeeNumber);
      
      if (!existingEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      await employeeService.deleteEmployee(employeeNumber);
      
      return res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
      console.error("Error in deleteEmployee controller:", error);
      
      if (error.message === "Cannot delete employee with salary records") {
        return res.status(400).json({ message: error.message });
      }
      
      return res.status(500).json({ message: error.message || "Failed to delete employee" });
    }
  }

  async getEmployeesByDepartment(req, res) {
    try {
      const departmentCode = parseInt(req.params.departmentId);
      
      if (isNaN(departmentCode)) {
        return res.status(400).json({ message: "Invalid department code" });
      }
      
      const employees = await employeeService.getEmployeesByDepartment(departmentCode);
      
      return res.status(200).json(employees);
    } catch (error) {
      console.error("Error in getEmployeesByDepartment controller:", error);
      return res.status(500).json({ message: error.message || "Failed to fetch employees" });
    }
  }
  
  async getEmployeeSalary(req, res) {
    try {
      const employeeNumber = parseInt(req.params.id);
      
      if (isNaN(employeeNumber)) {
        return res.status(400).json({ message: "Invalid employee number" });
      }
      
      // Check if employee exists
      const existingEmployee = await employeeService.getEmployeeById(employeeNumber);
      
      if (!existingEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      const salary = await employeeService.getEmployeeSalary(employeeNumber);
      
      if (!salary) {
        return res.status(404).json({ message: "Salary information not found for this employee" });
      }
      
      return res.status(200).json(salary);
    } catch (error) {
      console.error("Error in getEmployeeSalary controller:", error);
      return res.status(500).json({ message: error.message || "Failed to fetch employee salary" });
    }
  }
}

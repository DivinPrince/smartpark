import api from './api';

const employeeService = {
  // Get all employees
  getAllEmployees: async () => {
    try {
      const response = await api.get('/employees');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get employee by ID
  getEmployeeById: async (id) => {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new employee
  createEmployee: async (employeeData) => {
    try {
      const response = await api.post('/employees', employeeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    try {
      const response = await api.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete employee
  deleteEmployee: async (id) => {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get employees by department
  getEmployeesByDepartment: async (departmentId) => {
    try {
      const response = await api.get(`/employees/department/${departmentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get employee salary
  getEmployeeSalary: async (id) => {
    try {
      const response = await api.get(`/employees/${id}/salary`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default employeeService; 
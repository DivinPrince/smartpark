import api from './api';

const salaryService = {
  // Get all salaries
  getAllSalaries: async () => {
    try {
      const response = await api.get('/salaries');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get salary by ID
  getSalaryById: async (id) => {
    try {
      const response = await api.get(`/salaries/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get salary by employee number
  getSalaryByEmployeeNumber: async (employeeNumber) => {
    try {
      const response = await api.get(`/salaries/employee/${employeeNumber}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new salary
  createSalary: async (salaryData) => {
    try {
      const response = await api.post('/salaries', salaryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update salary
  updateSalary: async (id, salaryData) => {
    try {
      const response = await api.put(`/salaries/${id}`, salaryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete salary
  deleteSalary: async (id) => {
    try {
      const response = await api.delete(`/salaries/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default salaryService; 
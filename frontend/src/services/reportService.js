import api from './api';

const reportService = {
  // Get department summary report
  getDepartmentSummary: async () => {
    try {
      const response = await api.get('/reports/department-summary');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get salary distribution report
  getSalaryDistribution: async () => {
    try {
      const response = await api.get('/reports/salary-distribution');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get gender distribution report
  getGenderDistribution: async () => {
    try {
      const response = await api.get('/reports/gender-distribution');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get employee tenure report
  getEmployeeTenure: async () => {
    try {
      const response = await api.get('/reports/employee-tenure');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default reportService; 
import { useState, useEffect } from 'react';
import salaryService from '../services/salaryService';
import employeeService from '../services/employeeService';

const Salaries = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSalary, setCurrentSalary] = useState(null);
  
  const [formData, setFormData] = useState({
    employeeNumber: '',
    totalDeduction: '',
    grossSalary: '',
    netSalary: ''
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [salariesData, employeesData] = await Promise.all([
          salaryService.getAllSalaries(),
          employeeService.getAllEmployees()
        ]);
        setSalaries(salariesData);
        setEmployees(employeesData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert numeric fields to numbers
    if (name === 'grossSalary' || name === 'netSalary' || name === 'totalDeduction') {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Calculate net salary based on gross salary and deductions
  const calculateNetSalary = () => {
    const gross = Number(formData.grossSalary) || 0;
    const deduction = Number(formData.totalDeduction) || 0;
    const net = gross - deduction;
    
    setFormData(prevFormData => ({
      ...prevFormData,
      netSalary: net >= 0 ? net : 0
    }));
  };
  
  // Handle gross salary or deduction change
  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    
    // Update the form with the new value first
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
    
    // Then calculate net salary after state is updated
    setTimeout(calculateNetSalary, 0);
  };
  
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await salaryService.createSalary(formData);
      setShowAddModal(false);
      resetForm();
      refreshSalaries();
    } catch (err) {
      setError('Can not add salary to this employee because he/she already has a salary');
      console.error(err);
    }
  };
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await salaryService.updateSalary(currentSalary.id, formData);
      setShowEditModal(false);
      resetForm();
      refreshSalaries();
    } catch (err) {
      setError('Failed to update salary');
      console.error(err);
    }
  };
  
  const handleDelete = async () => {
    try {
      await salaryService.deleteSalary(currentSalary.id);
      setShowDeleteModal(false);
      refreshSalaries();
    } catch (err) {
      setError('Failed to delete salary');
      console.error(err);
    }
  };
  
  const refreshSalaries = async () => {
    try {
      const data = await salaryService.getAllSalaries();
      setSalaries(data);
    } catch (err) {
      setError('Failed to refresh salaries');
      console.error(err);
    }
  };
  
  const openEditModal = (salary) => {
    setCurrentSalary(salary);
    setFormData({
      employeeNumber: salary.employeeNumber || '',
      totalDeduction: salary.totalDeduction || '',
      grossSalary: salary.grossSalary || '',
      netSalary: salary.netSalary || ''
    });
    setShowEditModal(true);
  };
  
  const openDeleteModal = (salary) => {
    setCurrentSalary(salary);
    setShowDeleteModal(true);
  };
  
  const resetForm = () => {
    setFormData({
      employeeNumber: '',
      totalDeduction: '',
      grossSalary: '',
      netSalary: ''
    });
    setCurrentSalary(null);
  };

  const getEmployeeName = (employeeNumber) => {
    const employee = employees.find(emp => emp.employeeNumber === employeeNumber);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'RWF'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Salaries</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Add Salary
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Deduction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salaries.length > 0 ? (
                salaries.map((salary) => (
                  <tr key={salary.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{salary.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getEmployeeName(salary.employeeNumber)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatCurrency(salary.grossSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatCurrency(salary.totalDeduction)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatCurrency(salary.netSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(salary)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(salary)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No salaries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Salary Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Add Salary</h3>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="employeeNumber">
                    Employee
                  </label>
                  <select
                    id="employeeNumber"
                    name="employeeNumber"
                    value={formData.employeeNumber}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.employeeNumber} value={emp.employeeNumber}>
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="grossSalary">
                    Gross Salary
                  </label>
                  <input
                    id="grossSalary"
                    name="grossSalary"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.grossSalary}
                    onChange={handleSalaryChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalDeduction">
                    Total Deduction
                  </label>
                  <input
                    id="totalDeduction"
                    name="totalDeduction"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.totalDeduction}
                    onChange={handleSalaryChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="netSalary">
                    Net Salary
                  </label>
                  <input
                    id="netSalary"
                    name="netSalary"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.netSalary}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 bg-gray-100 leading-tight focus:outline-none"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Net salary is calculated automatically</p>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end rounded-b-lg">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Salary Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Edit Salary</h3>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-employeeNumber">
                    Employee
                  </label>
                  <select
                    id="edit-employeeNumber"
                    name="employeeNumber"
                    value={formData.employeeNumber}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.employeeNumber} value={emp.employeeNumber}>
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-grossSalary">
                    Gross Salary
                  </label>
                  <input
                    id="edit-grossSalary"
                    name="grossSalary"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.grossSalary}
                    onChange={handleSalaryChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-totalDeduction">
                    Total Deduction
                  </label>
                  <input
                    id="edit-totalDeduction"
                    name="totalDeduction"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.totalDeduction}
                    onChange={handleSalaryChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-netSalary">
                    Net Salary
                  </label>
                  <input
                    id="edit-netSalary"
                    name="netSalary"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.netSalary}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 bg-gray-100 leading-tight focus:outline-none"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Net salary is calculated automatically</p>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end rounded-b-lg">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Delete</h3>
              <p className="text-gray-600">
                Are you sure you want to delete the salary record for "{getEmployeeName(currentSalary?.employeeNumber)}"? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end rounded-b-lg">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Salaries; 
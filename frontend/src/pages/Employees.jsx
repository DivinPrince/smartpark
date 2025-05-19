import { useState, useEffect } from 'react';
import employeeService from '../services/employeeService';
import departmentService from '../services/departmentService';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    departmentCode: '',
    position: '',
    address: '',
    telephone: '',
    gender: 'Male',
    hiredDate: ''
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [employeesData, departmentsData] = await Promise.all([
          employeeService.getAllEmployees(),
          departmentService.getAllDepartments()
        ]);
        setEmployees(employeesData);
        setDepartments(departmentsData);
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
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await employeeService.createEmployee(formData);
      setShowAddModal(false);
      resetForm();
      refreshEmployees();
    } catch (err) {
      setError('Failed to add employee');
      console.error(err);
    }
  };
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await employeeService.updateEmployee(currentEmployee.employeeNumber, formData);
      setShowEditModal(false);
      resetForm();
      refreshEmployees();
    } catch (err) {
      setError('Failed to update employee');
      console.error(err);
    }
  };
  
  const handleDelete = async () => {
    try {
      await employeeService.deleteEmployee(currentEmployee.employeeNumber);
      setShowDeleteModal(false);
      refreshEmployees();
    } catch (err) {
      setError('Failed to delete employee');
      console.error(err);
    }
  };
  
  const refreshEmployees = async () => {
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setError('Failed to refresh employees');
      console.error(err);
    }
  };
  
  const openEditModal = (employee) => {
    setCurrentEmployee(employee);
    // Format date for input field (YYYY-MM-DD)
    const formattedDate = employee.hiredDate ? 
      new Date(employee.hiredDate).toISOString().split('T')[0] : 
      '';
      
    setFormData({
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
      departmentCode: employee.departmentCode || '',
      position: employee.position || '',
      address: employee.address || '',
      telephone: employee.telephone || '',
      gender: employee.gender || 'Male',
      hiredDate: formattedDate
    });
    setShowEditModal(true);
  };
  
  const openDeleteModal = (employee) => {
    setCurrentEmployee(employee);
    setShowDeleteModal(true);
  };
  
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      departmentCode: '',
      position: '',
      address: '',
      telephone: '',
      gender: 'Male',
      hiredDate: ''
    });
    setCurrentEmployee(null);
  };

  const getDepartmentName = (departmentCode) => {
    const department = departments.find(dept => dept.departmentCode === departmentCode);
    return department ? department.departpentName : 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Employee
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telephone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hired Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr key={employee.employeeNumber}>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.employeeNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getDepartmentName(employee.departmentCode)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.telephone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.hiredDate 
                        ? new Date(employee.hiredDate).toLocaleDateString() 
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(employee)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(employee)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Add Employee</h3>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="departmentCode">
                    Department
                  </label>
                  <select
                    id="departmentCode"
                    name="departmentCode"
                    value={formData.departmentCode}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.departmentCode} value={dept.departmentCode}>
                        {dept.departpentName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="position">
                    Position
                  </label>
                  <input
                    id="position"
                    name="position"
                    type="text"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telephone">
                    Telephone
                  </label>
                  <input
                    id="telephone"
                    name="telephone"
                    type="text"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hiredDate">
                    Hired Date
                  </label>
                  <input
                    id="hiredDate"
                    name="hiredDate"
                    type="date"
                    value={formData.hiredDate}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="2"
                    required
                  ></textarea>
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
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Employee Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Edit Employee</h3>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-firstName">
                    First Name
                  </label>
                  <input
                    id="edit-firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-lastName">
                    Last Name
                  </label>
                  <input
                    id="edit-lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-departmentCode">
                    Department
                  </label>
                  <select
                    id="edit-departmentCode"
                    name="departmentCode"
                    value={formData.departmentCode}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.departmentCode} value={dept.departmentCode}>
                        {dept.departpentName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-position">
                    Position
                  </label>
                  <input
                    id="edit-position"
                    name="position"
                    type="text"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-gender">
                    Gender
                  </label>
                  <select
                    id="edit-gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-telephone">
                    Telephone
                  </label>
                  <input
                    id="edit-telephone"
                    name="telephone"
                    type="text"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-hiredDate">
                    Hired Date
                  </label>
                  <input
                    id="edit-hiredDate"
                    name="hiredDate"
                    type="date"
                    value={formData.hiredDate}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-address">
                    Address
                  </label>
                  <textarea
                    id="edit-address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="2"
                    required
                  ></textarea>
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
                Are you sure you want to delete the employee "{currentEmployee?.firstName} {currentEmployee?.lastName}"? This action cannot be undone.
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

export default Employees; 
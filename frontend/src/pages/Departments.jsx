import { useState, useEffect } from 'react';
import departmentService from '../services/departmentService';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  
  const [formData, setFormData] = useState({
    departpentName: '',
    grossSalary: ''
  });
  
  useEffect(() => {
    fetchDepartments();
  }, []);
  
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await departmentService.getAllDepartments();
      setDepartments(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch departments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
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
      await departmentService.createDepartment(formData);
      setShowAddModal(false);
      resetForm();
      fetchDepartments();
    } catch (err) {
      setError('Failed to add department');
      console.error(err);
    }
  };
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await departmentService.updateDepartment(currentDepartment.departmentCode, formData);
      setShowEditModal(false);
      resetForm();
      fetchDepartments();
    } catch (err) {
      setError('Failed to update department');
      console.error(err);
    }
  };
  
  const handleDelete = async () => {
    try {
      await departmentService.deleteDepartment(currentDepartment.departmentCode);
      setShowDeleteModal(false);
      fetchDepartments();
    } catch (err) {
      setError('Failed to delete department');
      console.error(err);
    }
  };
  
  const openEditModal = (department) => {
    setCurrentDepartment(department);
    setFormData({
      departpentName: department.departpentName,
      grossSalary: department.grossSalary
    });
    setShowEditModal(true);
  };
  
  const openDeleteModal = (department) => {
    setCurrentDepartment(department);
    setShowDeleteModal(true);
  };
  
  const resetForm = () => {
    setFormData({
      departpentName: '',
      grossSalary: ''
    });
    setCurrentDepartment(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
        <h1 className="text-3xl font-bold text-gray-800">Departments</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Department
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.length > 0 ? (
              departments.map((department) => (
                <tr key={department.departmentCode}>
                  <td className="px-6 py-4 whitespace-nowrap">{department.departmentCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{department.departpentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{department.grossSalary}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(department)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(department)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No departments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Add Department</h3>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="departpentName">
                    Department Name
                  </label>
                  <input
                    id="departpentName"
                    name="departpentName"
                    type="text"
                    value={formData.departpentName}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="grossSalary">
                    Gross Salary
                  </label>
                  <input
                    id="grossSalary"
                    name="grossSalary"
                    type="text"
                    value={formData.grossSalary}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
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
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Department Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Edit Department</h3>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-departpentName">
                    Department Name
                  </label>
                  <input
                    id="edit-departpentName"
                    name="departpentName"
                    type="text"
                    value={formData.departpentName}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-grossSalary">
                    Gross Salary
                  </label>
                  <input
                    id="edit-grossSalary"
                    name="grossSalary"
                    type="text"
                    value={formData.grossSalary}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
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
                Are you sure you want to delete the department "{currentDepartment?.departpentName}"? This action cannot be undone.
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

export default Departments; 
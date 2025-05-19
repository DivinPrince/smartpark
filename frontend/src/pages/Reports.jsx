import { useState, useEffect } from 'react';
import reportService from '../services/reportService';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('department');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [departmentSummary, setDepartmentSummary] = useState([]);
  const [salaryDistribution, setSalaryDistribution] = useState({ totalEmployees: 0, ranges: [] });
  const [genderDistribution, setGenderDistribution] = useState({ totalEmployees: 0, distribution: {} });
  const [employeeTenure, setEmployeeTenure] = useState({ totalEmployees: 0, ranges: [] });
  
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        
        // Fetch only the data for the active tab
        switch (activeTab) {
          case 'department':
            if (departmentSummary.length === 0) {
              const data = await reportService.getDepartmentSummary();
              setDepartmentSummary(data);
            }
            break;
          case 'salary':
            if (salaryDistribution.ranges.length === 0) {
              const data = await reportService.getSalaryDistribution();
              setSalaryDistribution(data);
            }
            break;
          case 'gender':
            if (!genderDistribution.distribution.male) {
              const data = await reportService.getGenderDistribution();
              setGenderDistribution(data);
            }
            break;
          case 'tenure':
            if (employeeTenure.ranges.length === 0) {
              const data = await reportService.getEmployeeTenure();
              setEmployeeTenure(data);
            }
            break;
          default:
            break;
        }
        
        setError(null);
      } catch (err) {
        setError(`Failed to fetch ${activeTab} report data`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, [activeTab]);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Prepare salary distribution data
  const getSalaryDistributionData = () => {
    return salaryDistribution.ranges.map(range => ({
      name: `RWF ${range.min}-${range.max === Infinity ? '+' : 'RWF' + range.max}`,
      count: range.count,
      percentage: (range.count / salaryDistribution.totalEmployees) * 100
    }));
  };
  
  // Prepare gender distribution data
  const getGenderDistributionData = () => {
    const { distribution } = genderDistribution;
    return Object.keys(distribution).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: distribution[key],
      percentage: (distribution[key] / genderDistribution.totalEmployees) * 100
    }));
  };
  
  const renderDepartmentSummary = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700">Department Summary</h2>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Gross Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Salary Cost</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentSummary.map((dept, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{dept.department.departpentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{dept.employeeCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(dept.avgGrossSalary)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(dept.avgNetSalary)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(dept.totalGrossSalary)}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td className="px-6 py-4 whitespace-nowrap">TOTAL</td>
                <td className="px-6 py-4 whitespace-nowrap">{departmentSummary.reduce((sum, dept) => sum + dept.employeeCount, 0)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatCurrency(
                    departmentSummary.reduce((sum, dept) => sum + (dept.avgGrossSalary * dept.employeeCount), 0) / 
                    departmentSummary.reduce((sum, dept) => sum + dept.employeeCount, 0) || 0
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatCurrency(
                    departmentSummary.reduce((sum, dept) => sum + (dept.avgNetSalary * dept.employeeCount), 0) / 
                    departmentSummary.reduce((sum, dept) => sum + dept.employeeCount, 0) || 0
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(departmentSummary.reduce((sum, dept) => sum + dept.totalGrossSalary, 0))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  const renderSalaryDistribution = () => {
    const data = getSalaryDistributionData();
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700">Salary Distribution</h2>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of Employees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distribution</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((range, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{range.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{range.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{range.percentage.toFixed(1)}%</td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${range.percentage}%` }}></div>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td className="px-6 py-4 whitespace-nowrap">Total</td>
                <td className="px-6 py-4 whitespace-nowrap">{salaryDistribution.totalEmployees}</td>
                <td className="px-6 py-4 whitespace-nowrap">100%</td>
                <td className="px-6 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  const renderGenderDistribution = () => {
    const data = getGenderDistributionData();
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700">Gender Distribution</h2>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of Employees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distribution</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.percentage.toFixed(1)}%</td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-pink-500' : 'bg-purple-500'}`} 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td className="px-6 py-4 whitespace-nowrap">Total</td>
                <td className="px-6 py-4 whitespace-nowrap">{genderDistribution.totalEmployees}</td>
                <td className="px-6 py-4 whitespace-nowrap">100%</td>
                <td className="px-6 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  const renderEmployeeTenure = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700">Years of Service</h2>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenure Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of Employees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distribution</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employeeTenure.ranges.map((range, index) => {
                const percentage = (range.count / employeeTenure.totalEmployees) * 100;
                return (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{range.range}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{range.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{percentage.toFixed(1)}%</td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-gray-100 font-semibold">
                <td className="px-6 py-4 whitespace-nowrap">Total</td>
                <td className="px-6 py-4 whitespace-nowrap">{employeeTenure.totalEmployees}</td>
                <td className="px-6 py-4 whitespace-nowrap">100%</td>
                <td className="px-6 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {employeeTenure.ranges.map((range, index) => (
          <div key={index} className="bg-white rounded-lg shadow">
            <div className="px-4 py-3 bg-gray-50 border-b">
              <h3 className="text-lg font-medium text-gray-700">{range.range} ({range.count} employees)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hired Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenure (Years)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {range.employees.map((emp, empIndex) => (
                    <tr key={empIndex} className={empIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap">{emp.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(emp.hiredDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {emp.tenureYears < 0.0833 ? "< 1 month" : emp.tenureYears.toFixed(1) + (emp.tenureYears === 1 ? " year" : " years")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderActiveTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      );
    }
    
    switch (activeTab) {
      case 'department':
        return renderDepartmentSummary();
      case 'salary':
        return renderSalaryDistribution();
      case 'gender':
        return renderGenderDistribution();
      case 'tenure':
        return renderEmployeeTenure();
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports Dashboard</h1>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('department')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'department'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Department Summary
            </button>
            <button
              onClick={() => setActiveTab('salary')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'salary'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Salary Distribution
            </button>
            <button
              onClick={() => setActiveTab('gender')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'gender'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gender Distribution
            </button>
            <button
              onClick={() => setActiveTab('tenure')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tenure'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Years of Service
            </button>
          </nav>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        {renderActiveTabContent()}
      </div>
    </div>
  );
};

export default Reports; 
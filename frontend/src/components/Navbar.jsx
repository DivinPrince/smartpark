import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">Employee Management</span>
            </Link>
            {isAuthenticated && (
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/departments" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Departments
                </Link>
                <Link to="/employees" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Employees
                </Link>
                <Link to="/salaries" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Salaries
                </Link>
                <Link to="/reports" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Reports
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center ml-4">
                <span className="mr-4 text-sm">Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Admin Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Employee Management System
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            A comprehensive solution for managing departments, employees, and salaries
          </p>
        </div>

        <div className="mt-10">
          {isAuthenticated ? (
            <div className="space-y-10">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">
                    Welcome back, {user.name}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Manage your organization's resources efficiently.
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                    <Link
                      to="/departments"
                      className="flex flex-col items-center p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                    >
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h3 className="mt-3 text-lg font-medium text-gray-900">Departments</h3>
                      <p className="mt-2 text-base text-gray-500 text-center">
                        Manage department information
                      </p>
                    </Link>
                    <Link
                      to="/employees"
                      className="flex flex-col items-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition"
                    >
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="mt-3 text-lg font-medium text-gray-900">Employees</h3>
                      <p className="mt-2 text-base text-gray-500 text-center">
                        Manage employee records
                      </p>
                    </Link>
                    <Link
                      to="/salaries"
                      className="flex flex-col items-center p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
                    >
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="mt-3 text-lg font-medium text-gray-900">Salaries</h3>
                      <p className="mt-2 text-base text-gray-500 text-center">
                        Manage salary information
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-xl text-gray-700 mb-8">
                Please sign in to access the employee management system
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home; 
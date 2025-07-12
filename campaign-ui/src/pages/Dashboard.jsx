import React, { useState } from 'react';
import UserList from './UserList'; 

const Dashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    if (activeView === 'users') {
      return <UserList />;
    }

    if (activeView === 'lists') {
      return <h2 className="text-xl text-gray-600">Lists View (Coming Soon)</h2>;
    }

    return (
      <h1 className="text-3xl font-semibold text-gray-700">
        Welcome to the Dashboard
      </h1>
    );
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-6">
        <nav className="space-y-4">
          <button
            onClick={() => setActiveView('users')}
            className={`block w-full text-left px-4 py-2 rounded ${
              activeView === 'users' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveView('lists')}
            className={`block w-full text-left px-4 py-2 rounded ${
              activeView === 'lists' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            Lists
          </button>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-8">{renderContent()}</main>
    </div>
  );
};

export default Dashboard;

// post API
// frontend create
// data should be json
// in name there should only be alphatet and 
// react hook form for form and for validation use yup 
// check validation for react hook form library
// password should be atleast 6 user
// user list should be order by ID
import React, { useState } from 'react';
import UserList from './UserList';
import List from './List';
import Template from './Template';
import CreateTemplate from './CreateTemplate';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    if (activeView === 'users') return <UserList />;
    if (activeView === 'lists') return <List />;
    if (activeView === 'template')
      return <Template onCreate={() => setActiveView('create-template')} />;
    if (activeView === 'create-template')
      return <CreateTemplate onCancel={() => setActiveView('template')} />;

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
            onClick={() => setActiveView('dashboard')}
            className={`block w-full text-left px-4 py-2 rounded ${
              activeView === 'dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            Dashboard
          </button>
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
          <button
            onClick={() => setActiveView('template')}
            className={`block w-full text-left px-4 py-2 rounded ${
              activeView === 'template' || activeView === 'create-template'
                ? 'bg-gray-700'
                : 'hover:bg-gray-700'
            }`}
          >
            Template
          </button>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-8">{renderContent()}</main>
    </div>
  );
};

export default Dashboard;

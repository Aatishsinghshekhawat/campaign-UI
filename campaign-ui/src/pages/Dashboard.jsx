import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex">
        
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-4">
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded">Users</button>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded">Lists</button>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-8">
        <h1 className="text-3xl font-semibold text-gray-700">Welcome to the Dashboard</h1>
      </main>
    </div>
  );
};

export default Dashboard;

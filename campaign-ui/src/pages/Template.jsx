import React, { useState } from 'react';

const Template = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');

  const templates = [
    { id: 1, title: 'Template 01', status: 'Enabled', content: 'update' },
    { id: 2, title: 'Template 02', status: 'Disabled', content: 'add' },
    { id: 3, title: 'Template 03', status: 'Enabled', content: 'update' },
    { id: 4, title: 'Template 04', status: 'Enabled', content: 'update' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Templates</h2>
        <button
          onClick={onCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Template
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-3 py-2 rounded w-1/3"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded w-1/4"
        >
          <option value="">Select</option>
          <option value="Enabled">Enabled</option>
          <option value="Disabled">Disabled</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Filter</button>
        <button className="bg-gray-300 text-black px-4 py-2 rounded">Reset</button>
      </div>

      <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border">S.No.</th>
            <th className="py-2 px-4 border">Title</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Content</th>
            <th className="py-2 px-4 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template, index) => (
            <tr key={template.id} className="text-center">
              <td className="py-2 px-4 border">{index + 1}</td>
              <td className="py-2 px-4 border">{template.title}</td>
              <td className="py-2 px-4 border">{template.status}</td>
              <td className="py-2 px-4 border text-blue-600 cursor-pointer">{template.content}</td>
              <td className="py-2 px-4 border text-blue-600 cursor-pointer">view</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Template;

import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { FaTrashAlt, FaEye } from 'react-icons/fa';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // fixed for now

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/user/list?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Fetched users:', res.data); // for debugging
      setUsers(res.data.users); // ✅ correct based on backend
      setTotal(res.data.total);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh after delete
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    fetchUsers();
  }, [page]); // refetch when page changes

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Manage Users</h2>

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Mobile</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Action</th>
              <th className="px-6 py-3 font-medium">Tools</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.isArray(users) && users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-800">{user.name}</td>
                <td className="px-6 py-4 text-gray-800">{user.email}</td>
                <td className="px-6 py-4 text-gray-800">
                  {user.mobileCountryCode} {user.mobile}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    {user.role_title || 'User'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="bg-indigo-500 text-white px-4 py-1 rounded hover:bg-indigo-600">
                    Update
                  </button>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => handleDelete(user.id)}>
                    <FaTrashAlt className="text-red-500 hover:text-red-700" />
                  </button>
                  <button onClick={() => alert(JSON.stringify(user, null, 2))}>
                    <FaEye className="text-gray-600 hover:text-gray-800" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="text-sm text-gray-500 border px-3 py-1 rounded hover:bg-gray-100"
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>

        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setPage(idx + 1)}
              className={`text-sm px-3 py-1 rounded border ${
                page === idx + 1
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'text-blue-600 border-blue-300 hover:bg-blue-100'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <button
          className="text-sm text-gray-500 border px-3 py-1 rounded hover:bg-gray-100"
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;

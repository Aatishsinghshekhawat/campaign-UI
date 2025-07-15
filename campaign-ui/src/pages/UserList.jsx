import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../features/users/userThunks';
import { setPage } from '../features/users/userSlice';
import axios from '../api/axios';
import { FaTrashAlt, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserList = () => {
  const dispatch = useDispatch();
  const { list, total, page, limit, loading } = useSelector((state) => state.users);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobileCountryCode: '91',
    mobile: '',
  });

  useEffect(() => {
    dispatch(fetchUsers({ page, limit }));
  }, [dispatch, page, limit]);

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const nameRegex = /^[A-Za-z.\s]+$/;
    const mobileRegex = /^\d+$/;

    if (!nameRegex.test(formData.name)) return toast.error('Invalid name');
    if (!mobileRegex.test(formData.mobile)) return toast.error('Invalid mobile number');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/user/add',
        {
          name: formData.name.trim(),
          email: formData.email,
          password: formData.password,
          mobileCountryCode: formData.mobileCountryCode,
          mobile: formData.mobile,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('User added');
      setFormData({
        name: '',
        email: '',
        password: '',
        mobileCountryCode: '91',
        mobile: '',
      });
      setShowForm(false);
      dispatch(fetchUsers({ page, limit }));
    } catch (err) {
      const msg = err?.response?.data?.errors?.[0]?.msg || 'Failed to add user';
      toast.error(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('User deleted');
      dispatch(fetchUsers({ page, limit }));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-700">Users</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm ? 'Close' : 'Add User'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleFormSubmit}
          className="mb-6 p-4 bg-gray-50 rounded-lg shadow-inner grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="border px-3 py-2 rounded"
            required
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.mobileCountryCode}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d{0,4}$/.test(val)) {
                  setFormData({ ...formData, mobileCountryCode: val });
                }
              }}
              className="w-20 border px-2 py-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) {
                  setFormData({ ...formData, mobile: e.target.value });
                }
              }}
              className="flex-1 border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="px-6 py-3 font-medium">S.No</th>
              <th className="px-6 py-3 font-medium">User ID</th>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Mobile</th>
              <th className="px-6 py-3 font-medium">Created</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">Loading...</td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">No users found</td>
              </tr>
            ) : (
              list.map((user, index) => (
                <tr key={user.user_id}>
                  <td className="px-6 py-3">{(page - 1) * limit + index + 1}</td>
                  <td className="px-6 py-3 text-gray-800">{user.user_id}</td>
                  <td className="px-6 py-3 text-gray-800">{user.name}</td>
                  <td className="px-6 py-3 text-gray-800">{user.email}</td>
                  <td className="px-6 py-3 text-gray-800">+{user.mobileCountryCode} {user.mobile}</td>
                  <td className="px-6 py-3 text-gray-800">
                    {user.createdDate
                      ? new Date(user.createdDate).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—'}
                  </td>
                  <td className="px-6 py-3 space-x-2">
                    <button onClick={() => handleDelete(user.user_id)}>
                      <FaTrashAlt className="text-red-500 hover:text-red-700" />
                    </button>
                    <button onClick={() => alert(JSON.stringify(user, null, 2))}>
                      <FaEye className="text-gray-600 hover:text-gray-800" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
  <button
    className="text-sm text-gray-500 border px-3 py-1 rounded hover:bg-gray-100"
    onClick={() => handlePageChange(Math.max(page - 1, 1))}
    disabled={page === 1}
  >
    Prev
  </button>

  <div className="flex gap-2">
    {[...Array(totalPages || 1)].map((_, idx) => (
      <button
        key={idx + 1}
        onClick={() => handlePageChange(idx + 1)}
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
    onClick={() => handlePageChange(Math.min(page + 1, totalPages || 1))}
    disabled={page === (totalPages || 1)}
  >
    Next
  </button>
</div>

    </div>
  );
};

export default UserList;

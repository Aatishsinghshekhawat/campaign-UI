import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from "../features/auth/authSlice";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mobile: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(resultAction)) {
      localStorage.setItem('token', resultAction.payload.token);
      localStorage.setItem('user', JSON.stringify(resultAction.payload.user));
      console.log('Login success:', resultAction.payload);
      navigate('/dashboard');
    } else {
      console.log('Login failed:', resultAction.payload || resultAction.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Admin Login</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobile">
            Mobile Number
          </label>
          <input
            id="mobile"
            type="text"
            placeholder="Enter mobile number"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

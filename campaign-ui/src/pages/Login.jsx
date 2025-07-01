import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!mobile || !password) {
      alert('Please fill in both fields.');
      return;
    }

    dispatch(login({ mobile }));
    alert('Login successful!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="tel"
            placeholder="Mobile Number"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            pattern="[0-9]{10}"
            maxLength={10}
          />

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-gray-600">
          <p>
            Forgot <span className="text-blue-600 hover:underline cursor-pointer">Password?</span>
          </p>
          <p className="mt-1">
            Don’t have an account?{' '}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

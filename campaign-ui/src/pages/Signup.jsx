import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();

    if (!name || !mobile || !password) {
      alert('All fields are required');
      return;
    }

    alert('User registered successfully!');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            pattern="[0-9]{10}"
            maxLength={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-gray-600">
          <p>
            Already have an account?{' '}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate('/')}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

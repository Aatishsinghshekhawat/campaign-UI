import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const statusOptions = [
  { value: '', label: 'Select' },
  { value: 'enabled', label: 'Enabled' },
  { value: 'disabled', label: 'Disabled' },
];

const CreateTemplate = () => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState({});

  const navigate = useNavigate();

  const validate = () => {
    let err = {};
    if (!title.trim()) err.title = 'Title is required';
    if (!status) err.status = 'Status is required';
    return err;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setTouched(true);
    const err = validate();
    setError(err);
    if (Object.keys(err).length !== 0) return;

    setLoading(true);
    try {
      await axios.post('/template/add', { title: title.trim(), status });
      navigate('/template');
    } catch (e) {
      setError({ api: e.response?.data?.message || 'Creation failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/template');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow-md my-12 border">
      <h1 className="text-2xl font-bold mb-6">Create Template</h1>
      <form>
        <div className="mb-5">
          <label htmlFor="title" className="block text-sm mb-1 font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={() => setTouched(true)}
            className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="Enter title"
            autoComplete="off"
          />
          {touched && error.title && (
            <div className="text-red-500 text-xs mt-1">{error.title}</div>
          )}
        </div>

        <div className="mb-8">
          <label htmlFor="status" className="block text-sm mb-1 font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={e => setStatus(e.target.value)}
            onBlur={() => setTouched(true)}
            className="w-full border rounded px-3 py-2 text-gray-700 bg-white focus:outline-none focus:border-blue-500"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                {opt.label}
              </option>
            ))}
          </select>
          {touched && error.status && (
            <div className="text-red-500 text-xs mt-1">{error.status}</div>
          )}
        </div>

        {error.api && <div className="mb-3 text-red-500 text-xs">{error.api}</div>}

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-semibold transition"
            type="submit"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleCancel}
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-2 rounded font-semibold transition border"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTemplate;

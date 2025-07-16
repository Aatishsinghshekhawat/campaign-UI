import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// 1. Fetch paginated lists
export const fetchLists = createAsyncThunk(
  'lists/fetchLists',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/list/filter?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch lists');
    }
  }
);

// 2. Add new list
export const addList = createAsyncThunk(
  'lists/addList',
  async ({ name }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/list/add`,
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to add list');
    }
  }
);

// 3. Fetch a specific list by ID
export const fetchListById = createAsyncThunk(
  'lists/fetchListById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/list/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch list details');
    }
  }
);

// 4. Update list by ID
export const updateList = createAsyncThunk(
  'lists/updateList',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/list/add/${id}`,
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update list');
    }
  }
);

import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchLists = createAsyncThunk(
  'lists/fetchLists',
  async ({ page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/list/filter',
        { page, limit },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const total = response.data.total || 0;

      return {
        lists: response.data.lists || [],
        total,
        page: response.data.page || 1,
        limit: response.data.limit || 5,
        totalPages: Math.ceil(total / (response.data.limit || 5)),
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch lists'
      );
    }
  }
);

export const addList = createAsyncThunk(
  'lists/addList',
  async ({ name }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/list/add',
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      dispatch(fetchLists({ page: 1, limit: 5 }));

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to add list'
      );
    }
  }
);

export const updateList = createAsyncThunk(
  'lists/updateList',
  async ({ id, name }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/list/add/${id}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      dispatch(fetchLists({ page: 1, limit: 5 }));

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to update list'
      );
    }
  }
);

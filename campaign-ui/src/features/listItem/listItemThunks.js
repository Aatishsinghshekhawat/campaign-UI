import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// ✅ 1. Fetch list metadata (name, audience count, created date)
export const fetchListMetaById = createAsyncThunk(
  'listItem/fetchListMetaById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/list/item/list/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch list metadata');
    }
  }
);

// ✅ 2. Fetch list items (email rows)
export const fetchListItemById = createAsyncThunk(
  'listItem/fetchListItemById',
  async (listId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/list/item/filter?list_id=${listId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.listItems;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch list items');
    }
  }
);

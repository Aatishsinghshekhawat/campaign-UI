import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/template/filter';

export const fetchTemplates = createAsyncThunk(
  'template/fetchTemplates',
  async ({ page = 1, limit = 10, title = '', status = '' }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        API_URL,
        { page, limit, title, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        templates: response.data.templates,
        total: response.data.total,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch templates'
      );
    }
  }
);

export const updateTemplateContent = createAsyncThunk(
  "template/updateTemplateContent",
  async ({ id, content }) => ({ id, content })
);

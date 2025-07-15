import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers } from './userThunks';

const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null,
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.users;
        state.total = action.payload.total;
        state.limit = action.payload.limit;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      });
  },
});

export const { setPage } = userSlice.actions;
export default userSlice.reducer;

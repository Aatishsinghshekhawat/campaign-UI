import { createSlice } from '@reduxjs/toolkit';
import { fetchLists, addList, updateList } from './listThunks';

const initialState = {
  lists: [],
  total: 0,
  page: 1,
  limit: 5,
  totalPages: 1,
  loading: false,
  error: null,
};

const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload.lists;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.lists = [];
        state.total = 0;
        state.totalPages = 1;
      })
      .addCase(addList.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateList.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setPage } = listSlice.actions;
export default listSlice.reducer;

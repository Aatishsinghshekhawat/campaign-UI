import { createSlice } from '@reduxjs/toolkit';
import { fetchLists, addList, updateList } from './listThunks';

const initialState = {
  lists: [],
  loading: false,
  error: null,
  currentPage: 1,
  total: 0,
  limit: 10,
};

const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    setPage(state, action) {
      state.currentPage = action.payload;
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
        state.limit = action.payload.limit;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addList.fulfilled, (state, action) => {
        state.lists.unshift(action.payload);
      })
      .addCase(updateList.fulfilled, (state, action) => {
        const index = state.lists.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        }
      });
  },
});

export const { setPage } = listSlice.actions;
export default listSlice.reducer;

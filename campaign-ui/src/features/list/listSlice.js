import { createSlice } from '@reduxjs/toolkit';
import { fetchLists, addList } from './listThunks';

const listSlice = createSlice({
  name: 'lists',
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
      .addCase(fetchLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.lists;
        state.total = action.payload.total;
        state.limit = action.payload.limit;
        state.page = action.payload.page;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addList.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage } = listSlice.actions;
export default listSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { fetchListItems, uploadListItemsCSV, deleteList, deleteListItem } from './listItemThunks';

const listItemSlice = createSlice({
  name: 'listItems',
  initialState: {
    items: [],
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
      .addCase(fetchListItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
      })
      .addCase(fetchListItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch list items';
      })

      .addCase(uploadListItemsCSV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadListItemsCSV.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadListItemsCSV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to upload list items';
      })

      .addCase(deleteList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteList.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
        state.page = 1;
        state.limit = 10;
      })
      .addCase(deleteList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete list';
      })
      .addCase(deleteListItem.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteListItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.meta.arg);
        state.total = state.total > 0 ? state.total - 1 : 0;
      })
      .addCase(deleteListItem.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete list item';
      });
  },
});

export const { setPage } = listItemSlice.actions;
export default listItemSlice.reducer;

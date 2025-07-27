import { createSlice } from "@reduxjs/toolkit";
import { fetchListItems, uploadListItemsCSV } from "./listItemThunks";

const listItemSlice = createSlice({
  name: "listItems",
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
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchListItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch list items";
      })
      .addCase(uploadListItemsCSV.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadListItemsCSV.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadListItemsCSV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to upload list items";
      });
  },
});

export const { setPage } = listItemSlice.actions;
export default listItemSlice.reducer;

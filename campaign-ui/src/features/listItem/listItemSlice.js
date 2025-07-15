import { createSlice } from '@reduxjs/toolkit';
import { uploadCSV, fetchListMetaById } from './listItemThunks';

const initialState = {
  meta: null,
  uploadStatus: 'idle',
  error: null,
};

const listItemSlice = createSlice({
  name: 'listItem',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadCSV.pending, (state) => {
        state.uploadStatus = 'loading';
      })
      .addCase(uploadCSV.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded';
        state.error = null;
      })
      .addCase(uploadCSV.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.error = action.payload;
      })

      .addCase(fetchListMetaById.pending, (state) => {
        state.meta = null;
      })
      .addCase(fetchListMetaById.fulfilled, (state, action) => {
        state.meta = action.payload;
        state.error = null;
      })
      .addCase(fetchListMetaById.rejected, (state, action) => {
        state.meta = null;
        state.error = action.payload;
      });
  },
});

export default listItemSlice.reducer;

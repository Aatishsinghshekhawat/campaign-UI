import { createSlice } from "@reduxjs/toolkit";
import { fetchTemplates, updateTemplateContent } from "./templateThunks";

const initialState = {
  templates: [],
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  total: 0,
  title: "",
  status: "",
};

const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    setPage(state, action) { state.page = action.payload; },
    setLimit(state, action) { state.limit = action.payload; },
    setTitle(state, action) { state.title = action.payload; },
    setStatus(state, action) { state.status = action.payload; },
    resetFilters(state) { state.title = ""; state.status = ""; },
    setError(state, action) { state.error = action.payload; },
    setLoading(state, action) { state.loading = action.payload; },
    setTemplates(state, action) { state.templates = action.payload; },
    setTotal(state, action) { state.total = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload.templates;
        state.total = action.payload.total;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch templates";
      })
      .addCase(updateTemplateContent.fulfilled, (state, action) => {
        const idx = state.templates.findIndex((tpl) => tpl.id === action.payload.id);
        if (idx !== -1) {
          state.templates[idx].content = action.payload.content;
        }
      });
  },
});

export const {
  setPage,
  setLimit,
  setTitle,
  setStatus,
  resetFilters,
  setError,
  setLoading,
  setTemplates,
  setTotal,
} = templateSlice.actions;

export default templateSlice.reducer;

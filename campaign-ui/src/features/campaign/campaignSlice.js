import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  campaigns: [],
  total: 0,
  page: 1,
  limit: 10,
  nameFilter: "",
  loading: false,
  error: null,
};

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setNameFilter(state, action) {
      state.nameFilter = action.payload;
      state.page = 1; // Reset page on filter
    },
    resetFilters(state) {
      state.nameFilter = "";
      state.page = 1;
    },
    fetchCampaignsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCampaignsSuccess(state, action) {
      state.loading = false;
      state.campaigns = action.payload.campaigns;
      state.total = action.payload.total;
    },
    fetchCampaignsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setPage,
  setNameFilter,
  resetFilters,
  fetchCampaignsStart,
  fetchCampaignsSuccess,
  fetchCampaignsFailure,
} = campaignSlice.actions;

export default campaignSlice.reducer;

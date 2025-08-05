// src/features/campaign/campaignSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// Fetch list of campaigns with pagination and filtering
export const fetchCampaigns = createAsyncThunk(
  "campaign/fetchCampaigns",
  async ({ page, limit, name }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/campaign/list", // Correct API endpoint for fetching campaign list
        { page, limit, name },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      // Expect response.data = { campaigns: [...], total: number }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Copy a campaign, then refresh campaign list
export const copyCampaign = createAsyncThunk(
  "campaign/copyCampaign",
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      await axios.post(
        `/campaign/copy/${id}`,
        null,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const { page, limit, nameFilter } = getState().campaign;
      dispatch(fetchCampaigns({ page, limit, name: nameFilter }));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete a campaign, then refresh campaign list
export const deleteCampaign = createAsyncThunk(
  "campaign/deleteCampaign",
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      await axios.delete(
        `/campaign/delete/${id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const { page, limit, nameFilter } = getState().campaign;
      dispatch(fetchCampaigns({ page, limit, name: nameFilter }));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

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
      state.page = 1; // Reset page on filter change
    },
    resetFilters(state) {
      state.nameFilter = "";
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload.campaigns;
        state.total = action.payload.total;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch campaigns";
      })
      .addCase(copyCampaign.rejected, (state, action) => {
        state.error = action.payload || "Failed to copy campaign";
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete campaign";
      });
  },
});

export const { setPage, setNameFilter, resetFilters } = campaignSlice.actions;
export default campaignSlice.reducer;

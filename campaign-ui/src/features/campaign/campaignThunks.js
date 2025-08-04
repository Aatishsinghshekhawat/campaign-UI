import {
  fetchCampaignsStart,
  fetchCampaignsSuccess,
  fetchCampaignsFailure,
} from "./campaignSlice";

const getTokenHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchCampaigns = ({ page, limit, name }) => async (dispatch) => {
  try {
    dispatch(fetchCampaignsStart());

    const response = await fetch("/campaign/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getTokenHeader(),
      },
      body: JSON.stringify({ page, limit, name }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "API error");
    }
    const data = await response.json();
    dispatch(fetchCampaignsSuccess({
      campaigns: data.campaigns,
      total: data.total,
    }));
  } catch (error) {
    dispatch(fetchCampaignsFailure(error.message));
  }
};

export const copyCampaign = (id) => async (dispatch, getState) => {
  try {
    const response = await fetch(`/campaign/copy/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getTokenHeader(),
      },
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "API error");
    }
    const { page, limit, nameFilter } = getState().campaign;
    dispatch(fetchCampaigns({ page, limit, name: nameFilter }));
  } catch (error) {
    alert(`Failed to copy campaign: ${error.message}`);
  }
};

export const deleteCampaign = (id) => async (dispatch, getState) => {
  try {
    const response = await fetch(`/campaign/delete/${id}`, {
      method: "DELETE",
      headers: getTokenHeader(),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "API error");
    }
    const { page, limit, nameFilter } = getState().campaign;
    dispatch(fetchCampaigns({ page, limit, name: nameFilter }));
  } catch (error) {
    alert(`Failed to delete campaign: ${error.message}`);
  }
};

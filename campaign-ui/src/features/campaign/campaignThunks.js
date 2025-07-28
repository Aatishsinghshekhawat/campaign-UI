import {
    fetchCampaignsStart,
    fetchCampaignsSuccess,
    fetchCampaignsFailure,
  } from "./campaignSlice";
  
  const mockedCampaigns = [
    {
      id: 1,
      name: "campaign-1",
      channel: "email",
      status: "Published",
      startDate: "2025-07-25T10:00:00Z",
      repeat: true,
      createdAt: "2025-06-10",
      modifiedAt: "2025-06-15",
    },
    {
      id: 2,
      name: "campaign-2",
      channel: "sms",
      status: "Draft",
      startDate: "2025-12-01T08:00:00Z",
      repeat: false,
      createdAt: "2025-05-20",
      modifiedAt: "2025-05-22",
    },
  ];
  
  export const fetchCampaigns = ({ page, limit, name }) => async (dispatch) => {
    try {
      dispatch(fetchCampaignsStart());
  
      let filtered = mockedCampaigns;
      if (name) {
        filtered = mockedCampaigns.filter((c) =>
          c.name.toLowerCase().includes(name.toLowerCase())
        );
      }
  
      const total = filtered.length;
      const startIndex = (page - 1) * limit;
      const pagedCampaigns = filtered.slice(startIndex, startIndex + limit);
      await new Promise((r) => setTimeout(r, 500));
  
      dispatch(fetchCampaignsSuccess({ campaigns: pagedCampaigns, total }));
    } catch (error) {
      dispatch(fetchCampaignsFailure(error.toString()));
    }
  };
  
  export const copyCampaign = (id) => async (dispatch) => {
    alert(`Copy action triggered for campaign ID: ${id} (Not implemented)`);
  };
  
  export const deleteCampaign = (id) => async (dispatch) => {
    alert(`Delete action triggered for campaign ID: ${id} (Not implemented)`);
  };
  
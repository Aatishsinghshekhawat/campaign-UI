import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPage, setNameFilter, resetFilters } from "../features/campaign/campaignSlice";
import { fetchCampaigns, deleteCampaign, copyCampaign } from "../features/campaign/campaignThunks";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaCopy, FaTrash } from "react-icons/fa";

const CampaignsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { campaigns, total, page, limit, nameFilter, loading, error } = useSelector(state => state.campaign);

  useEffect(() => {
    dispatch(fetchCampaigns({ page, limit, name: nameFilter }));
  }, [page, limit, nameFilter, dispatch]);

  const handleCreate = () => {
    navigate("/campaigns/create/step1");
  };

  const handleEdit = (id) => {
    navigate(`/campaigns/edit/${id}`);
  };

  const handleCopy = (id) => {
    dispatch(copyCampaign(id));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      dispatch(deleteCampaign(id));
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-7xl px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-700">Campaigns</h1>
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition"
          >
            + Create Campaign
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <input
            type="text"
            placeholder="Filter by Name"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
            value={nameFilter}
            onChange={(e) => dispatch(setNameFilter(e.target.value))}
          />
          <button
            onClick={() => dispatch(resetFilters())}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Reset Filters
          </button>
        </div>

        {loading ? (
          <p className="text-center py-12 text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center py-12 text-red-500">Error: {error}</p>
        ) : campaigns.length === 0 ? (
          <p className="text-center py-12 text-gray-500">No campaigns found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Name</th>
                  <th className="text-left px-6 py-3 font-medium">Channel</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Start Date</th>
                  <th className="text-left px-6 py-3 font-medium">Repeat</th>
                  <th className="text-left px-6 py-3 font-medium">Created At</th>
                  <th className="text-left px-6 py-3 font-medium">Modified At</th>
                  <th className="text-left px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">

                    <td className="px-6 py-3 text-gray-800">{campaign.name}</td>
                    <td className="px-6 py-3 text-gray-800 capitalize">{campaign.channel}</td>
                    <td className="px-6 py-3 text-gray-800 capitalize">{campaign.status}</td>
                    <td className="px-6 py-3 text-gray-800 whitespace-nowrap">
                      {campaign.startDate
                        ? new Date(campaign.startDate).toLocaleString(undefined, {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="px-6 py-3 text-gray-800">
                        {campaign.repeat ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-3 text-gray-800">
                        {campaign.createdAt
                            ? new Date(campaign.createdAt).toLocaleDateString()
                            : "—"}
                    </td>
                    <td className="px-6 py-3 text-gray-800">
                      {campaign.modifiedAt
                        ? new Date(campaign.modifiedAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-3 space-x-2">
                      <button
                        onClick={() => handleEdit(campaign.id)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label={`Edit campaign ${campaign.name}`}
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleCopy(campaign.id)}
                        className="text-green-600 hover:text-green-800"
                        aria-label={`Copy campaign ${campaign.name}`}
                      >
                        <FaCopy size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(campaign.id)}
                        className="text-red-600 hover:text-red-800"
                        aria-label={`Delete campaign ${campaign.name}`}
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page <= 1}
            onClick={() => dispatch(setPage(page - 1))}
            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50 text-sm"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {Math.max(1, Math.ceil(total / limit))}
          </span>
          <button
            disabled={page >= Math.ceil(total / limit)}
            onClick={() => dispatch(setPage(page + 1))}
            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50 text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;

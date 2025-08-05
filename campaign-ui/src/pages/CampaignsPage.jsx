// src/pages/CampaignsPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCampaigns,
  copyCampaign,
  deleteCampaign,
  setPage,
  setNameFilter,
  resetFilters,
} from "../features/campaign/campaignSlice";
import { FaEdit, FaTrash, FaCopy } from "react-icons/fa";

const CampaignsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { campaigns, total, page, limit, nameFilter, loading, error } = useSelector(
    (state) => state.campaign
  );

  useEffect(() => {
    dispatch(fetchCampaigns({ page, limit, name: nameFilter }));
  }, [dispatch, page, limit, nameFilter]);

  const totalPages = Math.ceil(total / limit);

  const onPageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    dispatch(setPage(newPage));
  };

  const onCopyCampaign = (id) => {
    if (window.confirm("Copy this campaign?")) {
      dispatch(copyCampaign(id));
    }
  };

  const onDeleteCampaign = (id) => {
    if (window.confirm("Delete this campaign?")) {
      dispatch(deleteCampaign(id));
    }
  };

  const onFilterChange = (e) => {
    dispatch(setNameFilter(e.target.value));
  };

  const onResetFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Campaigns</h1>
        <button
          onClick={() => navigate("/campaigns/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition"
        >
          + Create Campaign
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Filter by campaign name"
          className="border border-gray-300 rounded px-3 py-2 text-sm flex-grow max-w-sm"
          value={nameFilter}
          onChange={onFilterChange}
        />
        <button
          onClick={onResetFilters}
          className="text-sm text-gray-500 hover:text-gray-700 transition"
        >
          Reset Filters
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-6 py-3 font-medium">S.No.</th>
              <th className="text-left px-6 py-3 font-medium">Name</th>
              <th className="text-left px-6 py-3 font-medium">Channel</th>
              <th className="text-left px-6 py-3 font-medium">Start Date</th>
              <th className="text-left px-6 py-3 font-medium">Repeat</th>
              <th className="text-left px-6 py-3 font-medium">Status</th>
              <th className="text-left px-6 py-3 font-medium">Created At</th>
              <th className="text-left px-6 py-3 font-medium">Modified At</th>
              <th className="text-left px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-gray-500">
                  Loading campaigns...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-red-600">
                  Error: {error}
                </td>
              </tr>
            ) : campaigns.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-gray-500">
                  No campaigns found.
                </td>
              </tr>
            ) : (
              campaigns.map((c, idx) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">{(page - 1) * limit + idx + 1}</td>
                  <td className="px-6 py-3">{c.name}</td>
                  <td className="px-6 py-3 capitalize">{c.channel}</td>
                  <td className="px-6 py-3">
                    {c.startDate
                      ? new Date(c.startDate).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </td>
                  <td className="px-6 py-3">{c.repeat ? "Yes" : "No"}</td>
                  <td className="px-6 py-3">{c.status}</td>
                  <td className="px-6 py-3">
                    {c.createdDate
                      ? new Date(c.createdDate).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className="px-6 py-3">
                    {c.modifiedDate
                      ? new Date(c.modifiedDate).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className="px-6 py-3 space-x-2">
                    <button
                      aria-label="Edit"
                      title="Edit campaign"
                      onClick={() => alert("Editing only in next iteration")}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      aria-label="Copy"
                      title="Copy campaign"
                      onClick={() => onCopyCampaign(c.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaCopy />
                    </button>
                    <button
                      aria-label="Delete"
                      title="Delete campaign"
                      onClick={() => onDeleteCampaign(c.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-3 mt-4 flex-wrap">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className={`px-3 py-1 rounded border ${
              page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 rounded border ${
                p === page
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded border ${
              page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;

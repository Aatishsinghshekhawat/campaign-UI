import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPage,
  setTitle,
  setStatus,
  resetFilters,
} from "../features/template/templateSlice";
import { useNavigate } from "react-router-dom";
import { fetchTemplates } from "../features/template/templateThunks";
import { FaEye } from "react-icons/fa";

const TemplatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { templates, total, page, limit, title, status, loading, error } = useSelector(
    (state) => state.template
  );

  useEffect(() => {
    dispatch(fetchTemplates({ page, limit, title, status }));
  }, [page, title, status, dispatch, limit]);

  const handleContentClick = (id, hasContent) => {
    navigate(`/template/builder/${id}${hasContent ? "" : "?mode=add"}`);
  };

  const handleView = (id) => {
    navigate(`/template/builder/${id}?mode=view`);
  };

  const handleCreate = () => {
    navigate("/template/create");
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-6xl px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-700">Templates</h1>
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition"
          >
            + Create Template
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <input
            type="text"
            placeholder="Filter by Title"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
            value={title}
            onChange={(e) => dispatch(setTitle(e.target.value))}
          />
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={status}
            onChange={(e) => dispatch(setStatus(e.target.value))}
          >
            <option value="">All Status</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
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
        ) : templates.length === 0 ? (
          <p className="text-center py-12 text-gray-500">No templates found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Title</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Created</th>
                  <th className="text-left px-6 py-3 font-medium">Content</th>
                  <th className="text-left px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {templates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-800">{template.title}</td>
                    <td className="px-6 py-3 text-gray-800 capitalize">{template.status}</td>
                    <td className="px-6 py-3 text-gray-800 whitespace-nowrap">
                      {template.createdDate
                        ? new Date(template.createdDate).toLocaleDateString(undefined, {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        className={`text-sm font-medium rounded-md px-3 py-1 transition
                          ${
                            template.content
                              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                              : "bg-yellow-400 hover:bg-yellow-500 text-white"
                          }`}
                        onClick={() => handleContentClick(template.id, !!template.content)}
                      >
                        {template.content ? "Update" : "Add"}
                      </button>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        className="text-gray-600 hover:text-gray-900 transition"
                        onClick={() => handleView(template.id)}
                        aria-label={`View template ${template.title}`}
                      >
                        <FaEye size={20} />
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

export default TemplatePage;

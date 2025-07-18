import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../features/list/listSlice";
import { fetchLists, addList } from "../features/list/listThunks";
import { useNavigate } from "react-router-dom";
import { FaEye, FaPen } from "react-icons/fa";
import { toast } from "react-toastify";

const List = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    lists = [],
    total = 0,
    currentPage = 1,
    limit = 5,
    loading = false,
    error = null,
  } = useSelector((state) => state.list || {});

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(fetchLists({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  const handleAddList = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("List name is required");
      return;
    }

    try {
      await dispatch(addList({ name })).unwrap();
      toast.success("List added successfully");
      setName("");
      setShowForm(false);
      dispatch(fetchLists({ page: currentPage, limit }));
    } catch (err) {
      toast.error(err || "Failed to add list");
    }
  };

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setPage(newPage));
    }
  };

  const handleView = (id) => navigate(`/list/${id}`);
  const handleEdit = (id) => navigate(`/list/${id}`);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Lists</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Cancel" : "Add List"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddList} className="mb-4">
          <input
            type="text"
            placeholder="List Name"
            className="border px-3 py-2 rounded mr-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">S.No</th>
              <th className="py-2 px-4 border">List Name</th>
              <th className="py-2 px-4 border">Audience Count</th>
              <th className="py-2 px-4 border">Created Date</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-red-600">
                  {error}
                </td>
              </tr>
            ) : (lists || []).length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No lists found
                </td>
              </tr>
            ) : (
              lists.map((list, index) => (
                <tr key={list.id || index} className="text-center">
                  <td className="py-2 px-4 border">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="py-2 px-4 border">{list.name}</td>
                  <td className="py-2 px-4 border">{list.audienceCount ?? 0}</td>
                  <td className="py-2 px-4 border">
                    {list.createdDate
                      ? new Date(list.createdDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-2 px-4 border flex justify-center gap-4">
                    <button onClick={() => handleView(list.id)} title="View">
                      <FaEye className="text-blue-600 hover:text-blue-800" />
                    </button>
                    <button onClick={() => handleEdit(list.id)} title="Edit">
                      <FaPen className="text-green-600 hover:text-green-800" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700"
            }`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => (
            <button
              key={pg}
              onClick={() => handlePageChange(pg)}
              className={`px-3 py-1 border rounded ${
                pg === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {pg}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default List;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListItems } from "../features/listItem/listItemThunks";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ListItem = () => {
  const dispatch = useDispatch();
  const { id: listId } = useParams();

  const {
    items = [],
    loading,
    error,
    currentPage,
    totalPages,
  } = useSelector((state) => state.listItem || {});

  // Get list metadata from list slice
  const list = useSelector((state) =>
    state.list?.lists?.find((l) => l.id === Number(listId))
  );

  useEffect(() => {
    if (listId) {
      dispatch(fetchListItems({ listId, page: currentPage }));
    }
  }, [dispatch, listId, currentPage]);

  const handlePageChange = (newPage) => {
    dispatch(fetchListItems({ listId, page: newPage }));
  };

  return (
    <div className="p-6">
      {/* === Header Info === */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-1">
          {list?.name || "List Detail"}
        </h2>
        <p className="text-gray-600">
          <span className="font-medium">Audience Count:</span>{" "}
          {list?.audienceCount?.toLocaleString() || 0}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Created:</span>{" "}
          {list?.createdDate
            ? new Date(list.createdDate).toLocaleDateString()
            : "-"}
        </p>
      </div>

      {/* === Upload CSV Button === */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => toast.info("CSV upload coming soon")}
        >
          Upload CSV
        </button>
      </div>

      {/* === Table === */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : items.length === 0 ? (
        <p>No list items found.</p>
      ) : (
        <>
          <table className="min-w-full bg-white shadow rounded overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">S.No</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{(currentPage - 1) * 10 + index + 1}</td>
                  <td className="px-4 py-2">{item.email}</td>
                  <td className="px-4 py-2">
                    {new Date(item.createdDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* === Pagination === */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListItem;

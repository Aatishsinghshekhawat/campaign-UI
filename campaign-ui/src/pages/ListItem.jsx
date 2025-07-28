import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Papa from "papaparse";
import { toast } from "react-toastify";
import {
  fetchListItems,
  uploadListItemsCSV,
  deleteListItem,
  deleteList,
} from "../features/listItem/listItemThunks";
import { setPage } from "../features/listItem/listItemSlice";
import { FaTrash, FaTrashAlt } from "react-icons/fa";

const VALID_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const ListItem = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: listIdParam } = useParams();
  const listId = Number(listIdParam);
  const inputRef = useRef();

  const [uploading, setUploading] = useState(false);

  const list = useSelector((state) =>
    state.list?.lists.find((l) => l.id === listId)
  );

  const {
    items = [],
    loading = false,
    error = null,
    page = 1,
    total = 0,
    limit = 10,
  } = useSelector((state) => state.listItems || {});

  useEffect(() => {
    if (listId) {
      dispatch(fetchListItems({ listId, page, limit }));
    }
  }, [dispatch, listId, page, limit]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(total / limit)) {
      dispatch(setPage(newPage));
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await dispatch(deleteListItem(itemId)).unwrap();
      toast.success("Item deleted successfully");
      dispatch(fetchListItems({ listId, page, limit }));
    } catch (err) {
      toast.error(err || "Failed to delete item");
    }
  };

  const handleDeleteList = async () => {
    if (!window.confirm("Are you sure you want to delete this list?")) return;
    try {
      await dispatch(deleteList(listId)).unwrap();
      toast.success("List deleted successfully");
      navigate("/list");
    } catch (err) {
      toast.error(err || "Failed to delete list");
    }
  };

  const handleCsvChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please upload a valid CSV file");
      e.target.value = "";
      return;
    }
    setUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const headersLower = results.meta.fields.map((f) => f.toLowerCase());
        if (!headersLower.includes("email")) {
          toast.error("CSV must contain an 'Email' column");
          setUploading(false);
          e.target.value = "";
          return;
        }

        let rows = results.data.map((row) => {
          const email = (row.Email ?? row.email ?? "").trim();
          const name = (row.Name ?? row.name ?? "").trim();
          let status = "valid";
          if (!email || !VALID_EMAIL_REGEX.test(email)) status = "invalid";
          return { Email: email, Name: name, Status: status };
        });

        const seenEmails = new Set();
        rows.forEach((r) => {
          if (r.Status === "valid") {
            const lowerEmail = r.Email.toLowerCase();
            if (seenEmails.has(lowerEmail)) r.Status = "duplicate";
            else seenEmails.add(lowerEmail);
          }
        });

        const validRows = rows.filter((r) => r.Status === "valid");
        if (validRows.length === 0) {
          toast.warn("No valid rows to upload");
          setUploading(false);
          e.target.value = "";
          return;
        }

        try {
          await dispatch(uploadListItemsCSV({ listId, rows: validRows })).unwrap();
          toast.success("CSV uploaded successfully");
          dispatch(fetchListItems({ listId, page, limit }));
        } catch (error) {
          toast.error(error || "Upload failed");
        } finally {
          setUploading(false);
          e.target.value = "";
        }
      },
      error: (err) => {
        toast.error("CSV parsing error: " + err.message);
        setUploading(false);
        e.target.value = "";
      },
    });
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">{list?.name || "List"}</h2>
          <div className="text-gray-600">Audience: {list?.audienceCount || 0}</div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => inputRef.current.click()}
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {uploading ? "Uploading..." : "Upload CSV"}
          </button>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={inputRef}
            onChange={handleCsvChange}
            disabled={uploading}
          />
          <button
            onClick={handleDeleteList}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center space-x-1"
            title="Delete List"
          >
            <FaTrashAlt />
            <span>Delete List</span>
          </button>
        </div>
      </div>

      <h3 className="mb-2 font-semibold">Current List Items</h3>
      <div className="overflow-x-auto border rounded shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border text-left">S.No.</th>
              <th className="py-2 px-4 border text-left">Email</th>
              <th className="py-2 px-4 border text-left">Name</th>
              <th className="py-2 px-4 border text-left">Status</th>
              <th className="py-2 px-4 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-red-600">{error}</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">No items found.</td>
              </tr>
            ) : (
              items.map((item, idx) => {
                let variables = {};
                try {
                  variables = typeof item.variables === "string"
                    ? JSON.parse(item.variables)
                    : item.variables || {};
                } catch {
                  variables = {};
                }

                const statusLower = (item.status ?? "valid").toLowerCase();
                const statusColor =
                  statusLower === "valid"
                    ? "text-green-600"
                    : statusLower === "invalid"
                      ? "text-red-600"
                      : statusLower === "duplicate"
                        ? "text-yellow-600"
                        : "text-gray-600";

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border">{(page - 1) * limit + idx + 1}</td>
                    <td className="py-2 px-4 border">{item.email}</td>
                    <td className="py-2 px-4 border">
                      {item.name?.trim() || variables.Name?.trim() || "-"}
                    </td>
                    <td className={`py-2 px-4 border font-medium ${statusColor}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                        title={`Delete item ${item.email}`}
                        aria-label={`Delete item with email ${item.email}`}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {total > limit && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={`px-3 py-1 rounded border ${
              page === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
            aria-label="Previous page"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
            <button
              key={pg}
              onClick={() => handlePageChange(pg)}
              className={`px-3 py-1 rounded border ${
                page === pg ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              }`}
              aria-label={`Page ${pg}`}
            >
              {pg}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded border ${
              page === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ListItem;

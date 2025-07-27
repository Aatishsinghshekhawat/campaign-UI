import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Papa from "papaparse";
import { toast } from "react-toastify";
import { fetchListItems, uploadListItemsCSV, deleteListItem, deleteList } from "../features/listItem/listItemThunks";
import { FaTrash, FaTrashAlt } from "react-icons/fa";

const VALID_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const ListItem = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: listId } = useParams();
  const inputRef = useRef();

  const [uploading, setUploading] = useState(false);
  const [csvRows, setCsvRows] = useState([]);
  const [showCsvPreview, setShowCsvPreview] = useState(false);

  const list = useSelector((state) => state.list?.lists.find(l => l.id === Number(listId)));

  const { items = [], loading, error, page = 1, total = 0, limit = 10 } = useSelector((state) => state.listItems || {});

  useEffect(() => {
    if (listId) {
      dispatch(fetchListItems({ listId, page, limit }));
    }
  }, [dispatch, listId, page, limit]);

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
    if (!window.confirm("Are you sure you want to delete this list and all its items?")) return;
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
    setCsvRows([]);
    setShowCsvPreview(false);

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
        if (!results.meta.fields.some(h => h.toLowerCase() === "email")) {
          toast.error("CSV must contain an 'Email' column");
          setUploading(false);
          e.target.value = "";
          return;
        }

        const rows = results.data.map((row, idx) => {
          const email = row["Email"] || row["email"] || "";
          const name = row["Name"] || row["name"] || "";
          let status = "Valid";

          if (!email || !VALID_EMAIL_REGEX.test(email.trim())) {
            status = "Invalid Email";
          }

          return { id: idx, Email: email.trim(), Name: name.trim(), Status: status };
        });

        const emailSet = new Set();
        rows.forEach(row => {
          if (row.Status === "Valid") {
            const lowerEmail = row.Email.toLowerCase();
            if (emailSet.has(lowerEmail)) {
              row.Status = "Duplicate";
            } else {
              emailSet.add(lowerEmail);
            }
          }
        });

        setCsvRows(rows);
        setShowCsvPreview(true);

        const validRows = rows.filter(row => row.Status === "Valid");

        if (validRows.length === 0) {
          toast.warn("No valid rows available to upload.");
          setUploading(false);
          e.target.value = "";
          return;
        }

        try {
          await dispatch(uploadListItemsCSV({ listId, rows: validRows })).unwrap();
          toast.success("CSV uploaded and items saved.");
          dispatch(fetchListItems({ listId, page, limit }));
        } catch (err) {
          toast.error(err || "Failed to upload CSV");
        } finally {
          setUploading(false);
          e.target.value = "";
        }
      },
      error: (error) => {
        toast.error("Error parsing CSV: " + error.message);
        setUploading(false);
        e.target.value = "";
      }
    });
  };

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(fetchListItems({ listId, page: newPage, limit }));
    }
  };

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
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleCsvChange}
            className="hidden"
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

      {showCsvPreview && csvRows.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-2 font-semibold">Parsed CSV Data Preview</h3>
          <div className="overflow-x-auto border rounded shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 border text-left">S.No.</th>
                  <th className="px-4 py-2 border text-left">Email</th>
                  <th className="px-4 py-2 border text-left">Name</th>
                  <th className="px-4 py-2 border text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {csvRows.map((row, idx) => (
                  <tr key={row.id} className={row.Status !== "Valid" ? "bg-red-50" : undefined}>
                    <td className="px-4 py-2 border">{idx + 1}</td>
                    <td className="px-4 py-2 border">{row.Email}</td>
                    <td className="px-4 py-2 border">{row.Name}</td>
                    <td className={`px-4 py-2 border font-medium ${row.Status === "Valid" ? "text-green-600" : "text-red-600"}`}>
                      {row.Status !== "Valid" ? row.Status : "Valid"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <h3 className="mb-2 font-semibold">Current List Items</h3>
      <div className="overflow-x-auto border rounded shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border text-left">S.No.</th>
              <th className="px-4 py-2 border text-left">Email</th>
              <th className="px-4 py-2 border text-left">Name</th>
              <th className="px-4 py-2 border text-left">Status</th>
              <th className="px-4 py-2 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-red-600">
                  {error}
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No items found.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => {
                const status = item.status || "Valid";
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{(page - 1) * limit + idx + 1}</td>
                    <td className="px-4 py-2 border">{item.email}</td>
                    <td className="px-4 py-2 border">{item.name || "-"}</td>
                    <td className="px-4 py-2 border text-green-600 font-medium">{status}</td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        title="Delete item"
                        className="text-red-600 hover:text-red-800"
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
          >
            Prev
          </button>
          {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded border ${
                page === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === Math.ceil(total / limit)}
            className={`px-3 py-1 rounded border ${
              page === Math.ceil(total / limit) ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ListItem;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchListMetaById, fetchListItemById, uploadCSV } from '../features/listItem/listItemThunks';
import { toast } from 'react-toastify';

const ListItem = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [csvFile, setCsvFile] = useState(null);

  const { listMeta, listItems, loading, error } = useSelector((state) => state.listItem || {});

  useEffect(() => {
    if (id) {
      dispatch(fetchListMetaById(id));
      dispatch(fetchListItemById(id)); // optional: only if fetching 1 item by ID
    }
  }, [dispatch, id]);

  const handleUpload = async () => {
    if (!csvFile) return toast.error('Please select a CSV file to upload.');

    const formData = new FormData();
    formData.append('file', csvFile); // 🔄 key must be 'file' for backend
    formData.append('listId', id);

    try {
      await dispatch(uploadCSV({ file: csvFile })).unwrap();
      toast.success('CSV uploaded successfully');
      dispatch(fetchListItemById(id)); // Refresh items if needed
      setCsvFile(null);
    } catch (err) {
      toast.error(err || 'Failed to upload CSV');
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {listMeta?.name || 'Loading...'}
          </h2>
          <p className="text-sm text-gray-500">
            Audience Count: <strong>{listMeta?.audienceCount ?? 0}</strong> | Created:{' '}
            {listMeta?.createdDate
              ? new Date(listMeta.createdDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : '—'}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files[0])}
            className="text-sm"
          />
          <button
            onClick={handleUpload}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            disabled={!csvFile}
          >
            Upload CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">S.No.</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Variables</th>
              <th className="px-4 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="text-center text-red-500 py-4">{error}</td>
              </tr>
            ) : listItems?.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-4">No items found</td>
              </tr>
            ) : (
              listItems?.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.email}</td>
                  <td className="px-4 py-2">{JSON.stringify(item.variables)}</td>
                  <td className="px-4 py-2">
                    {new Date(item.createdDate).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListItem;

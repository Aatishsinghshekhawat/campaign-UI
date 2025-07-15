import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

const ListItem = () => {
  const { id } = useParams();
  const [listDetail, setListDetail] = useState(null);

  useEffect(() => {
    const fetchListDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/list/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListDetail(response.data);
      } catch (error) {
        console.error("Failed to fetch list detail:", error);
      }
    };

    fetchListDetail();
  }, [id]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {listDetail ? (
        <>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-700">{listDetail.name}</h2>
            <p className="text-sm text-gray-500">
              Audience: {listDetail.audienceCount} | Created:{" "}
              {new Date(listDetail.createdDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="border-dashed border-2 border-gray-300 rounded p-4 text-center">
            <p className="text-gray-600 mb-4">Upload a CSV to import list items.</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded" disabled>
              Upload CSV
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">Loading list details...</p>
      )}
    </div>
  );
};

export default ListItem;

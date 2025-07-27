import React, { useEffect, useRef, useState } from "react";
import EmailEditor from "react-email-editor";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateTemplateContent } from "../features/template/templateThunks";

const TemplateBuilder = () => {
  const { id } = useParams();
  const { search } = useLocation();
  const isView = new URLSearchParams(search).get("mode") === "view";

  const editorRef = useRef(null);

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/template/${id}`);
        if (isMounted) {
          setStatus(res.data.status);
          setTimeout(() => {
            if (
              res.data.content &&
              editorRef.current &&
              typeof editorRef.current.loadDesign === "function"
            ) {
              try {
                const design = JSON.parse(res.data.content);
                editorRef.current.loadDesign(design);
              } catch {
                setError("Failed to parse template content.");
              }
            }
          }, 300);
        }
      } catch {
        setError("Failed to load template.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTemplate();
    return () => {
      isMounted = false;
    };
  }, [id, editorLoaded]);

  const handleEditorLoad = (unlayer) => {
    editorRef.current = unlayer;
    setEditorLoaded(true);
  };

  const handleSave = () => {
    if (!editorRef.current || typeof editorRef.current.saveDesign !== "function") {
      toast.error("Email editor is not ready yet. Please wait.");
      return;
    }
    setSaving(true);
    editorRef.current.saveDesign(async (design) => {
      try {
        await axios.put(`/template/update/${id}`, {
          content: JSON.stringify(design),
        });
        dispatch(updateTemplateContent({ id: Number(id), content: JSON.stringify(design) }));
        toast.success("Template saved successfully");
        navigate("/template");
      } catch {
        toast.error("Failed to save template.");
      } finally {
        setSaving(false);
      }
    });
  };

  const handleToggleStatus = async () => {
    try {
      const { data } = await axios.put(`/template/toggle/${id}`);
      setStatus(data.status);
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  if (loading) {
    return <div className="p-4">Loading template...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Email Builder</h2>
      {status && (
        <div className="flex items-center gap-4 mb-4">
          <span>
            Status: <b>{status}</b>
          </span>
          {!isView && (
            <button
              className="bg-indigo-500 text-white px-3 py-1 rounded"
              onClick={handleToggleStatus}
            >
              Toggle Status
            </button>
          )}
        </div>
      )}
      {!isView && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        >
          {saving ? "Saving..." : "Save Template"}
        </button>
      )}
      <EmailEditor
        ref={editorRef}
        readOnly={isView}
        onLoad={handleEditorLoad}
        minHeight={600}
      />
    </div>
  );
};

export default TemplateBuilder;

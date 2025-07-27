import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TemplateView = () => {
  const { id } = useParams();
  const [html, setHtml] = useState('');

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`http://localhost:3000/template/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const unlayer = require('unlayer');
        unlayer.render(data.design, (renderedHtml) => {
          setHtml(renderedHtml.html);
        });
      } catch (error) {
        setHtml('<p>Error loading template</p>');
      }
    };

    fetchTemplate();
  }, [id]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Template Preview</h2>
      <div
        className="border p-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default TemplateView;

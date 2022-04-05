import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const STORAGE_API_TOKEN = process.env.STORAGE_API_TOKEN;
const API = process.env.API;
const BUCKET = process.env.BUCKET;

const Main = () => {
  const [file, setFile] = useState<File | undefined>();

  useEffect(() => {
    if (!STORAGE_API_TOKEN || !API || !BUCKET)
      throw new Error('Not all env are set, check the .env.development example');
  }, []);

  const onUpload = useCallback(() => {
    if (!file) throw new Error('No file to upload');

    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append('file', file, file.name);

    formData.append('path', '/');
    console.log('upload stared at', new Date().toLocaleString());
    return axios
      .post(`${API}/bucket/${BUCKET}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${STORAGE_API_TOKEN}`,
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = ((progressEvent.loaded * 100) / progressEvent.total).toFixed(2);
          console.log(`${percentCompleted}%`);
        },
      })
      .then(async ({ data }) => {
        console.log('upload finished at', new Date().toLocaleString());
        console.log('data', data);
      })
      .catch(e => {
        console.error(e);
        return Promise.reject(e);
      });
  }, [file]);

  const onFileSelected = useCallback((e: ChangeEvent<HTMLInputElement> | undefined) => {
    if (!e) return;

    const fileToUpload = e?.target?.files?.[0];

    if (!fileToUpload) throw new Error('No file selected');

    setFile(fileToUpload);
  }, []);

  return (
    <>
      <h2 className="test">React simple upload</h2>
      <p className="env">
        {import.meta.env.VITE_TEST || process.env.NODE_ENV === 'test' ? 'development' : 'production'}
      </p>
      <input id="upload" type="file" multiple={false} onChange={onFileSelected} />
      <br />
      <button type="button" onClick={onUpload}>
        &gt;&gt;Upload&lt;&lt;
      </button>
    </>
  );
};

export default Main;

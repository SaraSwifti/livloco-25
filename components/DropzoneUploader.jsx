'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const DropzoneUploader = ({ onUpload, label }) => {
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-dashed border-2 p-4 rounded cursor-pointer text-center ${
        isDragActive ? 'border-green-600 bg-green-50' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      <p>{label}</p>
      <p className="text-sm text-gray-400">(Drag & drop or click to upload)</p>
    </div>
  );
};

export default DropzoneUploader;
'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const DropzoneUploader = ({ label, onUpload, uploadedFileName }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0])
      }
    },
    [onUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    }
  })

  return (
    <div className='my-2'>
      <label className='block text-sm font-medium text-gray-700 mb-1'>
        {label}
      </label>
      <div
        {...getRootProps()}
        className={`border-dashed border-2 rounded p-4 text-center cursor-pointer bg-white ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        {uploadedFileName ? (
          <p className='text-green-600 font-semibold'>
            ✅ Uploaded: {uploadedFileName}
          </p>
        ) : (
          <p className='text-gray-500'>
            Drag and drop an image here, or click to select a file
          </p>
        )}
      </div>
    </div>
  )
}

export default DropzoneUploader

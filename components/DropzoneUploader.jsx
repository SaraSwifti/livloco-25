'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'

const DropzoneUploader = ({ label, onUpload, uploadedFileName, existingImageUrl }) => {
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

      {/* Show existing image thumbnail if available */}
      {existingImageUrl && (
        <div className='mb-3 p-3 bg-gray-50 border border-gray-200 rounded'>
          <p className='text-xs text-gray-600 mb-2 font-medium'>Current Image:</p>
          <div className='relative w-32 h-32 mx-auto'>
            <Image
              src={existingImageUrl}
              alt='Current uploaded image'
              fill
              className='object-cover rounded border border-gray-300'
            />
          </div>
          <p className='text-xs text-gray-500 text-center mt-2'>
            Upload a new image below to replace
          </p>
        </div>
      )}

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
            {existingImageUrl
              ? 'Drag and drop a new image here, or click to select a file'
              : 'Drag and drop an image here, or click to select a file'
            }
          </p>
        )}
      </div>
    </div>
  )
}

export default DropzoneUploader

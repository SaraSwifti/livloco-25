'use client'

import DropzoneUploader from '@/components/DropzoneUploader'

const SellingEntry = ({
  index,
  images,
  uploadedFileNames,
  handleDropzoneUpload,
  initialData,
  deleteImage,
  setDeleteImage,
  setImages,
}) => {
  const imageKey = `selling${index + 1}`

  return (
    <div className='bg-white p-4 rounded border space-y-4'>
      <h3 className='text-lg font-semibold'>Selling {index + 1}</h3>

      {/* Description */}
      <div>
        <label
          htmlFor={`selling${index + 1}_description`}
          className='block text-sm font-medium text-black'
        >
          Description{' '}
          {index === 0 && <span className='text-red-500'>required</span>}
        </label>
        <input
          placeholder='e.g. Grass-fed beef, CNC Services'
          id={`selling${index + 1}_description`}
          name={`selling.selling${index + 1}.description`}
          type='text'
          className='mt-1 block w-full bg-gray-100 border rounded p-2'
          defaultValue={initialData?.description || ''}
          required={index === 0}
        />
      </div>

      {/* Price */}
      <div>
        <label
          htmlFor={`selling${index + 1}_price`}
          className='block text-sm font-medium'
        >
          Price
        </label>
        <input
          placeholder='$/bushel, variable/job, free'
          id={`selling${index + 1}_price`}
          name={`selling.selling${index + 1}.price`}
          type='text'
          className='mt-1 bg-gray-100 block w-full border rounded p-2'
          defaultValue={initialData?.price || ''}
        />
      </div>

      {/* Image Upload */}
      <div>
        <DropzoneUploader
          label='Upload image if you have one'
          onUpload={(file) => handleDropzoneUpload(file, imageKey)}
          uploadedFileName={uploadedFileNames[imageKey]}
          className='hidden'
          id={`selling${index + 1}_image`}
          accept='image/*'
          existingImageUrl={images[imageKey]}
        />
        {images[imageKey] && !uploadedFileNames[imageKey] && (
          <div className='mt-2 flex items-center gap-2'>
            <input
              type='checkbox'
              id={`delete_${imageKey}_image`}
              checked={deleteImage?.[imageKey] || false}
              onChange={(e) => {
                setDeleteImage((prev) => ({
                  ...prev,
                  [imageKey]: e.target.checked,
                }))
                if (e.target.checked) {
                  setImages((prev) => ({ ...prev, [imageKey]: '' }))
                } else {
                  setImages((prev) => ({
                    ...prev,
                    [imageKey]: initialData?.image || '',
                  }))
                }
              }}
              className='w-4 h-4'
            />
            <label
              htmlFor={`delete_${imageKey}_image`}
              className='text-sm text-red-600 font-medium cursor-pointer'
            >
              Delete and do not use an image at this time.
            </label>
          </div>
        )}
        <input
          type='hidden'
          name={`selling.selling${index + 1}.image`}
          value={images[imageKey] || ''}
        />
      </div>
    </div>
  )
}

export default SellingEntry

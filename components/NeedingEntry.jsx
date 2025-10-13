'use client'

import DropzoneUploader from '@/components/DropzoneUploader'

const NeedingEntry = ({ index, images, uploadedFileNames, handleDropzoneUpload, initialData, deleteImage, setDeleteImage, setImages }) => {
  const imageKey = `need${index + 1}`;

  return (
    <div className='bg-white p-4 rounded border space-y-4'>
      <h3 className='text-lg font-semibold'>Need {index + 1}</h3>

      {/* Description */}
      <div>
        <label
          htmlFor={`need${index + 1}_description`}
          className='block text-sm font-medium'
        >
          Description {index === 0 && <span className='text-red-500'>required</span>}
        </label>
        <input
          placeholder='Hedge Removal, Cement Work, Local Eggs'
          id={`need${index + 1}_description`}
          name={`needs.need${index + 1}.description`}
          type='text'
          className='mt-1 bg-gray-100 block w-full border rounded p-2'
          defaultValue={initialData?.description || ''}
          required={index === 0}
        />
      </div>

      {/* Type */}
      <div>
        <label className='block text-sm font-medium'>Type</label>
        <div className='flex items-center gap-6'>
          {['product', 'service'].map((type) => (
            <label
              key={type}
              htmlFor={`need${index + 1}_type_${type}`}
              className='flex items-center space-x-2'
            >
              <input
                type='radio'
                id={`need${index + 1}_type_${type}`}
                name={`needs.need${index + 1}.type`}
                value={type}
                defaultChecked={initialData?.type ? initialData.type === type : type === 'product'}
                className={`text-${type === 'product' ? 'blue' : 'green'}-600`}
                required
              />
              <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <DropzoneUploader
          label='Upload image if you have one'
          onUpload={(file) =>
            handleDropzoneUpload(file, imageKey)
          }
          uploadedFileName={uploadedFileNames[imageKey]}
          existingImageUrl={images[imageKey]}
        />
        {images[imageKey] && !uploadedFileNames[imageKey] && (
          <div className='mt-2 flex items-center gap-2'>
            <input
              type='checkbox'
              id={`delete_${imageKey}_image`}
              checked={deleteImage?.[imageKey] || false}
              onChange={(e) => {
                setDeleteImage(prev => ({ ...prev, [imageKey]: e.target.checked }));
                if (e.target.checked) {
                  setImages(prev => ({ ...prev, [imageKey]: '' }));
                } else {
                  setImages(prev => ({ ...prev, [imageKey]: initialData?.image || '' }));
                }
              }}
              className='w-4 h-4'
            />
            <label htmlFor={`delete_${imageKey}_image`} className='text-sm text-red-600 font-medium cursor-pointer'>
              Delete and do not use an image at this time.
            </label>
          </div>
        )}
        <input
          type='hidden'
          name={`needs.need${index + 1}.image`}
          value={images[imageKey] || ''}
        />
      </div>
    </div>
  )
}

export default NeedingEntry

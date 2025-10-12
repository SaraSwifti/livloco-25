'use client'

import DropzoneUploader from '@/components/DropzoneUploader'

const SellingEntry = ({ index, images, uploadedFileNames, handleDropzoneUpload, initialData }) => {
  return (
    <div className='bg-white p-4 rounded border space-y-4'>
      <h3 className='text-lg font-semibold'>Selling {index + 1}</h3>

      {/* Description */}
      <div>
        <label
          htmlFor={`selling${index + 1}_description`}
          className='block text-sm font-medium text-black'
        >
          Description
        </label>
        <input
          placeholder='e.g. Grass-fed beef, CNC Services'
          id={`selling${index + 1}_description`}
          name={`selling.selling${index + 1}.description`}
          type='text'
          className='mt-1 block w-full bg-gray-100 border rounded p-2'
          defaultValue={initialData?.description || ''}
        />
      </div>

      {/* Type */}
      <div>
        <label className='block text-sm font-medium mb-1'>Type</label>
        <div className='flex items-center gap-6'>
          {['product', 'service'].map((type) => (
            <label
              key={type}
              htmlFor={`selling${index + 1}_type_${type}`}
              className='flex items-center space-x-2'
            >
              <input
                type='radio'
                name={`selling.selling${index + 1}.type`}
                id={`selling${index + 1}_type_${type}`}
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
          onUpload={(file) =>
            handleDropzoneUpload(file, `selling${index + 1}`)
          }
          uploadedFileName={uploadedFileNames[`selling${index + 1}`]}
          className='hidden'
          id={`selling${index + 1}_image`}
          accept='image/*'
          existingImageUrl={images[`selling${index + 1}`]}
        />
        <input
          type='hidden'
          name={`selling.selling${index + 1}.image`}
          value={images[`selling${index + 1}`] || ''}
        />
      </div>
    </div>
  )
}

export default SellingEntry

'use Client'

import { useState } from 'react'

const AddSellNeed = () => {
  const [showSellNeedForm, setShowSellNeedForm] = useState(false)
  const [sellingItems, setSellingItems] = useState([
    { id: 1 },
    { id: 2 },
    { id: 3 },
  ])
  const [needItems, setNeedItems] = useState([{ id: 1 }, { id: 2 }, { id: 3 }])

  return (
    <div className='mt-6 border-t pt-4'>
      {/* Toggle */}
      <div className='flex items-center gap-3'>
        <label className='font-medium'>
          Add Selling/needing profile to make your LivLoco pofile Active
        </label>
        <input
          type='checkbox'
          checked={showSellNeedForm}
          onChange={(e) => setShowSellNeedForm(e.target.checked)}
          className='w-5 h-5'
        />
      </div>

      {/* Conditional form fields */}
      {showSellNeedForm ? (
        <>
          <div>
            {/* add selling information */}
            <div className='mt-4 space-y-4 bg-gray-100 border p-4 rounded-md'>
              <h1 className='font-bold text-2xl'>Selling</h1>
              {sellingItems.map((item, index) => (
                <div
                  key={item.id}
                  className='bg-white p-4 rounded border space-y-4'
                >
                  <h3 className='text-lg font-semibold'>Selling {index + 1}</h3>
                  {/* Description */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Description
                    </label>
                    <input
                      name={`selling${index + 1}_description`}
                      type='text'
                      className='mt-1 block w-full border rounded p-2'
                    />
                  </div>

                  {/* Type */}

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Type
                    </label>
                    <div className='flex items-center gap-6'>
                      <label className='flex items-center space-x-2'>
                        <input
                          type='radio'
                          name={`selling${index + 1}_type`}
                          value='product'
                          defaultChecked
                          className='text-blue-600'
                          required
                        />
                        <span>Product</span>
                      </label>

                      <label className='flex items-center space-x-2'>
                        <input
                          type='radio'
                          name={`selling${index + 1}_type`}
                          value='service'
                          className='text-green-600'
                          required
                        />
                        <span>Service</span>
                      </label>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Price
                    </label>
                    <input
                      name={`selling${index + 1}_price`}
                      type='text'
                      className='mt-1 block w-full border rounded p-2'
                    />
                  </div>

                  {/* Image */}
                  <div>
                    <label
                      htmlFor='image'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Upload image if you have one
                    </label>
                    <input
                      name={`selling${index + 1}_image`}
                      type='file'
                      className='mt-1 block w-full border rounded p-2'
                      id='image'
                      accept='image/*'
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* the needing entry feilds */}

            <div className='mt-4 space-y-4 bg-gray-50 border p-4 rounded-md'>
              <h1 className='font-bold text-2xl'>Needing</h1>
              {sellingItems.map((item, index) => (
                <div
      key={item.id}
      className='bg-white p-4 rounded border space-y-4'
    >
      <h3 className='text-lg font-semibold'>Need {index + 1}</h3>

      {/* Description */}
      <div>
        <label className='block text-sm font-medium text-gray-700'>
          Description
        </label>
        <input
          name={`need${index + 1}_description`}
          type='text'
          className='mt-1 block w-full border rounded p-2'
        />
      </div>

      {/* Type */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Type
        </label>
        <div className='flex items-center gap-6'>
          <label className='flex items-center space-x-2'>
            <input
              type='radio'
              name={`need${index + 1}_type`}
              value='product'
              defaultChecked
              onChange={() => setNeedType('product')}
              className='text-blue-600'
              required
            />
            <span>Product</span>
          </label>

          <label className='flex items-center space-x-2'>
            <input
              type='radio'
              name={`need${index + 1}_type`}
              value='service'
              onChange={() => setNeedType('service')}
              className='text-green-600'
              required
            />
            <span>Service</span>
          </label>
        </div>
      </div>

      {/* Conditionally show image input if product */}
      
        <div>
          <label
            htmlFor={`need${index + 1}_image`}
            className='block text-sm font-medium text-gray-700'
          >
            Upload image if you have one
          </label>
          <input
            name={`need${index + 1}_image`}
            type='file'
            className='mt-1 block w-full border rounded p-2'
            id={`need${index + 1}_image`}
            accept='image/*'
                              />
                              
                          </div>
                          </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Hidden fallbacks if toggle is off */}
          <input
            type='hidden'
            name='extraField1'
            value=''
          />
          <input
            type='hidden'
            name='extraField2'
            value=''
          />
        </>
      )}
    </div>
  )
}

export default AddSellNeed

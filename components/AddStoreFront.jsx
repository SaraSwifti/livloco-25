'use Client'

import { useState } from 'react'
const initialState = {
  locobiz_address: {
    post_permission: false,
    biz_phone: '',
    add_line1: '',
    add_line2: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'USA',
  },
  business_hours: {
    monday_hours: '',
    tuesday_hours: '',
    wednesday_hours: '',
    thursday_hours: '',
    friday_hours: '',
    saturday_hours: '',
    sunday_hours: '',
  },
}

const AddStoreFront = () => {
  const [showStoreFrontForm, setShowStoreFrontForm] = useState(false);

  const [formData, setFormData] = useState(initialState);

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      locobiz_address: {
        ...prev.locobiz_address,
        [name]: type === 'checkbox' ? checked : value,
      },
    }))
  }

  const handleHoursChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      business_hours: {
        ...prev.business_hours,
        [name]: value,
      },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitted data:', formData)
    // Add backend submission or validation here
  }

  return (
    <div className='mt-6 border-t pt-4'>
      {/* // Toggle for needing to post storefront// */}
      <div className='flex items-center gap-3'>
        <input
          type='checkbox'
          checked={showStoreFrontForm}
          onChange={(e) => setShowStoreFrontForm(e.target.checked)}
          className='w-5 h-5'
        />
      </div>
        <label className='font-medium'>
          Add storefront/farmstand address and hours if you have one.
        </label>
      
      {showStoreFrontForm ? (
        <>
          <h2 className='text-xl font-bold'>Storefront/Farmstand Address</h2>

          <label className='flex items-center space-x-2'>
            <input
              type='checkbox'
              name='post_permission'
              checked={formData.locobiz_address.post_permission}
              onChange={handleAddressChange}
              className='w-5 h-5'
            />
            <span>
              Allow LocoBiz storefront/farmstand address to be posted publicly
            </span>
          </label>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium'>LocoBiz Phone</label>
              <input
                type='tel'
                name='biz_phone'
                value={formData.locobiz_address.biz_phone}
                onChange={handleAddressChange}
                placeholder='+1234567890'
                className='mt-1 w-full rounded border p-2'
              />
            </div>

            <div>
              <label className='block text-sm font-medium'>
                {' '}
                Locobiz Address Line 1
              </label>
              <input
                type='text'
                name='add_line1'
                value={formData.locobiz_address.add_line1}
                onChange={handleAddressChange}
                required
                className='mt-1 w-full rounded border p-2'
              />
            </div>

            <div>
              <label className='block text-sm font-medium'>
                Address Line 2
              </label>
              <input
                type='text'
                name='add_line2'
                value={formData.locobiz_address.add_line2}
                onChange={handleAddressChange}
                className='mt-1 w-full rounded border p-2'
              />
            </div>

            <div>
              <label className='block text-sm font-medium'>City</label>
              <input
                type='text'
                name='city'
                value={formData.locobiz_address.city}
                onChange={handleAddressChange}
                required
                className='mt-1 w-full rounded border p-2'
              />
            </div>

            <div>
              <label className='block text-sm font-medium'>State</label>
              <input
                type='text'
                name='state'
                value={formData.locobiz_address.state}
                onChange={handleAddressChange}
                required
                className='mt-1 w-full rounded border p-2'
              />
            </div>

            <div>
              <label className='block text-sm font-medium'>Zip Code</label>
              <input
                type='text'
                name='zipcode'
                value={formData.locobiz_address.zipcode}
                onChange={handleAddressChange}
                required
                pattern='^\d{5}(-\d{4})?$'
                className='mt-1 w-full rounded border p-2'
              />
            </div>

            <div>
              <label className='block text-sm font-medium'>Country</label>
              <input
                type='text'
                name='country'
                value={formData.locobiz_address.country}
                onChange={handleAddressChange}
                className='mt-1 w-full rounded border p-2'
              />
            </div>
          </div>

          <h2 className='text-xl font-bold mt-6'>LocoBiz Business Hours</h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {Object.entries(formData.business_hours).map(([key, value]) => (
              <div key={key}>
                <label className='block text-sm font-medium capitalize'>
                  {key.replace('_hours', '')} Hours
                </label>
                <input
                  type='text'
                  name={key}
                  value={value}
                  onChange={handleHoursChange}
                  placeholder='e.g., 9am - 5pm, closed, keypad entry'
                  className='mt-1 w-full rounded border p-2'
                />
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default AddStoreFront

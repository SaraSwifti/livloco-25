'use client'
import addBusinessAction from '@/app/actions/addBusinessAction.js';

import { useState } from 'react';

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const BusinessAddForm = () => {
  // mapping and states to toggle needs and selling section

  const [showSellNeedForm, setShowSellNeedForm] = useState(false)
  const [sellingItems, setSellingItems] = useState([
    { id: 1 },
    { id: 2 },
    { id: 3 },
  ])
  const [needItems, setNeedItems] = useState([{ id: 1 }, { id: 2 }, { id: 3 }])
  // storefront marketstand needed data
  const [showStoreFrontForm, setShowStoreFrontForm] = useState(false)
  // farmers market toggle state
  const [showFarmersMarketForm, setShowFarmersMarketForm] = useState(false);
  return (
    <form action={addBusinessAction}>
      <h2 className='text-3xl text-center font-semibold mb-6'>
        Add Your LocoBusiness
      </h2>
      <p>
        (For LivLoco purposes only. Under no circumstances will Livloco sell or
        share your information. However we cannot prevent anyone from copying
        any information that you have voluntarily displayed)
      </p>

      <div className='mb-4'>
        <label className='block text-gray-700 font-bold mb-2'>
          LocoBusiness Name
        </label>
        <input
          type='text'
          id='name'
          name='name'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder=''
          required
        />
      </div>
      <div className='mb-4'>
        <label
          htmlFor='description'
          className='block text-gray-700 font-bold mb-2'
        >
          Description
        </label>
        <textarea
          id='description'
          name='description'
          className='border rounded w-full py-2 px-3'
          rows='4'
          placeholder='Add an optional description of your property'
        ></textarea>
      </div>
      <div className=''>
        <label
          htmlFor='zipcode'
          className='block text-gray-700 font-bold mb-2'
        >
          So That Your Neighbors Can Find you in a Location Search
        </label>
        <input
          type='text'
          id='zipcode'
          name='location.zipcode'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Zipcode'
        />
      </div>

      <div className='mb-4'>
        <label
          htmlFor='seller_name'
          className='block text-gray-700 font-bold mb-2'
        >
          Account Holder's Name
        </label>
        <input
          type='text'
          id='seller_name'
          name='seller_info.name.'
          className='border rounded w-full py-2 px-3'
          placeholder='Name'
        />
      </div>
      <div className='mb-4'>
        <label
          htmlFor='seller_email'
          className='block text-gray-700 font-bold mb-2'
        >
          Account Holder's Email Make this populate from their sign-in
          credentials?
        </label>
        <input
          type='email'
          id='seller_email'
          name='seller_info.email'
          className='border rounded w-full py-2 px-3'
          placeholder='Email address'
          required
        />
      </div>
      <div className='mb-4'>
        <label
          htmlFor='seller_phone'
          className='block text-gray-700 font-bold mb-2'
        >
          Account Holder's Phone (for account verification. Business phone can
          be added later for display if different)
        </label>
        <input
          type='tel'
          id='seller_phone'
          name='seller_info.phone'
          className='border rounded w-full py-2 px-3'
          placeholder='Phone'
        />
      </div>
      {/* Sellig and needing section */}
      <div className='mt-6 border-t pt-4'>
        {/* Toggle */}
        <div className='flex items-center gap-3'>
          <input
            type='checkbox'
            checked={showSellNeedForm}
            onChange={(e) => setShowSellNeedForm(e.target.checked)}
            className='w-5 h-5'
          />
          <label className='font-medium'>
            Add Selling/needing profile to make your LivLoco pofile Active
          </label>
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
                    <h3 className='text-lg font-semibold'>
                      Selling {index + 1}
                    </h3>
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
                {needItems.map((item, index) => (
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
      {/* adding storefront and farmstand component */}
<div className='mt-6 border-t pt-4'>
      {/* // Toggle for needing to post storefront// */}
      <div className='flex items-center gap-3'>
        <input
          type='checkbox'
          checked={showStoreFrontForm}
          onChange={(e) => setShowStoreFrontForm(e.target.checked)}
          className='w-5 h-5'
          />
          <label className='font-medium'>
          Add storefront/farmstand address and hours if you have one.
        </label>
      
      </div>
        
      {showStoreFrontForm ? (
        <>
          <h2 className='text-xl font-bold'>Storefront/Farmstand Address</h2>

          {/* <label className='flex items-center space-x-2'>
            <input
              type='checkbox'
              name='post_permission'
              checked={formData.locobiz_address.post_permission}
              // onChange={handleAddressChange}
              className='w-5 h-5'
            />
            <span>
              Allow LocoBiz storefront/farmstand address to be posted publicly
            </span>
          </label> */}

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium'>LocoBiz Phone</label>
              <input
                type='tel'
                name='biz_phone'
                // value={formData.locobiz_address.biz_phone}
                // onChange={handleAddressChange}
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
                // value={formData.locobiz_address.add_line1}
                // onChange={handleAddressChange}
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
                // value={formData.locobiz_address.add_line2}
                // onChange={handleAddressChange}
                className='mt-1 w-full rounded border p-2'
              />
            </div>

            <div>
              <label className='block text-sm font-medium'>City</label>
              <input
                type='text'
                name='city'
                // value={formData.locobiz_address.city}
                // onChange={handleAddressChange}
                required
                className='mt-1 w-full rounded border p-2'
              />
            </div>

            <div>
              <label className='block text-sm font-medium'>State</label>
              <input
                type='text'
                name='state'
                // value={formData.locobiz_address.state}
                // onChange={handleAddressChange}
                required
                className='mt-1 w-full rounded border p-2'
              />
            </div>

            <div>
              <label className='block text-sm font-medium'>Zip Code</label>
              <input
                type='text'
                name='zipcode'
                // value={formData.locobiz_address.zipcode}
                // onChange={handleAddressChange}
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
                // value={formData.locobiz_address.country}
                // onChange={handleAddressChange}
                className='mt-1 w-full rounded border p-2'
              />
            </div>
          </div>

          <h2 className='text-xl font-bold mt-6'>LocoBiz Business Hours</h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            
              <div>
                <label className='block text-sm font-medium capitalize'>
                  Monday's Hours
                </label>
                <input
                  type='text'
                  // name={key}
                  // value={value}
                  // onChange={handleHoursChange}
                  placeholder='e.g., 9am - 5pm, closed, keypad entry'
                  className='mt-1 w-full rounded border p-2'
                />
              </div>
              <div>
                <label className='block text-sm font-medium capitalize'>
                  Monday's Hours
                </label>
                <input
                  type='text'
                  // name={key}
                  // value={value}
                  // onChange={handleHoursChange}
                  placeholder='e.g., 9am - 5pm, closed, keypad entry'
                  className='mt-1 w-full rounded border p-2'
                />
              </div>
              <div>
                <label className='block text-sm font-medium capitalize'>
                  Monday's Hours
                </label>
                <input
                  type='text'
                  // name={key}
                  // value={value}
                  // onChange={handleHoursChange}
                  placeholder='e.g., 9am - 5pm, closed, keypad entry'
                  className='mt-1 w-full rounded border p-2'
                />
              </div>
              <div>
                <label className='block text-sm font-medium capitalize'>
                  Monday's Hours
                </label>
                <input
                  type='text'
                  // name={key}
                  // value={value}
                  // onChange={handleHoursChange}
                  placeholder='e.g., 9am - 5pm, closed, keypad entry'
                  className='mt-1 w-full rounded border p-2'
                />
              </div>
              <div>
                <label className='block text-sm font-medium capitalize'>
                  Monday's Hours
                </label>
                <input
                  type='text'
                  // name={key}
                  // value={value}
                  // onChange={handleHoursChange}
                  placeholder='e.g., 9am - 5pm, closed, keypad entry'
                  className='mt-1 w-full rounded border p-2'
                />
              </div>
              <div>
                <label className='block text-sm font-medium capitalize'>
                  Monday's Hours
                </label>
                <input
                  type='text'
                  // name={key}
                  // value={value}
                  // onChange={handleHoursChange}
                  placeholder='e.g., 9am - 5pm, closed, keypad entry'
                  className='mt-1 w-full rounded border p-2'
                />
              </div>
              <div>
                <label className='block text-sm font-medium capitalize'>
                  Monday's Hours
                </label>
                <input
                  type='text'
                  // name={key}
                  // value={value}
                  // onChange={handleHoursChange}
                  placeholder='e.g., 9am - 5pm, closed, keypad entry'
                  className='mt-1 w-full rounded border p-2'
                />
              </div>
              <div>
                <label className='block text-sm font-medium capitalize'>
                  Monday's Hours
                </label>
                <input
                  type='text'
                  // name={key}
                  // value={value}
                  // onChange={handleHoursChange}
                  placeholder='e.g., 9am - 5pm, closed, keypad entry'
                  className='mt-1 w-full rounded border p-2'
                />
              </div>
            
          </div>
        </>
      ) : null}
      </div>

      {/* Farmers Market days and location */}
<div className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={showFarmersMarketForm}
          // onChange={handleToggle}
           onChange={(e) => setShowFarmersMarketForm(e.target.checked)}
          className="w-5 h-5"
        />
        <label className="font-medium text-lg">
          Add Farmers Market locations if you attend any.
        </label>
      </div>

      {showFarmersMarketForm ? (
        <>
          <h2 className="text-xl font-bold mt-4">Farmers Market Locations</h2>

          {daysOfWeek.map((day) => (
            <div key={day} className="border rounded p-4 mb-4">
              <h3 className="text-lg font-semibold capitalize mb-2">{day}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium">Market Name</label>
                  <input
                    type="text"
                    name="farmers_market_name"
                    // value={data[day]?.farmers_market_name || ''}
                    // onChange={(e) => handleDayChange(e, day)}
                    className="mt-1 w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">City</label>
                  <input
                    type="text"
                    name="city"
                    // value={data[day]?.city || ''}
                    // onChange={(e) => handleDayChange(e, day)}
                    className="mt-1 w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">State</label>
                  <input
                    type="text"
                    name="state"
                    // value={data[day]?.state || ''}
                    // onChange={(e) => handleDayChange(e, day)}
                    className="mt-1 w-full border rounded p-2"
                  />
                </div>
              </div>
            </div>
          ))};
        </>
      ) : null}
   
    
    
    
  

      
      {/* submit button for everything */}
      <div>
        <button
          className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline '
          type='submit'
        >
          Add LocoBusiness
        </button>
      </div>
    </form>
  )
}

export default BusinessAddForm

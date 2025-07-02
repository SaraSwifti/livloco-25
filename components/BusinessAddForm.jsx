'use client'
import addBusinessAction from '@/app/actions/addBusinessAction.js'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import AddBusLaterPopout from '@/components/AddBusLaterPopout'
const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

const BusinessAddForm = ({ userEmail }) => {
  const router = useRouter()
  //skip add business form.
  const [skipAddBusiness, setSkipAddBusiness] = useState(false)
  const [description, setDescription] = useState('')
  const maxLength = 500
  const handleSkipPopOutCheckbox = (e) => {
    const checked = e.target.checked
    setSkipAddBusiness(checked)

    if (checked) {
      setShowPopOut(true) // Show the popout
      // router.push('/businesses') // Navigate immediately
    }
  }
  // Handle close of popout
  const handleClose = () => {
    setShowPopOut(false)
    router.push('/businesses') // redirect AFTER modal is closed
  }

  //showpopout for directions later
  const [showPopOut, setShowPopOut] = useState(false)

  //to handle phonnumber fomatting and saving as a string
  const [phone, setPhone] = useState('')
  const formatPhoneNumber = (value) => {
    const phoneDigits = value.replace(/\D/g, '').substring(0, 10)
    const phoneLength = phoneDigits.length

    if (phoneLength < 4) return phoneDigits
    if (phoneLength < 7) {
      return `(${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3)}`
    }
    return `(${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(
      3,
      6
    )}-${phoneDigits.slice(6, 10)}`
  }
  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

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
  const [showFarmersMarketForm, setShowFarmersMarketForm] = useState(false)
  const [showLocoBizUrl, setShowLocoBizUrl] = useState(false)
  return (
    <form action={addBusinessAction}>
      <div className='mt-4 bg-gray-200 space-y-4 border p-4 rounded-md'>
        <h2 className='text-3xl text-center font-semibold mb-6'>
          Add Your LocoBusiness
        </h2>
        <div className='flex items-center p-2 gap-3'>
          <input
            type='checkbox'
            checked={skipAddBusiness}
            onChange={handleSkipPopOutCheckbox}
            className='w-5 h-5'
          />
          <label className='font-medium text-lg'>
            Skip adding a business profile for now and just puruse being a
            Livloco Co-op Member.
            <span className=''>
              {' '}
              There is no additional charge to post a business and comes with
              every membership.
            </span>
          </label>
          {showPopOut && <AddBusLaterPopout onClose={handleClose} />}
        </div>
        <p>
          (For LivLoco purposes only. Under no circumstances will Livloco sell
          or share your information. However we cannot prevent anyone from
          copying any information that you have voluntarily displayed)
        </p>
        <div className='bg-white p-4 rounded border space-y-4'>
          <div className='mb-4'>
            <label
              htmlFor='locobiz_name'
              className='block font-bold mb-2'
            >
              <span className='text-red-500'>* </span>LocoBusiness Name
            </label>
            <input
              type='text'
              id='locobiz_name'
              name='locobiz_name'
              className='border rounded w-full py-2 px-3 mb-2'
              placeholder=''
              required
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='locobiz_description'
              className='block text-gray-700 font-bold mb-2'
            >
              <span className='text-red-500'>* </span>
              Description
            </label>
            <textarea
              id='locobiz_description'
              name='locobiz_description'
              className='border rounded w-full py-2 px-3'
              rows='4'
              placeholder='Add an optional description of your property'
              required
              maxLength={500}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <div className='text-sm text-gray-500 text-right'>
              {description.length}/{maxLength} characters
            </div>
          </div>
          <div className=''>
            <label
              htmlFor='mem_zip'
              className='block font-bold mb-2'
            >
              <span className='text-red-500'>* </span>
              So That Your Neighbors Can Find you in a Location Search if you
              don't have a storefront or stand.
            </label>
            <input
              type='text'
              id='mem_zip'
              name='mem_zip'
              className='border rounded w-full py-2 px-3 mb-2'
              placeholder='Zipcode'
              required
            />
          </div>

          <div className='mb-4'>
            <label
              htmlFor='account_owner_name'
              className='block font-bold mb-2'
            >
              <span className='text-red-500'>* </span>
              Account Holder's Name
            </label>
            <input
              type='text'
              id='account_owner_name'
              name='account_owner_name'
              className='border rounded w-full py-2 px-3'
              placeholder='Name'
              required
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='email'
              className='block font-bold mb-2'
            >
              Email Address
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={userEmail}
              readOnly
              className='border rounded w-full py-2 px-3'
              required
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='phone'
              className='block font-bold mb-2'
            >
              <span className='text-red-500'>* </span>
              Account Holder's Phone{' '}
              <span className='block font-normal text-md'>
                This number will be associated with the account holder for
                account verification purposes only. A business phone number can
                be added later, but is not required as we will have Livloco
                inter app messaging if you do not want to give your number out.{' '}
              </span>
            </label>
            <input
              type='tel'
              id='phone'
              name='phone'
              className='border rounded w-full py-2 px-3'
              placeholder='(123) 456-7890'
              value={phone}
              onChange={handlePhoneChange}
              required
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='current_promotional'
              className='block font-bold mb-2'
            >
              Current Promotional
              <span className='block font-normal text-md'>
                Do you have any co-op member discounts or promotionals that you
                would like to add to your business profile?
              </span>
            </label>
            <input
              type='text'
              id='current_promotional'
              name='current_promotional'
              className='border rounded w-full py-2 px-3 mb-2'
              placeholder='e.g 10% off flower subscriptions, 1$ off total when you bring your own bag'
            />
          </div>
          <div>
            <label
              htmlFor='locobiz_profile_image'
              className='block text-sm font-medium'
            >
              Upload a profile image for your business if you have one.
            </label>
            <input
              name='locobiz_profile_image'
              type='file'
              className='mt-1 bg-white block w-full border rounded p-2'
              id='locobiz_profile_image'
              accept='image/*'
            />
          </div>
        </div>
      </div>
      {/* Sellig and needing section */}
      {/* Conditional form fields */}
      {/* Toggle */}
      <div className='flex flex-col p-2 gap-2'>
      <div className='flex items-center p-2 gap-3'>
        <input
          id=''
          name=''
          type='checkbox'
          checked={showSellNeedForm}
          onChange={(e) => setShowSellNeedForm(e.target.checked)}
          className='w-5 h-5'
          required
        />
        <label className='font-medium text-lg'><span className='text-red-500'>* </span>
          Add Selling/Needing profile to make your LivLoco pofile Active
        </label>
        
        </div>
        <h1>This data is required to post your livLoco business as it is the backbone of being a contributing member of an interdependent local economy.</h1>
        </div>
      {showSellNeedForm ? (
        <>
          <div className='mt-4 bg-gray-200 space-y-4 border p-4 rounded-md'>
            {/* add selling information */}

            <h1 className='font-bold text-2xl'>Selling</h1>
            {sellingItems.map((item, index) => (
              <div
                key={item.id}
                className='bg-white p-4 rounded border space-y-4'
              >
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
                    placeholder='e.g. Grass-fed beef, CNC Services, Shoe Repair, Manure'
                    id={`selling${index + 1}_description`}
                    name={`selling.selling${index + 1}.description`}
                    type='text'
                    className='mt-1 block w-full bg-gray-100 border rounded p-2'
                  />
                </div>

                {/* Type */}

                <div>
                  <label className='block text-sm font-medium  mb-1'>
                    Type
                  </label>
                  <div className='flex items-center gap-6'>
                    <label
                      htmlFor={`selling${index + 1}_type_product`}
                      className='flex items-center space-x-2'
                    >
                      <input
                        type='radio'
                        name={`selling.selling${index + 1}.type`}
                        id={`selling${index + 1}_type_product`}
                        value='product'
                        defaultChecked
                        className='text-blue-600'
                        required
                      />
                      <span>Product</span>
                    </label>

                    <label
                      htmlFor={`selling${index + 1}_type_service`}
                      className='flex items-center space-x-2'
                    >
                      <input
                        type='radio'
                        name={`selling.selling${index + 1}.type`}
                        id={`selling${index + 1}_type_service`}
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
                  <label
                    htmlFor={`selling${index + 1}_price`}
                    className='block text-sm font-medium'
                  >
                    Price
                  </label>
                  <input
                    placeholder='$/bushel/bale, variable/job, free '
                    id={`selling${index + 1}_price`}
                    name={`selling.selling${index + 1}.price`}
                    type='text'
                    className='mt-1 bg-gray-100 block w-full border rounded p-2'
                  />
                </div>

                {/* Image */}
                <div>
                  <label
                    htmlFor={`selling${index + 1}_image`}
                    className='block text-sm font-medium'
                  >
                    Upload image if you have one
                  </label>
                  <input
                    name={`selling.selling${index + 1}.image`}
                    type='file'
                    className='mt-1 bg-gray-100 block w-full border rounded p-2'
                    id={`selling${index + 1}_image`}
                    accept='image/*'
                  />
                </div>
              </div>
            ))}

            {/* the needing entry feilds */}

            <h1 className='font-bold text-2xl'>
              Needing{' '}
              <span className='text-sm'>
                (no price input as seller determines price.)
              </span>
            </h1>
            {needItems.map((item, index) => (
              <div
                key={item.id}
                className='bg-white p-4 rounded border space-y-4'
              >
                <h3 className='text-lg font-semibold'>Need {index + 1}</h3>

                {/* Description */}
                <div>
                  <label
                    htmlFor={`need${index + 1}_description`}
                    className='block text-sm font-medium'
                  >
                    Description
                  </label>
                  <input
                    placeholder='Hedge Removal, Cement Work, Local Eggs'
                    id={`need${index + 1}_description`}
                    name={`needs.need${index + 1}.description`}
                    type='text'
                    className='mt-1 bg-gray-100 block w-full border rounded p-2'
                  />
                </div>

                {/* Type */}
                <div>
                  <label className='block text-sm font-medium'>Type</label>
                  <div className='flex items-center gap-6'>
                    <label
                      htmlFor={`need${index + 1}_type_product`}
                      className='flex items-center space-x-2'
                    >
                      <input
                        type='radio'
                        id={`need${index + 1}_type_product`}
                        name={`needs.need${index + 1}.type`}
                        value='product'
                        defaultChecked
                        className='text-blue-600'
                        required
                      />
                      <span>Product</span>
                    </label>

                    <label
                      htmlFor={`need${index + 1}_type_service`}
                      className='flex items-center space-x-2'
                    >
                      <input
                        type='radio'
                        id={`need${index + 1}_type_service`}
                        name={`needs.need${index + 1}.type`}
                        value='service'
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
                    className='block text-sm font-medium'
                  >
                    Upload image if you have one
                  </label>
                  <input
                    id={`need${index + 1}_image`}
                    name={`needs.need${index + 1}.image`}
                    type='file'
                    className='mt-1 block w-full border rounded p-2'
                    accept='image/*'
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {/* adding storefront and farmstand component */}

      {/* // Toggle for needing to post storefront// */}
      <div className='flex p-2 items-center gap-3'>
        <input
          id='locobiz_storefront_post_permission'
          name='locobiz_address.post_permission'
          type='checkbox'
          checked={showStoreFrontForm}
          onChange={(e) => setShowStoreFrontForm(e.target.checked)}
          className='w-5 h-5'
        />
        <label
          htmlFor='locobiz_storefront_post_permission'
          className='font-medium text-lg'
        >
          Add storefront/farmstand address and hours if you have one.
        </label>
      </div>

      {showStoreFrontForm ? (
        <>
          <div className='mt-4 bg-gray-200 space-y-4 border p-4 rounded-md'>
            <h2 className='text-xl font-bold'>Storefront/Farmstand Address</h2>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='biz_phone'
                  className='block text-sm font-medium'
                >
                  LocoBiz Phone
                </label>
                <input
                  id='biz_phone'
                  type='tel'
                  name='locobiz_address.biz_phone'
                  placeholder='+1234567890'
                  className='mt-1 bg-white w-full rounded border p-2'
                />
              </div>

              <div>
                <label
                  htmlFor='locobiz_address_line1'
                  className='block text-sm font-medium'
                >
                  {' '}
                  Locobiz Address Line 1
                </label>
                <input
                  id='locobiz_address_line1'
                  type='text'
                  name='locobiz_address.add_line1'
                  required
                  className='mt-1  bg-white w-full rounded border p-2'
                />
              </div>

              <div>
                <label
                  htmlFor='locobiz_address_line1'
                  className='block text-sm font-medium'
                >
                  Address Line 2
                </label>
                <input
                  id='locobiz_address_line1'
                  type='text'
                  name='locobiz_address.add_line2'
                  placeholder='Or short description of the farmstand.'
                  className='mt-1 bg-white w-full rounded border p-2'
                />
              </div>

              <div>
                <label
                  htmlFor='locobiz_city'
                  className='block text-sm font-medium'
                >
                  City
                </label>
                <input
                  type='text'
                  id='locobiz_city'
                  name='locobiz_address.city'
                  // value={formData.locobiz_address.city}
                  // onChange={handleAddressChange}
                  required
                  className='mt-1 bg-white w-full rounded border p-2'
                />
              </div>

              <div>
                <label
                  htmlFor='locobiz_state'
                  className='block text-sm font-medium'
                >
                  State
                </label>
                <input
                  id='locobiz_state'
                  type='text'
                  name='locobiz_address.state'
                  // value={formData.locobiz_address.state}
                  // onChange={handleAddressChange}
                  required
                  className='mt-1  bg-white w-full rounded border p-2'
                />
              </div>

              <div>
                <label
                  htmlFor='locobiz_address_zipcode'
                  className='block text-sm font-medium'
                >
                  Zip Code
                </label>
                <input
                  id='locobiz_address_zipcode'
                  type='text'
                  name='locobiz_address.zipcode'
                  // value={formData.locobiz_address.zipcode}
                  // onChange={handleAddressChange}
                  required
                  pattern='^\d{5}(-\d{4})?$'
                  className='mt-1  bg-white w-full rounded border p-2'
                />
              </div>

              <div>
                <label
                  htmlFor='locobiz_address_country'
                  className='block text-sm font-medium'
                >
                  Country (test driving it here first)
                </label>
                <input
                  id='locobiz_address_country'
                  type='text'
                  name='locobiz_address.country'
                  value='USA'
                  readOnly
                  // onChange={handleAddressChange}
                  className='mt-1  bg-white w-full rounded border p-2'
                />
              </div>
            </div>

            <h2 className='text-xl font-bold mt-6'>LocoBiz Business Hours</h2>
            {/* mapping through the days of the week for storefront hours */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {daysOfWeek.map((day) => (
                <div
                  className=''
                  key={day}
                >
                  <label
                    htmlFor={`business_hours_${day}_hours`}
                    className='block text-sm font-medium capitalize'
                  >
                    {day}'s Hours
                  </label>
                  <input
                    type='text'
                    id={`store_hours_${day}_hours`}
                    name={`business_hours.${day}_hours`}
                    placeholder='e.g., 9am - 5pm, closed, keypad entry'
                    className='mt-1 w-full bg-white rounded border p-2'
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}

      {/* Farmers Market days and location */}
      <div className='flex p-2 items-center space-x-2'>
        {/* Hidden fallback value if checkbox is unchecked */}
        <input
          type='hidden'
          name='farmers_market_location.fm_location_post'
          value='false'
        />
        <input
          id='fm_location_post'
          name='farmers_market_location.fm_location_post'
          type='checkbox'
          checked={showFarmersMarketForm}
          // onChange={handleToggle}
          onChange={(e) => setShowFarmersMarketForm(e.target.checked)}
          value='true'
          className='w-5 h-5'
        />
        <label
          htmlFor='fm_location_post'
          className='font-medium text-lg'
        >
          Add Farmers Market locations if you attend any.
        </label>
      </div>

      {showFarmersMarketForm ? (
        <>
          <div className='mt-4 bg-gray-200 space-y-4 border p-4 rounded-md'>
            <h2 className='text-xl font-bold mt-4'>Farmers Market Locations</h2>
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className='border bg-white rounded p-4 mb-4'
              >
                <h3 className='text-lg font-semibold capitalize mb-2'>{day}</h3>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                  <div>
                    <label
                      htmlFor={`farmers_market_location_${day}_farmers_market_name`}
                      className='block text-sm font-medium'
                    >
                      Market Name
                    </label>
                    <input
                      id={`farmers_market_location_${day}_farmers_market_name`}
                      type='text'
                      name={`farmers_market_location.${day}.farmers_market_name`}
                      // value={data[day]?.farmers_market_name || ''}
                      // onChange={(e) => handleDayChange(e, day)}
                      className='mt-1 w-full border rounded p-2'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`farmers_market_location_${day}_city`}
                      className='block text-sm font-medium'
                    >
                      City
                    </label>
                    <input
                      id={`farmers_market_location_${day}_city`}
                      name={`farmers_market_location.${day}.city`}
                      type='text'
                      className='mt-1 w-full border rounded p-2'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`farmers_market_location_${day}_state`}
                      className='block text-sm font-medium'
                    >
                      State
                    </label>
                    <input
                      id={`farmers_market_location_${day}_state`}
                      name={`farmers_market_location.${day}.state`}
                      type='text'
                      // value={data[day]?.state || ''}
                      // onChange={(e) => handleDayChange(e, day)}
                      className='mt-1 w-full border rounded p-2'
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {/* toggle for submitting a webpage */}
      <div className='flex p-2 items-center pb-4 gap-3'>
        <input
          type='checkbox'
          checked={showLocoBizUrl}
          // onChange={handleToggle}
          onChange={(e) => setShowLocoBizUrl(e.target.checked)}
          className='w-5 h-5'
        />
        <label className='font-medium text-lg'>
          Add your business webpage if you have one.
        </label>
      </div>
      {showLocoBizUrl ? (
        <>
          <div className='mt-4 bg-gray-200 space-y-4 border p-4 rounded-md'>
            <label
              htmlFor='website'
              className='block text-sm font-medium text-gray-700'
            >
              Website URL
            </label>
            <input
              type='url'
              id='website'
              name='website'
              placeholder='https://example.com'
              // value={url}
              // onChange={(e) => setUrl(e.target.value)}
              className='w-full bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500'
            />
          </div>
        </>
      ) : null}

      {/* submit button for everything */}
      <div className='p-3'>
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

// components/BusinessEditForm.jsx
'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import SellingEntry from '@/components/SellingEntry'
import NeedingEntry from '@/components/NeedingEntry'
import StateSelect from '@/components/StateSelect'
import uploadToCloudinary from '@/utils/uploadToCloudinary'
import editBusinessAction from '@/app/actions/editBusinessAction'
import DropzoneUploader from '@/components/DropzoneUploader'
import DeleteProfileModal from '@/components/DeleteProfileModal'
import deleteBusinessAction from '@/app/actions/deleteBusinessAction'

const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

const toDisplayFromE164 = (e164) => {
  const s = String(e164 || '')
  const m = s.match(/^\+1(\d{3})(\d{3})(\d{4})$/)
  if (!m) return ''
  return `(${m[1]}) ${m[2]}-${m[3]}`
}

export default function BusinessEditForm({
  businessData,
  userEmail,
  userFullName,
  userPhoneE164,
}) {
  const router = useRouter()

  const initialPhoneDisplay = useMemo(
    () => toDisplayFromE164(userPhoneE164),
    [userPhoneE164]
  )
  const initialBizPhoneDisplay = useMemo(
    () => toDisplayFromE164(businessData?.locobiz_address?.biz_phone),
    [businessData?.locobiz_address?.biz_phone]
  )

  const [images, setImages] = useState({
    profile: businessData?.locobiz_profile_image || '',
    selling1: businessData?.selling?.selling1?.image || '',
    selling2: businessData?.selling?.selling2?.image || '',
    selling3: businessData?.selling?.selling3?.image || '',
    need1: businessData?.needs?.need1?.image || '',
    need2: businessData?.needs?.need2?.image || '',
    need3: businessData?.needs?.need3?.image || '',
  })

  // Track which images should be deleted
  const [deleteImage, setDeleteImage] = useState({
    profile: false,
    selling1: false,
    selling2: false,
    selling3: false,
    need1: false,
    need2: false,
    need3: false,
  })
  const [description, setDescription] = useState(
    businessData?.locobiz_description || ''
  )

  // Account holder info comes from the user profile (read-only, not required here)
  const [ownerName] = useState(userFullName || '')
  const [accountPhoneDisplay] = useState(initialPhoneDisplay)

  // Optional storefront phone (independent from account holder phone)
  const [bizPhoneDisplay, setBizPhoneDisplay] = useState(initialBizPhoneDisplay)

  const [isUploading, setIsUploading] = useState(false)
  const [isActive, setIsActive] = useState(!!businessData?.locobiz_active)

  // Determine if sections should be shown based on existing data
  const hasSellingOrNeeding = useMemo(() => {
    const selling = businessData?.selling || {}
    const needs = businessData?.needs || {}
    return (
      selling.selling1?.type ||
      selling.selling1?.description ||
      selling.selling2?.type ||
      selling.selling2?.description ||
      selling.selling3?.type ||
      selling.selling3?.description ||
      needs.need1?.type ||
      needs.need1?.description ||
      needs.need2?.type ||
      needs.need2?.description ||
      needs.need3?.type ||
      needs.need3?.description
    )
  }, [businessData])

  const hasStorefront = useMemo(() => {
    return businessData?.locobiz_address?.post_permission === true
  }, [businessData])

  const hasFarmersMarket = useMemo(() => {
    return businessData?.farmers_market_location?.fm_location_post === true
  }, [businessData])

  const hasWebsite = useMemo(() => {
    return !!businessData?.website
  }, [businessData])

  const [showSellNeedForm, setShowSellNeedForm] = useState(hasSellingOrNeeding)
  const [sellingItems] = useState([{ id: 1 }, { id: 2 }, { id: 3 }])
  const [needItems] = useState([{ id: 1 }, { id: 2 }, { id: 3 }])
  const [showStoreFrontForm, setShowStoreFrontForm] = useState(hasStorefront)
  const [showFarmersMarketForm, setShowFarmersMarketForm] =
    useState(hasFarmersMarket)
  const [showLocoBizUrl, setShowLocoBizUrl] = useState(hasWebsite)
  const [uploadedFileNames, setUploadedFileNames] = useState({})

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDropzoneUpload = async (file, key) => {
    if (!file) return
    try {
      setIsUploading(true)
      const url = await uploadToCloudinary(file)
      setImages((prev) => ({ ...prev, [key]: url }))
      setUploadedFileNames((prev) => ({ ...prev, [key]: file.name }))
    } catch (err) {
      console.error('Cloudinary upload failed:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const formatPhoneDisplay = (value) => {
    const digits = String(value || '')
      .replace(/\D/g, '')
      .substring(0, 10)
    if (digits.length < 4) return digits
    if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  const handleBizPhoneChange = (e) => {
    const input = e.target.value
    const digits = input.replace(/\D/g, '').slice(0, 10)
    setBizPhoneDisplay(formatPhoneDisplay(digits))
  }

  const handleDeleteConfirm = async () => {
    return await deleteBusinessAction()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    if (!showSellNeedForm) {
      alert(
        'You must check the box to add your selling/needing profile before submitting.'
      )
      return
    }

    // Validate farmers market location fields if any market name is provided
    if (showFarmersMarketForm) {
      const days = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ]

      for (const day of days) {
        const marketName = form.get(
          `farmers_market_location.${day}.farmers_market_name`
        )
        if (marketName && marketName.trim() !== '') {
          const addLine1 = form.get(`farmers_market_location.${day}.add_line1`)
          const city = form.get(`farmers_market_location.${day}.city`)
          const stateCode = form.get(
            `farmers_market_location.${day}.state_code`
          )
          const zipcode = form.get(`farmers_market_location.${day}.zipcode`)

          if (!addLine1 || addLine1.trim() === '') {
            alert(
              `Please provide the street address (Line 1) for ${day}'s farmers market location.`
            )
            return
          }

          if (!city || city.trim() === '') {
            alert(
              `Please provide the city for ${day}'s farmers market location.`
            )
            return
          }

          if (!stateCode || stateCode.trim() === '') {
            alert(
              `Please provide the state for ${day}'s farmers market location.`
            )
            return
          }

          if (!zipcode || zipcode.trim() === '') {
            alert(
              `Please provide the ZIP code for ${day}'s farmers market location.`
            )
            return
          }

          // Validate ZIP code format
          const zipPattern = /^\d{5}(-\d{4})?$/
          if (!zipPattern.test(zipcode)) {
            alert(
              `Please provide a valid ZIP code format (e.g., 12345 or 12345-6789) for ${day}'s farmers market location.`
            )
            return
          }
        }
      }
    }

    //User Name is required by onboarding, send it; otherwise server will fallback from User
    form.set('account_owner_name', ownerName || '')

    // User phone is required by onboarding, send it; otherwise server will fallback from User
    form.set('phone', accountPhoneDisplay || '')

    // User email is propogated from sign-ing and is required. Will pin it here in the bizness owers field.
    form.set('email', userEmail || '')

    const website = form.get('website')
    if (website) {
      let cleanWebsite = String(website).trim().replace(/\/$/, '')
      if (!/^https?:\/\//i.test(cleanWebsite))
        cleanWebsite = `https://${cleanWebsite}`
      if (!/^https?:\/\/[\w\-\.]+/i.test(cleanWebsite)) {
        alert('Please enter a valid website starting with https://')
        return
      }
      form.set('website', cleanWebsite)
    }

    // Ensure farmers_market_location.fm_location_post is captured regardless of hidden input ordering
    form.set(
      'farmers_market_location.fm_location_post',
      showFarmersMarketForm ? 'true' : 'false'
    )

    form.set('locobiz_profile_image', images.profile || '')
    form.set('selling.selling1.image', images.selling1 || '')
    form.set('selling.selling2.image', images.selling2 || '')
    form.set('selling.selling3.image', images.selling3 || '')
    form.set('needs.need1.image', images.need1 || '')
    form.set('needs.need2.image', images.need2 || '')
    form.set('needs.need3.image', images.need3 || '')
    form.set('locobiz_active', isActive ? 'true' : 'false')

    try {
      const res = await editBusinessAction(form)

      if (res.ok) {
        const targetId = res.id || businessData?.id
        router.push(targetId ? `/businesses/${targetId}` : '/businesses')
      } else {
        // Server returned an error
        alert(
          res.error ||
            'There was a problem updating your business. Please try again.'
        )
      }
    } catch (err) {
      console.error('Form submission failed:', err)
      alert(
        'There was a problem updating your business. Please check your inputs and try again.'
      )
    }
  }

  const maxLength = 500

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='mt-4 bg-gray-200 space-y-4 border p-4 rounded-md'>
          <div className='flex items-center gap-3'>
            <input
              id='locobiz_active'
              name='locobiz_active'
              type='checkbox'
              className='w-5 h-5'
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              value='true'
            />
            <label
              htmlFor='locobiz_active'
              className='font-medium'
            >
              <span className='text-xl font-bold'>Active</span>
              <span className='ml-1 text-base font-normal'>
                (uncheck to pause your business posting while keeping your
                votes, clicks and data)
              </span>
            </label>
          </div>
          <h2 className='text-3xl text-center font-semibold mb-6'>
            Edit Your LocoBusiness
          </h2>
          <p>
            (For LivLoco purposes only. We will never sell or share your
            information.)
          </p>

          <div className='bg-white p-4 rounded border space-y-4'>
            <div className='mb-4'>
              <label
                htmlFor='locobiz_name'
                className='block font-bold mb-2'
              >
                LocoBusiness Name <span className='text-red-500'>required</span>
              </label>
              <input
                type='text'
                id='locobiz_name'
                name='locobiz_name'
                className='border rounded w-full py-2 px-3 mb-2'
                defaultValue={businessData?.locobiz_name || ''}
                required
              />
            </div>

            <div className='mb-4'>
              <label
                htmlFor='locobiz_description'
                className='block text-gray-700 font-bold mb-2'
              >
                Description <span className='text-red-500'> required</span>
              </label>
              <textarea
                id='locobiz_description'
                name='locobiz_description'
                className='border rounded w-full py-2 px-3'
                rows='4'
                required
                maxLength={500}
                defaultValue={businessData?.locobiz_description || ''}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className='text-sm text-gray-500 text-right'>
                {description.length}/{maxLength} characters
              </div>
            </div>

            <div>
              <label
                htmlFor='mem_zip'
                className='block font-bold mb-2'
              >
                ZIP for location search (Even if you don't have a store front,
                your neighbors need to know your vicinity.)
                <span className='text-red-500'> required</span>
              </label>
              <input
                type='text'
                id='mem_zip'
                name='mem_zip'
                pattern='^\d{5}(-\d{4})?$'
                className='border rounded w-full py-2 px-3 mb-2'
                title='Enter a valid 5-digit ZIP code (e.g., 48846 or 48846-1234)'
                defaultValue={businessData?.mem_zip || ''}
                required
              />
            </div>

            <div className='mb-4'>
              <label
                htmlFor='account_owner_name'
                className='block font-bold mb-2'
              >
                Account Holder&apos;s Name
              </label>
              <input
                type='text'
                id='account_owner_name'
                name='account_owner_name'
                className='border rounded w-full py-2 px-3 bg-gray-100 cursor-not-allowed'
                value={ownerName}
                readOnly
                aria-readonly='true'
                placeholder='(from your profile)'
              />
            </div>
            <div className='mb-4'>
              <label
                htmlFor='account_owner_name'
                className='block font-bold mb-2'
              >
                Account Holder&apos;s Email
              </label>
              <input
                type='text'
                id='email'
                name='email'
                className='border rounded w-full py-2 px-3 bg-gray-100 cursor-not-allowed'
                value={userEmail}
                readOnly
                aria-readonly='true'
                placeholder='(from your profile)'
              />
            </div>

            <div className='mb-4'>
              <label
                htmlFor='phone'
                className='block font-bold mb-2'
              >
                Account Holder&apos;s Phone
              </label>
              <input
                type='tel'
                id='phone'
                name='phone'
                className='border rounded w-full py-2 px-3 bg-gray-100 cursor-not-allowed'
                placeholder='(123) 456-7890'
                value={accountPhoneDisplay}
                readOnly
                aria-readonly='true'
              />
            </div>

            <div className='mb-4'>
              <label
                htmlFor='current_promotional'
                className='block font-bold mb-2'
              >
                Current Promotional
              </label>
              <input
                type='text'
                id='current_promotional'
                name='current_promotional'
                className='border rounded w-full py-2 px-3 mb-2'
                placeholder='e.g., 10% off subscriptions'
                defaultValue={businessData?.current_promotional || ''}
              />
            </div>

            <div>
              <DropzoneUploader
                label='Upload a profile image for your business if you have one.'
                onUpload={(file) => handleDropzoneUpload(file, 'profile')}
                uploadedFileName={uploadedFileNames['profile']}
                id='locobiz_profile_image'
                accept='image/*'
                existingImageUrl={images.profile}
              />
              {images.profile && !uploadedFileNames['profile'] && (
                <div className='mt-2 flex items-center gap-2'>
                  <input
                    type='checkbox'
                    id='delete_profile_image'
                    checked={deleteImage.profile}
                    onChange={(e) => {
                      setDeleteImage((prev) => ({
                        ...prev,
                        profile: e.target.checked,
                      }))
                      if (e.target.checked) {
                        setImages((prev) => ({ ...prev, profile: '' }))
                      } else {
                        setImages((prev) => ({
                          ...prev,
                          profile: businessData?.locobiz_profile_image || '',
                        }))
                      }
                    }}
                    className='w-4 h-4'
                  />
                  <label
                    htmlFor='delete_profile_image'
                    className='text-sm text-red-600 font-medium cursor-pointer'
                  >
                    Delete and do not use an image at this time.
                  </label>
                </div>
              )}
              <input
                type='hidden'
                name='locobiz_profile_image'
                value={images.profile || ''}
              />
            </div>
          </div>
        </div>

        <div className='flex flex-col p-2 gap-2'>
          <div className='flex items-center p-2 gap-3'>
            <input
              type='checkbox'
              id='showSellNeedForm'
              name='showSellNeedForm'
              checked={showSellNeedForm}
              onChange={(e) => setShowSellNeedForm(e.target.checked)}
              className='w-5 h-5'
            />
            <label
              htmlFor='showSellNeedForm'
              className='font-medium text-lg'
            >
              Add Selling/Needing profile{' '}
              <span className='text-red-500'> required</span>
              <br />
              <span className='text-black'>
                {' '}
                (This is what keeps us in the co-op working together!)
              </span>
            </label>
          </div>
        </div>

        {showSellNeedForm && (
          <div className='mt-4 bg-gray-200 space-y-4 border p-4 rounded-md'>
            <h1 className='font-bold text-2xl'>Selling</h1>
            {sellingItems.map((item, index) => (
              <SellingEntry
                key={item.id}
                index={index}
                images={images}
                uploadedFileNames={uploadedFileNames}
                handleDropzoneUpload={handleDropzoneUpload}
                initialData={businessData?.selling?.[`selling${index + 1}`]}
                deleteImage={deleteImage}
                setDeleteImage={setDeleteImage}
                setImages={setImages}
              />
            ))}
            <h1 className='font-bold text-2xl'>Needing</h1>
            {needItems.map((item, index) => (
              <NeedingEntry
                key={item.id}
                index={index}
                images={images}
                uploadedFileNames={uploadedFileNames}
                handleDropzoneUpload={handleDropzoneUpload}
                initialData={businessData?.needs?.[`need${index + 1}`]}
                deleteImage={deleteImage}
                setDeleteImage={setDeleteImage}
                setImages={setImages}
              />
            ))}
          </div>
        )}

        <div className='flex p-2 items-center gap-3'>
          <input
            id='locobiz_storefront_post_permission'
            name='locobiz_address.post_permission'
            type='checkbox'
            checked={showStoreFrontForm}
            onChange={(e) => setShowStoreFrontForm(e.target.checked)}
            className='w-5 h-5'
            value='true'
          />
          <label
            htmlFor='locobiz_storefront_post_permission'
            className='font-medium text-lg'
          >
            Add storefront/farmstand address and hours if you have one.
          </label>
        </div>

        {showStoreFrontForm && (
          <div className='mt-4 bg-gray-200 space-y-4 border p-4 rounded-md'>
            <h2 className='text-xl font-bold'>Storefront/Farmstand Address</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='biz_phone'
                  className='block text-sm font-medium'
                >
                  LocoBiz Phone (optional)
                </label>
                <input
                  id='biz_phone'
                  type='tel'
                  name='locobiz_address.biz_phone'
                  placeholder='(123) 456-7890'
                  className='mt-1 bg-white w-full rounded border p-2'
                  value={bizPhoneDisplay}
                  onChange={handleBizPhoneChange}
                />
              </div>
              <div>
                <label
                  htmlFor='locobiz_address_line1'
                  className='block text-sm font-medium'
                >
                  Address Line 1
                </label>
                <input
                  id='locobiz_address_line1'
                  type='text'
                  name='locobiz_address.add_line1'
                  className='mt-1 bg-white w-full rounded border p-2'
                  defaultValue={businessData?.locobiz_address?.add_line1 || ''}
                />
              </div>
              <div>
                <label
                  htmlFor='locobiz_address_line2'
                  className='block text-sm font-medium'
                >
                  Address Line 2
                </label>
                <input
                  id='locobiz_address_line2'
                  type='text'
                  name='locobiz_address.add_line2'
                  className='mt-1 bg-white w-full rounded border p-2'
                  defaultValue={businessData?.locobiz_address?.add_line2 || ''}
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
                  className='mt-1 bg-white w-full rounded border p-2'
                  defaultValue={businessData?.locobiz_address?.city || ''}
                />
              </div>
              <div>
                <label
                  htmlFor='locobiz_state'
                  className='block text-sm font-medium'
                >
                  State
                </label>
                <StateSelect
                  id='locobiz_state'
                  type='text'
                  name='locobiz_address.state_code'
                  className='mt-1 bg-white w-full rounded border p-2'
                  defaultValue={businessData?.locobiz_address?.state_code || ''}
                  required
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
                  pattern='^\d{5}(-\d{4})?$'
                  className='mt-1 bg-white w-full rounded border p-2'
                  defaultValue={businessData?.locobiz_address?.zipcode || ''}
                />
              </div>
              <div>
                <label
                  htmlFor='locobiz_address_country'
                  className='block text-sm font-medium'
                >
                  Country
                </label>
                <input
                  id='locobiz_address_country'
                  type='text'
                  name='locobiz_address.country'
                  value='USA'
                  readOnly
                  className='mt-1 bg-white w-full rounded border p-2'
                />
              </div>
            </div>

            <h2 className='text-xl font-bold mt-6'>LocoBiz Business Hours</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {daysOfWeek.map((day) => (
                <div key={day}>
                  <label
                    htmlFor={`store_hours_${day}_hours`}
                    className='block text-sm font-medium capitalize'
                  >
                    {day}'s Hours
                  </label>
                  <input
                    type='text'
                    id={`store_hours_${day}_hours`}
                    name={`business_hours.${day}_hours`}
                    placeholder='e.g., 9am - 5pm, closed'
                    className='mt-1 w-full bg-white rounded border p-2'
                    defaultValue={
                      businessData?.business_hours?.[`${day}_hours`] || ''
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='flex p-2 items-center space-x-2'>
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
            onChange={(e) => setShowFarmersMarketForm(e.target.checked)}
            value='true'
            className='w-5 h-5'
          />
          <label
            htmlFor='fm_location_post'
            className='font-medium text-lg'
          >
            Add any farmers’ markets you attend or list your food truck’s weekly
            locations.
          </label>
        </div>

        {showFarmersMarketForm && (
          <div className='mt-4 bg-gray-200 space-y-4 border p-4 rounded-md'>
            <h2 className='text-xl font-bold mt-4'>
              Farmers' Market Locations
            </h2>
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className='border bg-white rounded p-4 mb-4'
              >
                <h3 className='text-lg font-semibold capitalize mb-2'>{day}</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
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
                      className='mt-1 w-full border rounded p-2'
                      defaultValue={
                        businessData?.farmers_market_location?.[day]
                          ?.farmers_market_name || ''
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`farmers_market_location_${day}_add_line1`}
                      className='block text-sm font-medium'
                    >
                      Street Address Line 1
                    </label>
                    <input
                      id={`farmers_market_location_${day}_add_line1`}
                      type='text'
                      name={`farmers_market_location.${day}.add_line1`}
                      className='mt-1 w-full border rounded p-2'
                      defaultValue={
                        businessData?.farmers_market_location?.[day]
                          ?.add_line1 || ''
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`farmers_market_location_${day}_add_line2`}
                      className='block text-sm font-medium'
                    >
                      Street Address Line 2
                    </label>
                    <input
                      id={`farmers_market_location_${day}_add_line2`}
                      type='text'
                      name={`farmers_market_location.${day}.add_line2`}
                      className='mt-1 w-full border rounded p-2'
                      defaultValue={
                        businessData?.farmers_market_location?.[day]
                          ?.add_line2 || ''
                      }
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
                      defaultValue={
                        businessData?.farmers_market_location?.[day]?.city || ''
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`farmers_market_location_${day}_state`}
                      className='block text-sm font-medium'
                    >
                      State
                    </label>
                    <StateSelect
                      id={`farmers_market_location_${day}_state`}
                      name={`farmers_market_location.${day}.state_code`}
                      type='text'
                      className='mt-1 w-full border rounded p-2'
                      defaultValue={
                        businessData?.farmers_market_location?.[day]
                          ?.state_code || ''
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`farmers_market_location_${day}_zipcode`}
                      className='block text-sm font-medium'
                    >
                      ZIP Code
                    </label>
                    <input
                      id={`farmers_market_location_${day}_zipcode`}
                      type='text'
                      name={`farmers_market_location.${day}.zipcode`}
                      pattern='^\d{5}(-\d{4})?$'
                      className='mt-1 w-full border rounded p-2'
                      defaultValue={
                        businessData?.farmers_market_location?.[day]?.zipcode ||
                        ''
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className='flex p-2 items-center pb-4 gap-3'>
          <input
            type='checkbox'
            checked={showLocoBizUrl}
            onChange={(e) => setShowLocoBizUrl(e.target.checked)}
            className='w-5 h-5'
          />
          <label className='font-medium text-lg'>
            Add your business webpage if you have one.
          </label>
        </div>

        {showLocoBizUrl && (
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
              className='w-full bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500'
              defaultValue={businessData?.website || ''}
            />
          </div>
        )}

        <div className='p-3'>
          <button
            className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
            type='submit'
            disabled={isUploading}
          >
            {isUploading ? 'Uploading…' : 'Update LocoBusiness'}
          </button>
        </div>

        <div className='mt-4 bg-white p-4 rounded border'>
          <div className='space-y-3'>
            <h3 className='text-xl font-semibold text-red-700'>Danger Zone</h3>
            <p className='text-gray-700'>
              Once you delete your LocoBusiness profile, you can always come
              back and create another LocoBusiness. However, you will lose all
              your votes and click statistics that are tied to this profile.
            </p>
            <button
              type='button'
              onClick={() => setShowDeleteModal(true)}
              className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors'
            >
              Delete LocoBusiness
            </button>
          </div>
        </div>
      </form>

      <DeleteProfileModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        profileType='locobiz'
      />
    </>
  )
}

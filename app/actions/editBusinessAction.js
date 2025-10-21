// app/actions/editBusinessAction.js
'use server'

import connectDB from '@/config/database'
import LocoBiz from '@/models/LocoBiz'
import { getSessionUser } from '@/utils/getSessionUser'
import { revalidatePath } from 'next/cache'

const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

async function editBusinessAction(formData) {
  await connectDB()

  const sessionUser = await getSessionUser()
  if (!sessionUser || !sessionUser.userId) {
    throw new Error('User ID is required')
  }
  const { userId } = sessionUser

  // Find existing business
  const existingBiz = await LocoBiz.findOne({ owner: userId })
  if (!existingBiz) {
    return { ok: false, error: 'No business found to edit.' }
  }

  // -------- Images ----------
  const getImageUrlFromField = async (v) => {
    if (!v || typeof v !== 'string') return ''
    return v.startsWith('http') ? v : ''
  }

  const profileImageUrl = await getImageUrlFromField(
    formData.get('locobiz_profile_image')
  )
  const selling1ImageUrl = await getImageUrlFromField(
    formData.get('selling.selling1.image')
  )
  const selling2ImageUrl = await getImageUrlFromField(
    formData.get('selling.selling2.image')
  )
  const selling3ImageUrl = await getImageUrlFromField(
    formData.get('selling.selling3.image')
  )
  const need1ImageUrl = await getImageUrlFromField(
    formData.get('needs.need1.image')
  )
  const need2ImageUrl = await getImageUrlFromField(
    formData.get('needs.need2.image')
  )
  const need3ImageUrl = await getImageUrlFromField(
    formData.get('needs.need3.image')
  )

  // -------- Account phones ----------
  let phoneRaw = formData.get('phone') || ''
  let phoneDigits = String(phoneRaw).replace(/\D/g, '')
  let phone = phoneDigits.length === 10 ? `+1${phoneDigits}` : phoneDigits

  let bizPhoneRaw = formData.get('locobiz_address.biz_phone') || ''
  let bizPhoneDigits = String(bizPhoneRaw).replace(/\D/g, '')
  let biz_phone =
    bizPhoneDigits.length === 10
      ? `+1${bizPhoneDigits}`
      : bizPhoneDigits || undefined

  // -------- Storefront address ----------
  const hasStorefront =
    formData.get('locobiz_address.post_permission') === 'true'
  let locobizAddress = null
  if (hasStorefront) {
    const addrStateCode = (formData.get('locobiz_address.state_code') || '')
      .toString()
      .toUpperCase()
    locobizAddress = {
      post_permission: true,
      biz_phone,
      add_line1: formData.get('locobiz_address.add_line1') || '',
      add_line2: formData.get('locobiz_address.add_line2') || '',
      city: formData.get('locobiz_address.city') || '',
      state_code: addrStateCode || undefined,
      zipcode: formData.get('locobiz_address.zipcode') || '',
      country: formData.get('locobiz_address.country') || 'USA',
    }
  }

  // -------- Farmers market locations ----------
  const fm_location_post =
    formData.get('farmers_market_location.fm_location_post') === 'true'

  // Get existing farmers market data to preserve it when checkbox is unchecked
  const existingFMData = existingBiz?.farmers_market_location || {}

  const farmers_market_location = { fm_location_post }
  for (const d of days) {
    // If checkbox is checked, use form data; otherwise preserve existing data
    if (fm_location_post) {
      const stateCode = (
        formData.get(`farmers_market_location.${d}.state_code`) || ''
      )
        .toString()
        .toUpperCase()
      farmers_market_location[d] = {
        farmers_market_name:
          formData.get(`farmers_market_location.${d}.farmers_market_name`) ||
          '',
        city: formData.get(`farmers_market_location.${d}.city`) || '',
        state_code: stateCode || undefined,
        zip: formData.get(`farmers_market_location.${d}.zip`) || '', // old field for compatibility
        add_line1: formData.get(`farmers_market_location.${d}.add_line1`) || '',
        add_line2: formData.get(`farmers_market_location.${d}.add_line2`) || '',
        zipcode: formData.get(`farmers_market_location.${d}.zipcode`) || '',
      }
    } else {
      // Preserve existing data when checkbox is unchecked
      farmers_market_location[d] = existingFMData[d] || {
        farmers_market_name: '',
        city: '',
        state_code: undefined,
        zip: '',
        add_line1: '',
        add_line2: '',
        zipcode: '',
      }
    }
  }

  // -------- Website ----------
  const website = (() => {
    const w = formData.get('website')
    if (typeof w !== 'string') return undefined
    const trimmed = w.trim()
    return trimmed ? trimmed : undefined
  })()

  // -------- Build update data ----------
  const updateData = {
    account_owner_name: formData.get('account_owner_name') || '',
    phone,
    mem_zip: formData.get('mem_zip'),
    locobiz_active: formData.get('locobiz_active') === 'true',
    locobiz_name: formData.get('locobiz_name'),
    locobiz_description: formData.get('locobiz_description'),
    ...(locobizAddress && { locobiz_address: locobizAddress }),
    business_hours: {
      monday_hours: formData.get('business_hours.monday_hours'),
      tuesday_hours: formData.get('business_hours.tuesday_hours'),
      wednesday_hours: formData.get('business_hours.wednesday_hours'),
      thursday_hours: formData.get('business_hours.thursday_hours'),
      friday_hours: formData.get('business_hours.friday_hours'),
      saturday_hours: formData.get('business_hours.saturday_hours'),
      sunday_hours: formData.get('business_hours.sunday_hours'),
    },
    ...(website && { website }),
    locobiz_profile_image: profileImageUrl,
    farmers_market_location,
    selling: {
      selling1: {
        description: formData.get('selling.selling1.description'),
        image: selling1ImageUrl,
        price: formData.get('selling.selling1.price'),
      },
      selling2: {
        description: formData.get('selling.selling2.description'),
        image: selling2ImageUrl,
        price: formData.get('selling.selling2.price'),
      },
      selling3: {
        description: formData.get('selling.selling3.description'),
        image: selling3ImageUrl,
        price: formData.get('selling.selling3.price'),
      },
    },
    needs: {
      need1: {
        description: formData.get('needs.need1.description'),
        image: need1ImageUrl,
      },
      need2: {
        description: formData.get('needs.need2.description'),
        image: need2ImageUrl,
      },
      need3: {
        description: formData.get('needs.need3.description'),
        image: need3ImageUrl,
      },
    },
    current_promotional: formData.get('current_promotional'),
  }

  // --- Update with friendly error reporting ---
  try {
    await LocoBiz.findByIdAndUpdate(existingBiz._id, updateData, {
      new: true,
      runValidators: true,
    })

    revalidatePath('/', 'layout')
    return { ok: true, id: String(existingBiz._id) }
  } catch (err) {
    console.error('editBusinessAction error:', err)

    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'a unique field'
      return {
        ok: false,
        error: `Duplicate value for ${field}. Please change it and try again.`,
      }
    }

    const msg = err?.message || 'Unknown error while updating your business.'
    return { ok: false, error: msg }
  }
}

export default editBusinessAction


//livloco-25/app/actions/addBusinessAction.js
'use server';
import connectDB from '@/config/database';
import LocoBiz from '@/models/LocoBiz';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import uploadToCloudinary from '@/utils/uploadToCloudinary';


const fileToUrl = async (file) => {
  if (!file || !(file instanceof File) || file.size === 0 || file.name === 'undefined') {
    return null;
  }
  return await uploadToCloudinary(file); // returns Cloudinary URL
};


async function addBusinessAction(formData) {
  await connectDB();

  const sessionUser = await getSessionUser();
  
  if (!sessionUser || !sessionUser.userId) {
    throw new Error('User ID is required'); 
  }

  //not sure if I should bring in the userEmail to add to the account holder here or not. Currently it is comming in through DB connect in the biz add form.

  const { userId } = sessionUser;


  //to ensure that I am not uploading empty files of data
  // const getFileUrlOrNull = async (file) => {
  // if (!file || file.size === 0 || file.name === 'undefined') return null;
  // return await handleFileUpload(file); // Your upload logic
  // };
  
const getImageUrlFromField = async (fieldValue) => {
  if (!fieldValue || typeof fieldValue !== 'string') return '';
  if (fieldValue.startsWith('http')) return fieldValue;
  return '';
};

const profileImageUrl = await getImageUrlFromField(formData.get('locobiz_profile_image'));
const selling1ImageUrl = await getImageUrlFromField(formData.get('selling.selling1.image'));
const selling2ImageUrl = await getImageUrlFromField(formData.get('selling.selling2.image'));
const selling3ImageUrl = await getImageUrlFromField(formData.get('selling.selling3.image'));
const need1ImageUrl = await getImageUrlFromField(formData.get('needs.need1.image'));
const need2ImageUrl = await getImageUrlFromField(formData.get('needs.need2.image'));
const need3ImageUrl = await getImageUrlFromField(formData.get('needs.need3.image'));

  // Normalize phone to E.164 format (US-based)
let phoneRaw = formData.get('phone') || '';
let phoneDigits = phoneRaw.replace(/\D/g, '');
let phone = phoneDigits.length === 10 ? `+1${phoneDigits}` : phoneDigits;
  
// Normalize business phone (if provided)
let bizPhoneRaw = formData.get('locobiz_address.biz_phone') || '';
let bizPhoneDigits = bizPhoneRaw.replace(/\D/g, '');
let biz_phone =
  bizPhoneDigits.length === 10 ? `+1${bizPhoneDigits}` : bizPhoneDigits;

  
// build the locobiz_address object only if posting is permitted
let locobizAddress = null;

if (formData.get('locobiz_address.post_permission') === 'on') {
  // build the locobiz_address object only if posting is permitted
  locobizAddress = {
    post_permission: formData.get('locobiz_address.post_permission'),
    biz_phone: biz_phone,
    add_line1: formData.get('locobiz_address.add_line1'),
    add_line2: formData.get('locobiz_address.add_line2'),
    city: formData.get('locobiz_address.city'),
    state: formData.get('locobiz_address.state'),
    zipcode: formData.get('locobiz_address.zipcode'),
    country: formData.get('locobiz_address.country'),
  };
}
  // using cloudinary url to store photos
  

 //create businessData object with embedded members info
  const locobizData = {

   biz_account_owner_id: userId,
    account_owner_name: formData.get('account_owner_name'),
    
    phone: phone,
    mem_zip: formData.get('mem_zip'),
    // payment_confirmed:,
    // locobiz_active:,
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
    website: formData.get('website'),
    locobiz_profile_image: profileImageUrl,
    farmers_market_location: {
      fm_location_post: formData.get('farmers_market_location.farmers_market_location'),
      monday: {
        farmers_market_name: formData.get('farmers_market_location.monday.farmers_market_name'),
        city: formData.get('farmers_market_location.monday.city'),
        state: formData.get('farmers_market_location.monday.state'),
        zip: formData.get('farmers_market_location.monday.zip'),
      },
      tuesday: {
        farmers_market_name: formData.get('farmers_market_location.tuesday.farmers_market_name'),
        city: formData.get('farmers_market_location.tuesday.city'),
        state: formData.get('farmers_market_location.tuesday.state'),
        zip: formData.get('farmers_market_location.tuesday.zip'),
      },
      wednesday: {
        farmers_market_name: formData.get('farmers_market_location.wednesday.farmers_market_name'),
        city: formData.get('farmers_market_location.wednesday.city'),
        state: formData.get('farmers_market_location.wednesday.state'),
        zip: formData.get('farmers_market_location.wednesday.zip'),
      },
      thursday: {
        farmers_market_name: formData.get('farmers_market_location.thursday.farmers_market_name'),
        city: formData.get('farmers_market_location.thursday.city'),
        state: formData.get('farmers_market_location.thursday.state'),
        zip: formData.get('farmers_market_location.thursday.zip'),
      },
      friday: {
        farmers_market_name: formData.get('farmers_market_location.friday.farmers_market_name'),
        city: formData.get('farmers_market_location.friday.city'),
        state: formData.get('farmers_market_location.friday.state'),
        zip: formData.get('farmers_market_location.friday.zip'),
      },
      saturday: {
        farmers_market_name: formData.get('farmers_market_location.saturday.farmers_market_name'),
        city: formData.get('farmers_market_location.saturday.city'),
        state: formData.get('farmers_market_location.saturday.state'),
        zip: formData.get('farmers_market_location.saturday.zip'),
      },
      sunday: {
        farmers_market_name: formData.get('farmers_market_location.sunday.farmers_market_name'),
        city: formData.get('farmers_market_location.sunday.city'),
        state: formData.get('farmers_market_location.sunday.state'),
        zip: formData.get('farmers_market_location.sunday.zip'),
      },
    },
    selling: {
      selling1: {
        type: formData.get('selling.selling1.type'),
        description: formData.get('selling.selling1.description'),
        image: selling1ImageUrl,
        price: formData.get('selling.selling1.price'),
      },
      selling2: {
        type: formData.get('selling.selling2.type'),
        description: formData.get('selling.selling2.description'),
        image: selling2ImageUrl,
        price: formData.get('selling.selling2.price'),
      },
      selling3: {
        type: formData.get('selling.selling3.type'),
        description: formData.get('selling.selling3.description'),
        image:selling3ImageUrl,
        price: formData.get('selling.selling3.price'),
      },
    },
    needs: {
      need1: {
        description: formData.get('needs.need1.description'),
        image: need1ImageUrl,
        type: formData.get('needs.need1.type'),
        
      },
      need2: {
        type: formData.get('needs.need2.type'),
        description: formData.get('needs.need2.description'),
        image: need2ImageUrl,
      },
      need3: {
        type: formData.get('needs.need3.type'),
        description: formData.get('needs.need3.description'),
        image: need3ImageUrl,
      },
    },
  
    current_promotional: formData.get('current_promotional'),
    // locobiz_votes: {
    //   type: Number,
    // },
  };
//not sure if this is correct in adding a business as they are only going to be able to add one. 

  const newLocoBiz = new LocoBiz(locobizData);
  await newLocoBiz.save();

  revalidatePath('/', 'layout');

  redirect(`/businesses/${newLocoBiz._id}`);

    }
    


export default addBusinessAction;


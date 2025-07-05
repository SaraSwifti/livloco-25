'use server';
import connectDB from '@/config/database';
import LocoBiz from '@/models/LocoBiz';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
  



async function addBusinessAction(formData) {
  await connectDB();

  const sessionUser = await getSessionUser();
  
  if (!sessionUser || !sessionUser.userId) {
    throw new Error('User ID is required'); 
  }

  //not sure if I should bring in the userEmail to add to the account holder here or not. Currently it is comming in through DB connect in the biz add form.

  const { userId, userEmail} = sessionUser;


 //create businessData object with embedded members info
  const locobizData = {

   account_owner_id: userId,
    account_owner_name: formData.get('account_owner_name'),
    
    phone: formData.get('phone'),
    mem_zip: formData.get('mem_zip'),
    // payment_confirmed:,
    // locobiz_active:,
    locobiz_name: formData.get('locobiz_name'),
    locobiz_description: formData.get('locobiz_description'),
    // email_memmessage_notification: formData.get(email),
    locobiz_address: {
      post_permission: formData.get('locobiz_address.post_permission'),
      biz_phone: formData.get('locobiz_address.biz_phone'),
      add_line1: formData.get('locobiz_address.add_line1'),
      add_line2: formData.get('locobiz_address.add_line2'),
      city: formData.get('locobiz_address.city'),
      state: formData.get('locobiz_address.state'),
      zipcode: formData.get('locobiz_address.zipcode'),
      country: formData.get('locobiz_address.country'),
    },
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
    locobiz_profile_image: formData.get('locobiz_profile_image'),
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
        image: formData.get('selling.selling1.image'),
        price: formData.get('selling.selling1.price'),
      },
      selling2: {
        type: formData.get('selling.selling2.type'),
        description: formData.get('selling.selling2.description'),
        image: formData.get('selling.selling2.image'),
        price: formData.get('selling.selling2.price'),
      },
      selling3: {
        type: formData.get('selling.selling3.type'),
        description: formData.get('selling.selling3.description'),
        image: formData.get('selling.selling3.image'),
        price: formData.get('selling.selling3.description'),
      },
    },
    needs: {
      need1: {
        description: formData.get('needs.need1.description'),
        image: formData.get('needs.need1.image'),
        type: formData.get('needs.need1.type'),
        
      },
      need2: {
        type: formData.get('needs.need2.type'),
        description: formData.get('needs.need2.description'),
        image: formData.get('needs.need2.image'),
      },
      need3: {
        type: formData.get('needs.need3.type'),
        description: formData.get('needs.need3.description'),
        image: formData.get('needs.need3.image'),
      },
    },
  
    current_promotional: formData.get('current_promotional')
    // locobiz_votes: {
    //   type: Number,
    // },
  };
//not sure if this is correct in adding a business as they are only going to be able to add one. 

  const newLocoBiz = new LocoBiz(locobizData);
  await newPropery.save();

  revalidatePath('/', 'layout');

  redirect(`/businesses/${newLocoBiz._id}`);

    }
    


export default addBusinessAction;


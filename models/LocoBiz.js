import { Schema, model, models } from 'mongoose'


const LocoBizSchema = new Schema(
  {
    // biz_account_owner_id: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User',
      
    // },
    account_owner_name: {
      type: String,
      required: true,
    },
    phone:  {
  type: String,
  required: true,
  unique: true,
  match: /^\+1\d{10}$/,
  trim: true,
},
    mem_zip: {
      type: String,
      required: true,
      match: /^\d{5}(-\d{4})?$/, // Validates ZIP or ZIP+4
    },
    payment_confirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
    locobiz_active: {
      type: Boolean,
      default: false,
    },
    locobiz_name: String,
    locobiz_description: String,
    email_memmessage_notification: {
      type: Boolean,
      default: false,
    },
    locobiz_address: {
      post_permission: {
        type: Boolean,
        default: false,
      },
      biz_phone:  {
  type: String,
  match: /^\+1\d{10}$/,
  trim: true,
},
      add_line1: {
        type: String,
        trim: true,
      },
      add_line2: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      zipcode: {
        type: String,
        match: /^\d{5}(-\d{4})?$/, // U.S. ZIP Code format (5-digit or 9-digit ZIP+4)
      },
      country: {
        type: String,
        required: true,
        default: 'USA',
        trim: true,
      },
    },
    business_hours: {
    
      post_permission: {
        type: Boolean,
        default: false,
      },
      monday_hours: {
        type: String,
        trim: true,
      },
      tuesday_hours:{
        type: String,
        trim: true,
      },
      wednesday_hours: {
        type: String,
        trim: true,
      },
      thursday_hours:{
        type: String,
        trim: true,
      },
      friday_hours: {
        type: String,
        trim: true,
      },
      saturday_hours: {
        type: String,
        trim: true,
      },
      sunday_hours: {
        type: String,
        trim: true,
      },
    },
    website: {
      type: String,
      unique: true,
      trim: true,
      //match: /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/
      match: /regex/,
    },
    locobiz_profile_image: {
      type: String,
      required: false,
        
    },
    farmers_market_location: {
      fm_location_post: {
        type: Boolean,
        default: false,
      },
      monday: {
        farmers_market_name: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          trim: true,
        },
        state: {
          type: String,
          trim: true,
        },
          zip: {
          type: String,
          trim: true,
        },
      },
      tuesday: {
        farmers_market_name: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          trim: true,
        },
        state: {
          type: String,
          trim: true,
        },
        zip: {
          type: String,
          trim: true,
        },
      },
      wednesday: {
        farmers_market_name: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          trim: true,
        },
        state: {
          type: String,
          trim: true,
        },
        zip: {
          type: String,
          trim: true,
        },
      },
      thursday: {
        farmers_market_name: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          trim: true,
        },
        state: {
          type: String,
          trim: true,
        },
        zip: {
          type: String,
          trim: true,
        },
      },
      friday: {
        farmers_market_name: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
        },
        state: {
          type: String,
        },
        zip: {
          type: String,
          trim: true,
        },
      },
      saturday: {
        farmers_market_name: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          trim: true,
        },
        state: {
          type: String,
          trim: true,
        },
        zip: {
          type: String,
          trim: true,
        },
      },
      sunday: {
        farmers_market_name: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          trim: true,
        },
        state: {
          type: String,
          trim: true,
        },
        zip: {
          type: String,
          trim: true,
        },
      },
    },
    selling: {
      selling1: {
        type: {
          type: String,
            required: false,
        },
        description: {
          type: String,
          trim: true,
            required: false,
        },
        image: {
          type: String,
          required: false,
         
        },
        price: {
          type: String,
          trim: true,
            required: false,
        },
      },
      selling2: {
        type: {
          type: String,
            required: false,
        },
        description: {
          type: String,
          trim: true,
            required: false,
        },
        image: {
          type: String,
          required: false,
           
        },
        price: {
          type: String,
          trim: true,
            required: false,
        },
      },
      selling3: {
        type: {
          type: String,
            required: false,
        },
        description: {
          type: String,
          trim: true,
            required: false,
        },
        image: {
          type: String,
          required: false,
            
        },
        price: {
          type: String,
          trim: true,
            required: false,
        },
      },
    },
    needs: {
      need1: {
        type: {
          type: String,
            required: false,
        },
        description: {
          type: String,
          trim: true,
            required: false,
        },
        image: {
          type: String,
          required: false,
            
        },
      },
      need2: {
        type: {
          type: String,
            required: false,
        },
        description: {
          type: String,
          trim: true,
            required: false,
        },
        image: {
          type: String,
          required: false,
             
        },
      },
      need3: {
        type: {
          type: String,
            required: false,
        },
        description: {
          type: String,
          trim: true,
            required: false,
        },
        image: {
          type: String,
          required: false,
           
        },
      },
    },
    current_promotional: {
      type: String,
      trim: true,
        required: false,
    },
    locobiz_votes: {
      type: Number,
        required: false,
    },
  },
  {
    timestamps: true,
  }
)

const LocoBiz = models.LocoBiz || model('LocoBiz', LocoBizSchema)

export default LocoBiz;

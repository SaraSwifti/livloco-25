import { Schema, model, models } from 'mongoose';

const US_STATE_CODES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY'
];

// ✅ Map from code → full name
const US_STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina',
  ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
  TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'
};

const stateFields = {
  state_code: { type: String, enum: US_STATE_CODES },
  state_name: { type: String, trim: true }, // optional display-friendly name
};

const LocoBizSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    account_owner_name: {
      type: String,
      required: true,
    },
    phone: {
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
      biz_phone: {
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
      ...stateFields,
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
      tuesday_hours: {
        type: String,
        trim: true,
      },
      wednesday_hours: {
        type: String,
        trim: true,
      },
      thursday_hours: {
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
      match: /^https?:\/\/[^\s$.?#].[^\s]*$/i,
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
        ...stateFields,
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
        ...stateFields,
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
        ...stateFields,
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
        ...stateFields,
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
        ...stateFields,
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
        ...stateFields,
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
        ...stateFields,
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
);

  
// Auto-derive state_name from state_code
LocoBizSchema.pre('save', function (next) {
  // Business address
  if (this.locobiz_address?.state_code) {
    this.locobiz_address.state_name =
      US_STATE_NAMES[this.locobiz_address.state_code] || this.locobiz_address.state_name;
  }

    // Farmers market locations
  const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  days.forEach(day => {
    if (this.farmers_market_location?.[day]?.state_code) {
      this.farmers_market_location[day].state_name =
        US_STATE_NAMES[this.farmers_market_location[day].state_code] ||
        this.farmers_market_location[day].state_name;
    }
  });

  next();
});

const LocoBiz = models.LocoBiz || model('LocoBiz', LocoBizSchema)

export default LocoBiz

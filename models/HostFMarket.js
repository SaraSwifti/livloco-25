import mongoose from 'mongoose';

const { Schema } = mongoose;

/* ------------------------- Helpers & Validators ------------------------- */

// Allow empty values, otherwise enforce http/https URL
const isHttpUrl = (v) => {
  if (v === undefined || v === null) return true;
  const s = String(v).trim();
  if (s === '') return true; // treat empty as "not provided"
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

// US ZIP (5-digit or ZIP+4)
const ZIP_REGEX = /^\d{5}(-\d{4})?$/;

/* ------------------------------- Sub-schemas ------------------------------ */

const AddressSchema = new Schema(
  {
    hostfm_phone: { type: String, trim: true },
    add_line1: { type: String, required: true, trim: true },
    add_line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    zipcode: {
      type: String,
      required: true,
      trim: true,
      set: (v) => (v == null ? v : String(v).trim()),
      validate: {
        validator: (v) => v == null || v === '' || ZIP_REGEX.test(v),
        message: (props) => `Invalid ZIP code "${props.value}". Use 12345 or 12345-6789.`,
      },
    },
    country: { type: String, trim: true, default: 'USA' },
    state_code: { type: String, required: true, trim: true, uppercase: true, minlength: 2, maxlength: 2 },
    state_name: { type: String, trim: true },
  },
  { _id: false }
);

const WeeklyScheduleSchema = new Schema(
  {
    weekly_sched: { type: Boolean, default: false },
    monday_hours: { type: String, trim: true, default: '' },
    tuesday_hours: { type: String, trim: true, default: '' },
    wednesday_hours: { type: String, trim: true, default: '' },
    thursday_hours: { type: String, trim: true, default: '' },
    friday_hours: { type: String, trim: true, default: '' },   // ✅ fixed key
    saturday_hours: { type: String, trim: true, default: '' },
    sunday_hours: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const RandomDateSchema = new Schema(
  {
    // ISO date strings will be cast to Date automatically
    date: { type: Date, required: true },
    time: { type: String, trim: true, default: '' }, // e.g., "10:45 AM – 2:05 PM"
  },
  { _id: false }
);

const HostfmDatesSchema = new Schema(
  {
    hostfm_randomdates: { type: Boolean, default: false },
    dates: { type: [RandomDateSchema], default: [] },
  },
  { _id: false }
);

/* --------------------------------- Main ---------------------------------- */

const HostFMarketSchema = new Schema(
  {
    // Account / contact
    email: { type: String, trim: true, lowercase: true },
    //moving these to the user or member data
    // account_owner_name: { type: String, trim: true },
    // phone: { type: String, trim: true },

    // Identity / visibility
    hostfm_profile_image: {
      type: String,
      trim: true,
      validate: {
        validator: isHttpUrl,
        message: (props) => `Invalid image URL "${props.value}". Use http(s)://...`,
      },
    },
    hostfm_active: { type: Boolean, default: false },

    hostfm_name: { type: String, trim: true, required: true },
    hostfm_description: { type: String, trim: true },
    hostfm_type: { type: String, trim: true },

    email_memmessage_notification: { type: Boolean, default: false },

    // Address & site
    hostfm_address: { type: AddressSchema, default: () => ({}) },
    hostfm_website: {
      type: String,
      trim: true,
      validate: {
        validator: isHttpUrl,
        message: (props) => `Invalid website URL "${props.value}". Use http(s)://...`,
      },
    },

    // Stalls
    stall_avail: { type: Boolean, default: false },
    stall_pricing: { type: String, trim: true }, // e.g., "free"
    stall_size: { type: String, trim: true },    // e.g., "20' x 20'"
    stall_included: { type: String, trim: true },

    // Scheduling
    hostfm_weekly_sched: { type: WeeklyScheduleSchema, default: () => ({}) },
    hostfm_dates: { type: HostfmDatesSchema, default: () => ({}) },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: 'hostfmarkets'
  }
);

/* ----------------------------- Data hygiene ------------------------------ */

// Fill state_name from state_code if missing (extend map as needed)
const STATE_MAP = new Map([
  ['MI', 'Michigan'],
  ['NM', 'New Mexico'],
  // ['CA', 'California'], ...
]);

HostFMarketSchema.pre('validate', function (next) {
  try {
    const addr = this.hostfm_address;
    if (addr?.state_code && !addr.state_name) {
      const name = STATE_MAP.get(String(addr.state_code).toUpperCase());
      if (name) addr.state_name = name;
    }
    next();
  } catch (err) {
    next(err);
  }
});

/* -------------------------------- Indexes -------------------------------- */

HostFMarketSchema.index({ hostfm_active: 1 });
HostFMarketSchema.index({ 'hostfm_address.state_code': 1, 'hostfm_address.city': 1 });
HostFMarketSchema.index({ hostfm_name: 'text', hostfm_description: 'text' });

/* -------------------------------- Export --------------------------------- */

export default mongoose.models.HostFMarket ||
  mongoose.model('HostFMarket', HostFMarketSchema);


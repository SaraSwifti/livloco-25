import { Schema, model, models } from 'mongoose';
import { FaLess } from 'react-icons/fa';

const LocoMemSchema = new Schema(
    {
        memowner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        account_owner_name: {
            type: String,
            required: true
        },
        phone: 
        { 
            type: String, 
            required: true, 
            unique: true, 
            trim: true, //removes uncessary white space. 
            match: /^\+?[1-9]\d{1,14}$/ // Ensures valid international format (E.164)
          },
        payment_confirmed: {
            type: Boolean,
            required: true, 
            default: false
        },
        locobiz_active: {
            type: Boolean,
            default: false
        },
        locobiz_name: String,
        locobiz_description: String,
        email_memmessage_notification: {
            type: Boolean,
            default: false
        },
        locobiz_address: {
            post_permission: {
                type: Boolean
            },
            add_line1:{ type: String, required: true, trim: true },
            add_line2: { type: String, required: false, trim: true },
            city: { type: String, required: true, trim: true },
            state: { type: String, required: true, trim: true },
            zipcode: { 
                type: String, 
                required: true, 
                match: /^\d{5}(-\d{4})?$/ // U.S. ZIP Code format (5-digit or 9-digit ZIP+4)
              },
            country: { 
                type: String, 
                required: true, 
                default: "USA", 
                trim: true 
              }
        },
        business_hours: {
            post_permission:
            {
                type: Boolean
            },
            monday_hours: String,
            tuesday_hours: String,
            wednesday_hours: String,
            thursday_hours: String,
            friday_hours: String,
            saturday_hours: String,
            sunday_hours: String,
        },
        website: {
            type: String,  
            unique: true, 
            trim: true, 
            //match: /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/ 
            match: /regex/
        },
        locobiz_profile_image:
        { type: String
                 },
        farmers_market_location: {
            fm_location_post: {
                type: Boolean
            },
            monday: {
                farmers_market_name: {
                    type: String
                },
                city: {
                    type: String
                },
                state: {
                    type: String
                }
            },
            tuesday: {
                farmers_market_name: {
                    type: String
                },
                city: {
                    type: String
                },
                state: {
                    type: String
                }
            },
            wednesday: {
                farmers_market_name: {
                    type: String
                },
                city: {
                    type: String
                },
                state: {
                    type: String
                }
            },
            thursday: {
                farmers_market_name: {
                    type: String
                },
                city: {
                    type: String
                },
                state: {
                    type: String
                }
            },
            friday: {
                farmers_market_name:  {
                    type: String
                },
                city:  {
                    type: String
                },
                state:  {
                    type: String
                }
            },
            saturday: {
                farmers_market_name:  {
                    type: String
                },
                city:  {
                    type: String
                },
                state:  {
                    type: String
                }
            },
            sunday: {
                farmers_market_name:  {
                    type: String
                },
                city:  {
                    type: String
                },
                state:  {
                    type: String
                }
            }
        },
        selling: {
            selling1: {
                description:  {
                    type: String
                },
                image:  {
                    type: String
                },
                price: {
                    type: String
                }
            },
            selling2: {
                description:  {
                    type: String
                },
                image:  {
                    type: String
                },
                price: {
                    type: String
                }
            },
            selling3: {
                description:{
                    type: String
                },
                image: {
                    type: String
                },
                price: {
                    type: String
                }
            }
        },
        needs: {
            need1: {
                description: {
                    type: String
                },
                image: {
                    type: String
                }
            },
            need2: {
                description: {
                    String
                },
                image:{
                    type: String
                }
            },
            need3: {
                description:{
                    type: String
                },
                image: {
                    type: String
                }
            }
        },
        locobiz_votes: {
            type: Number
        }
}, {
    timestamps: true
});

const LocoMem = models.LocoMem || model('LocoMem', LocoMemSchema);

export default LocoMem;
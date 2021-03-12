const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
  store_hash: {
    type: String,
    required: true
  },
  order_source: {
    type: String,
    enum: ['manual', 'external']
  },
  internal_source: {
    type: String
  },
  external_source: {
    type: String
  },
  customer_id: {
    type: Schema.Types.Mixed,
    default: 0
  },
  refunded: [{
    type: Schema.Types.ObjectId,
    ref: 'OrderRefund'
  }],
  status_id: {
    type: Number,
    default: 1
  },
  discount_amount_exc_tax: {
    type: Number,
    default: 0
  },
  discount_amount_inc_tax: {
    type: Number,
    default: 0
  },
  coupon: {
    id: {
      type: String
    },
    code: {
      type: String
    },
    amount: {
      type: Number
    },
    coupon_type: {
      type: String
    }
  },
  subtotal_exc_tax: {
    type: Number,
    default: 0
  },
  subtotal_inc_tax: {
    type: Number,
    default: 0
  },
  total_exc_tax: {
    type: Number,
    default: 0
  },
  total_inc_tax: {
    type: Number,
    default: 0
  },
  shipping_cost_exc_tax: {
    type: Number,
    default: 0
  },
  shipping_cost_inc_tax: {
    type: Number,
    default: 0
  },
  shipping_method: {
    type: String
  },
  shipping_method_custom: {
    type: String
  },
  zone_id: {
    type: String
  },
  currency_code: {
    type: String,
    default: 'GBP'
  },
  payment_method: {
    type: String
  },
  payment_description: {
    type: String
  },
  payment_provider: {
    type: String
  },
  payment_status: {
    type: String
  },
  stripe_account_id: {
    type: String
  },
  stripe_payment_intent_id: {
    type: String
  },
  order_is_digital: {
    type: Boolean,
    default: false
  },
  comments: {
    type: String
  },
  staff_notes: {
    type: String
  },
  billing_address: {
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    company_name: {
      type: String
    },
    line_1: {
      type: String,
      required: true
    },
    line_2: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    postcode: {
      type: String,
      required: true
    },
    country: {
      type: String
    },
    country_code: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    phone_number: {
      type: String
    }
  },
  shipping_address: {
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    company_name: {
      type: String
    },
    line_1: {
      type: String,
      required: true
    },
    line_2: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    postcode: {
      type: String,
      required: true
    },
    country: {
      type: String
    },
    country_code: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    phone_number: {
      type: String
    }
  },
  line_items: [{
    product_id: {
      type: String,
      required: true
    },
    variant_id: {
      type: String
    },
    track_inventory: {
      type: String,
      default: 'none'
    },
    name: {
      type: String,
      required: true
    },
    sku: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      default: 0
    },
    sale_price: {
      type: Number
    },
    on_sale: {
      type: Boolean,
      default: false
    },
    images: {
      type: Array,
      default: []
    },
    product_options: [
      {
        _id: false,
        display_name: {
          type: String,
          required: true
        },
        display_value: {
          type: String,
          required: true
        }
      }
    ]
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
}, { versionKey: false })

module.exports = OrderSchema

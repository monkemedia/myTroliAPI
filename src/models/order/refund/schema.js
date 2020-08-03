const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderRefundSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  order_id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  customer_id: {
    type: String,
    required: true
  },
  reason: {
    type: String
  },
  total_amount: {
    type: Number
  },
  items: [
    {
      item_type: {
        type: String
      },
      item_id: {
        type: String
      },
      variant_id: {
        type: String
      },
      quantity: {
        type: Number
      },
      amount: {
        type: Number
      }
    }
  ],
  payment: {
    provider: {
      type: String,
      required: true
    },
    charge_id: {
      type: String
    },
    amount: {
      type: Number
    },
    is_declined: {
      type: Boolean
    },
    declined_message: {
      type: String
    },
    offline: {
      type: Boolean
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false })

module.exports = orderRefundSchema

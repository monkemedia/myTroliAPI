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
      quantity: {
        type: Number
      },
      amount: {
        type: Number
      }
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false })

module.exports = orderRefundSchema

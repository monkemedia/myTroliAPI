const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productOptionSchema = new Schema({
  type: {
    type: String,
    required: true
  },

  sort_order: {
    type: Number,
    default: 0
  },

  display_name: {
    type: String,
    required: true
  },

  product_id: {
    type: String,
    required: true
  },

  option_values: [{
    is_default: {
      type: Boolean,
      default: false
    },
    label: {
      type: String
    },
    sort_order: {
      type: Number,
      default: 0
    }
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
}, { versionKey: false })

module.exports = productOptionSchema

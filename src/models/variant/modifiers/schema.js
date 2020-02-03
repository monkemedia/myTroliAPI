const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productOptionModifierSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: false
  },
  price: {
    type: Object,
    required: false
  },
  variant_id: {
    type: String,
    required: true
  },
  option_id: {
    type: String,
    required: true,
    unique: true
  }
}, { versionKey: false })

module.exports = productOptionModifierSchema

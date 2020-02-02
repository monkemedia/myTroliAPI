const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productOptionModifierSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  price: {
    type: Object,
    required: true
  }
}, { versionKey: false })

module.exports = productOptionModifierSchema

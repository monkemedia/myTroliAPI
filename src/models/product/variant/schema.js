const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productVariantSchema = new Schema({
  type: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  // name: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Variation'
  // },

  product_id: {
    type: String,
    required: true
  },

  values: {
    type: String
  }
}, { versionKey: false })

module.exports = productVariantSchema

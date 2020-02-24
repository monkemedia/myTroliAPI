const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productVariantSchema = new Schema({
  type: {
    type: String,
    required: true
  },

  name: {
    type: Schema.Types.ObjectId,
    ref: 'Variation'
  },

  options: [{
    type: Schema.Types.ObjectId,
    ref: 'ProductVariantOptions'
  }]
}, { versionKey: false })

module.exports = productVariantSchema

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productVariantRelationshipSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  variant_id: {
    type: String,
    required: true,
    unique: true
  }
}, { versionKey: false })

module.exports = productVariantRelationshipSchema

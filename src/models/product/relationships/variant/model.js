const mongoose = require('mongoose')
const uniqueArrayPlugin = require('mongoose-unique-array')
const productVariantRelationshipSchema = require('./schema')

productVariantRelationshipSchema.plugin(uniqueArrayPlugin)

// Find all variant relationships by variant id
productVariantRelationshipSchema.statics.findRelationshipIdByVariantId = (id) => Variant.find({ variant_id: id })

// // Find variant by id
// productVariantRelationshipSchema.statics.findVariant = (id) => Variant.findOne({ _id: id })

// Delete variant
productVariantRelationshipSchema.statics.deleteVariant = (variantId) => Variant.deleteOne({ variant_id: variantId })

// // Update variant
// productVariantRelationshipSchema.statics.updateVariant = async ({ _id, data }) => {
//   const variant = await Variant.updateOne({ _id }, { data })
//   return variant
// }

const Variant = mongoose.model('ProductVariantRelationship', productVariantRelationshipSchema)

module.exports = Variant

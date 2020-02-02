const mongoose = require('mongoose')
const variantSchema = require('./schema')

// Get all variants
variantSchema.statics.findAllVariants = async () => {
  const variants = await Variant.find({})

  return variants
}

// Update variant
variantSchema.statics.updateVariant = async (variantDetails) => {
  const { _id } = variantDetails

  const variant = await Variant.updateOne({ _id }, variantDetails)
  return variant
}

// Delete variant
variantSchema.statics.deleteVariant = async (variantId) => {
  const variant = await Variant.deleteOne({ _id: variantId })
  return variant
}

const Variant = mongoose.model('Variant', variantSchema)

module.exports = Variant

const mongoose = require('mongoose')
const variationSchema = require('./schema')

// Get all variations
variationSchema.statics.findAllVariations = async () => {
  const variations = await Variation.find({})

  return variations
}

// Update Variation
variationSchema.statics.updateVariation = async (variationDetails) => {
  const { _id } = variationDetails

  const variation = await Variation.updateOne({ _id }, variationDetails)
  return variation
}

// Delete variation
variationSchema.statics.deleteVariation = async (variationId) => {
  const variation = await Variation.deleteOne({ _id: variationId })
  return variation
}

const Variation = mongoose.model('Variation', variationSchema)

module.exports = Variation

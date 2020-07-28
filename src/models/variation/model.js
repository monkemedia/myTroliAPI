const mongoose = require('mongoose')
const variationSchema = require('./schema')

// Get variations
variationSchema.statics.findVariations = async () => {
  const variations = await Variation.find({})

  return variations
}

// Update Variation
variationSchema.statics.updateVariation = async (variationId, variationDetails) => {
  const variation = await Variation.updateOne({ _id: variationId }, {
    ...variationDetails,
    updated_at: Date.now()
  })
  return variation
}

// Delete variation
variationSchema.statics.deleteVariation = async (variationId) => {
  const variation = await Variation.deleteOne({ _id: variationId })
  return variation
}

const Variation = mongoose.model('Variation', variationSchema)

module.exports = Variation

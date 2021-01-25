const mongoose = require('mongoose')
const VariationSchema = require('./schema')

// Get variations
VariationSchema.statics.findVariations = async () => {
  const variations = await Variation.find({})

  return variations
}

// Update Variation
VariationSchema.statics.updateVariation = async (variationId, variationDetails) => {
  const variation = await Variation.updateOne({ _id: variationId }, {
    ...variationDetails,
    updated_at: Date.now()
  })
  return variation
}

// Delete variation
VariationSchema.statics.deleteVariation = async (variationId) => {
  const variation = await Variation.deleteOne({ _id: variationId })
  return variation
}

const Variation = mongoose.model('Variation', VariationSchema)

module.exports = Variation

const mongoose = require('mongoose')
const promotionSchema = require('./schema')

// Get all promotions
promotionSchema.statics.findPromotions = async (page, limit) => {
  const promotions = await Promotion.find({})
  return promotions
}

// Get promotion
promotionSchema.statics.findPromotion = async (promotionId) => {
  const promotion = await Promotion.findOne({ _id: promotionId })
  return promotion
}

// Update promotion
promotionSchema.statics.updatePromotion = async (promotionId, promotionDetails) => {
  const promotion = await Promotion.updateOne({ _id: promotionId }, promotionDetails)
  return promotion
}

// Delete promotion by id
promotionSchema.statics.deletePromotion = async (_id) => {
  const promotion = await Promotion.deleteOne({ _id })
  return promotion
}

const Promotion = mongoose.model('Promotion', promotionSchema)

module.exports = Promotion

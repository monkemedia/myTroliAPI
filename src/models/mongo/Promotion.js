const mongoose = require('mongoose')
const Schema = mongoose.Schema

const promotionSchema = Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  promotion_type: {
    type: String,
    required: true
  },
  enabled: {
    type: String,
    required: true
  },
  start: {
    type: String,
    required: true
  },
  end: {
    type: String,
    required: true
  },
  percentage: {
    type: Number,
    required: false
  }
})

// Get all promotions
promotionSchema.statics.findAllPromotions = async (page, limit) => {
  const promotions = await Promotion.find({})
  return promotions
}

// Get promotion by promotion id
promotionSchema.statics.findAddress = async (promotionId) => {
  const promotion = await Promotion.findOne({ _id: promotionId })
  return promotion
}

// Update promotion
promotionSchema.statics.updatePromotion = async (promotionDetails) => {
  const { _id } = promotionDetails

  const promotion = await Promotion.updateOne({ _id }, promotionDetails)
  return promotion
}

// Delete promotion by id
promotionSchema.statics.deletePromotion = async (_id) => {
  const promotion = await Promotion.deleteOne({ _id })
  return promotion
}

const Promotion = mongoose.model('Promotion', promotionSchema)

module.exports = Promotion

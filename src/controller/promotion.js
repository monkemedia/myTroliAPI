const errorHandler = require('../utils/errorHandler')
const Promotion = require('../models/promotion')

const createPromotion = async (req, res) => {
  const data = req.body
  const { type, name, description, promotion_type, enabled, start, end } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'promotion') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (!name) {
    return res.status(401).send({
      message: 'Name is required'
    })
  }

  if (!description) {
    return res.status(401).send({
      message: 'Description is required'
    })
  }

  if (!promotion_type) {
    return res.status(401).send({
      message: 'Promotion type is required'
    })
  }

  if (!enabled) {
    return res.status(401).send({
      message: 'Enabled is required'
    })
  }

  if (!start) {
    return res.status(401).send({
      message: 'Start date is required'
    })
  }

  if (!end) {
    return res.status(401).send({
      message: 'End date is required'
    })
  }

  try {
    const promotions = new Promotion(data)

    await promotions.save()

    res.status(201).send(promotions)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.findPromotions()

    res.status(200).send(promotions)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getPromotion = async (req, res) => {
  const promotionId = req.params.promotionId
  const promotion = await Promotion.findOne({ _id: promotionId })

  res.status(200).send(promotion)
}

const updatePromotion = async (req, res) => {
  const promotionId = req.params.promotionId
  const data = req.body
  const { type } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'promotion') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  try {
    await Promotion.updatePromotion(promotionId, data)
    const promotion = await Promotion.findOne({ _id: promotionId })

    res.status(200).send(promotion)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deletePromotion = async (req, res) => {
  try {
    await Promotion.deletePromotion(req.params.promotionId)

    res.status(200).send({
      message: 'Promotion successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createPromotion,
  getPromotions,
  getPromotion,
  updatePromotion,
  deletePromotion
}

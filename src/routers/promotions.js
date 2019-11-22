const express = require('express')
const Promotion = require('../models/Promotion')
const auth = require('../middleware/auth')
const errorHandler = require('../utils/errorHandler')
const router = express.Router()

// Create a new Promotion
router.post('/promotions', auth, async (req, res) => {
  const data = req.body.data
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

    res.status(201).send({ data: promotions })
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
})

// Get all promotions
router.get('/promotions', auth, async (req, res) => {
  try {
    const promotions = await Promotion.findAllPromotions()

    res.status(200).send({ data: promotions })
  } catch (err) {
    res.status(400).send(err)
  }
})

// Get promotion
router.get('/promotions/:promotionId', auth, async (req, res) => {
  const _id = req.params.promotionId
  const promotion = await Promotion.findOne({ _id })

  res.status(200).send({ data: promotion })
})

// Update promotion
router.put('/promotions/:promotionId', auth, async (req, res) => {
  const _id = req.params.promotionId
  const currentPromotionDetails = await Promotion.findOne({ _id })
  const data = req.body.data
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
    const data = {
      type,
      _id,
      name: name || currentPromotionDetails.name,
      description: description || currentPromotionDetails.description,
      promotion_type: promotion_type || currentPromotionDetails.promotion_type,
      enabled: enabled || currentPromotionDetails.enabled,
      start: start || currentPromotionDetails.start,
      end: end || currentPromotionDetails.end
    }

    await Promotion.updatePromotion(data)

    res.status(200).send({ data })
  } catch (err) {
    res.status(400).send(err)
  }
})

// Delete promotion
router.delete('/promotions/:promotionId', auth, async (req, res) => {
  try {
    await Promotion.deletePromotion(req.params.promotionId)

    res.status(200).send({
      message: 'Promotion successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router

const Variation = require('../models/variation/index.js')

const createVariation = async (req, res) => {
  const data = req.body.data
  const { type, name } = req.body.data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'variation') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (!name) {
    return res.status(401).send({
      message: 'Name is required'
    })
  }

  try {
    const variation = new Variation(data)

    await variation.save()

    res.status(201).send({ data: variation })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getVariations = async (req, res) => {
  try {
    const variation = await Variation.findAllVariations()

    res.status(200).send({ data: variation })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getVariation = async (req, res) => {
  const variation = await Variation.findOne({ _id: req.params.variationId })

  res.status(200).send({ data: variation })
}

const updateVariation = async (req, res) => {
  const _id = req.params.variationId
  const currentVariationDetails = await Variation.findOne({ _id })
  const { type, name } = req.body.data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'variation') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  const data = {
    type,
    _id,
    name: name || currentVariationDetails.name
  }

  try {
    await Variation.updateVariation(data)

    res.status(200).send({ data })
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteVariation = async (req, res) => {
  try {
    await Variation.deleteVariation(req.params.variationId)

    res.status(200).send({
      message: 'Variation successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createVariation,
  getVariations,
  getVariation,
  updateVariation,
  deleteVariation
}

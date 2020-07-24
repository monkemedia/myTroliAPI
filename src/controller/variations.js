const Variation = require('../models/variation/index.js')
const Product = require('../models/product/index.js')
const ProductVariant = require('../models/product/variant/index.js')
const ProductOption = require('../models/product/option/index.js')

const createVariation = async (req, res) => {
  const data = req.body
  const { type, value } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'variation') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  if (!value) {
    return res.status(401).send({
      message: 'Value is required'
    })
  }

  try {
    const variation = new Variation(data)

    await variation.save()

    res.status(201).send(variation)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getVariations = async (req, res) => {
  try {
    const variation = await Variation.findVariations()

    res.status(200).send(variation)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getVariation = async (req, res) => {
  const variation = await Variation.findOne({ _id: req.params.variationId })

  res.status(200).send(variation)
}

const updateVariation = async (req, res) => {
  const variationId = req.params.variationId
  const data = req.body
  const { type } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'variation') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  try {
    await Variation.updateVariation(variationId, data)
    const variation = await Variation.findOne({ _id: variationId })

    res.status(200).send(variation)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteVariation = async (req, res) => {
  try {
    const variationId = req.params.variationId
    // Delete all Variants which contain variationId
    const productVariant = await ProductVariant.find({ name: variationId })
    // Map through options and delete
    productVariant.map(async variant => {
      variant.options.map(async option => {
        await ProductOption.deleteOne({ _id: option._id })
      })
      await ProductVariant.deleteOne({ _id: variant._id })

      const products = await Product.find({ variants: variant._id })

      products.map(product => {
        product.variants.pull(variant._id)
        product.save()
      })
    })

    // Now delete variation
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

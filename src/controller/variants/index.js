const Variant = require('../../models/variant/index.js')
const VariantRelationship = require('../../models/product/relationships/variant')

const createVariant = async (req, res) => {
  const data = req.body.data
  const { type, name } = req.body.data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product-variant') {
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
    const variant = new Variant(data)

    await variant.save()

    res.status(201).send({ data: variant })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getVariants = async (req, res) => {
  try {
    const variants = await Variant.findAllVariants()

    res.status(200).send({ data: variants })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getVariant = async (req, res) => {
  const variant = await Variant.findOne({ _id: req.params.variantId })

  res.status(200).send({ data: variant })
}

const updateVariant = async (req, res) => {
  const _id = req.params.variantId
  const currentVariantDetails = await Variant.findOne({ _id })
  const { type, name } = req.body.data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product-variant') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  const data = {
    type,
    _id,
    name: name || currentVariantDetails.name
  }

  try {
    await Variant.updateVariant(data)

    res.status(200).send({ data })
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteVariant = async (req, res) => {
  try {
    // Delete any relationships first
    const relationships = await VariantRelationship.findAllByVariantIds(req.params.variantId)
    relationships.map(async relationship => {
      await VariantRelationship.deleteVariant(relationship._id)
    })

    await Variant.deleteVariant(req.params.variantId)

    res.status(200).send({
      message: 'Variant successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createVariant,
  getVariants,
  getVariant,
  updateVariant,
  deleteVariant
}

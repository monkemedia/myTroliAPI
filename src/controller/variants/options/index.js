const Option = require('../../../models/variant/options/index.js')

const createVariantOption = async (req, res) => {
  const data = req.body.data
  const { type, name, description } = req.body.data
  const variant_id = req.params.variantId

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product-variant-option') {
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

  try {
    const option = new Option({ ...data, variant_id })

    await option.save()

    res.status(201).send({ data: option })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getVariantOptions = async (req, res) => {
  try {
    const variant_id = req.params.variantId
    const options = await Option.findAllOptions(variant_id)

    res.status(200).send({ data: options })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getVariantOption = async (req, res) => {
  const option = await Option.findOne({ _id: req.params.optionId })

  res.status(200).send({ data: option })
}

const updateVariantOption = async (req, res) => {
  const _id = req.params.optionId
  const currentOptionDetails = await Option.findOne({ _id })
  const { type, name, description } = req.body.data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product-variant-option') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  const data = {
    type,
    _id,
    name: name || currentOptionDetails.name,
    description: description || currentOptionDetails.description
  }

  try {
    await Option.updateOption(data)

    res.status(200).send({ data })
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteVariantOption = async (req, res) => {
  try {
    await Option.deleteOption(req.params.optionId)

    res.status(200).send({
      message: 'Option successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createVariantOption,
  getVariantOptions,
  getVariantOption,
  updateVariantOption,
  deleteVariantOption
}

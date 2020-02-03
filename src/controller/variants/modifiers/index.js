const Modifier = require('../../../models/variant/modifiers/index.js')
const currencySymbol = require('currency-symbol-map')

const createOptionModifier = async (req, res) => {
  const data = req.body.data
  const { type, stock, price } = req.body.data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'modifier') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (stock) {
    return res.status(401).send({
      message: 'Stock is required'
    })
  }

  if (typeof stock !== 'number') {
    return res.status(401).send({
      message: 'Stock requires a number'
    })
  }

  if (!price) {
    return res.status(401).send({
      message: 'Price is required'
    })
  }

  if (isNaN(price.amount)) {
    return res.status(401).send({
      message: 'Price amount is required'
    })
  }

  if (typeof price.amount !== 'number') {
    return res.status(401).send({
      message: 'Price amount requires a number'
    })
  }

  if (!price.currency) {
    return res.status(401).send({
      message: 'Price currency is required'
    })
  }

  if (!currencySymbol(price.currency)) {
    return res.status(401).send({
      message: 'Price currency is not a 3 letter ISO'
    })
  }

  try {
    const modifier = new Modifier(data)

    await modifier.save()

    res.status(201).send({ data: modifier })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getOptionModifiers = async (req, res) => {
  try {
    const modifiers = await Modifier.findAllModifiers()

    res.status(200).send({ data: modifiers })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getOptionModifier = async (req, res) => {
  const modifier = await Modifier.findOne({ _id: req.params.modifierId })

  res.status(200).send({ data: modifier })
}

const updateOptionModifier = async (req, res) => {
  const _id = req.params.modifierId
  const currentModifierDetails = await Modifier.findOne({ _id })
  const { type, price, stock } = req.body.data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'modifier') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (!isNaN(stock) && typeof stock !== 'number') {
    return res.status(401).send({
      message: 'Stock requires a number'
    })
  }

  if (price && typeof price !== 'object') {
    return res.status(401).send({
      message: 'Price requires an object'
    })
  }

  if (price && !isNaN(price.amount) && typeof price.amount !== 'number') {
    return res.status(401).send({
      message: 'Price amount requires a number'
    })
  }

  if (price && price.currency && !currencySymbol(price.currency)) {
    return res.status(401).send({
      message: 'Price currency is not a 3 letter ISO'
    })
  }

  const data = {
    type,
    _id,
    stock: !isNaN(stock) ? stock : currentModifierDetails.stock,
    price: price || currentModifierDetails.price
  }

  try {
    await Modifier.updateModifier(data)

    res.status(200).send({ data })
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteOptionModifier = async (req, res) => {
  try {
    await Modifier.deleteModifier(req.params.modifierId)

    res.status(200).send({
      message: 'Modifier successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createOptionModifier,
  getOptionModifiers,
  getOptionModifier,
  updateOptionModifier,
  deleteOptionModifier
}

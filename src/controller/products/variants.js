const ProductVariant = require('../../models/product/variant/index.js')
const Product = require('../../models/product')
const currencySymbol = require('currency-symbol-map')

const createProductVariant = async (req, res) => {
  const data = req.body.data
  const { type, name, options } = req.body.data
  const product_id = req.params.productId

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

  if (!options) {
    return res.status(401).send({
      message: 'Option array is required'
    })
  }

  if (options.some(val => !val.name)) {
    return res.status(401).send({
      message: 'Option name is required'
    })
  }

  if (options.some(val => !val.description)) {
    return res.status(401).send({
      message: 'Option description is required'
    })
  }

  if (options.some(val => isNaN(val.stock))) {
    return res.status(401).send({
      message: 'Stock is required'
    })
  }

  if (options.some(val => typeof val.stock !== 'number')) {
    return res.status(401).send({
      message: 'Stock requires a number'
    })
  }

  if (options.some(val => !val.price)) {
    return res.status(401).send({
      message: 'Price is required'
    })
  }

  if (options.some(val => !val.price) && options.some(val => typeof val.price !== 'object')) {
    return res.status(401).send({
      message: 'Price requires an object'
    })
  }

  if (options.some(val => isNaN(val.price.amount))) {
    return res.status(401).send({
      message: 'Price amount is required'
    })
  }

  if (options.some(val => !isNaN(val.price.amount)) && options.some(val => typeof val.price.amount !== 'number')) {
    return res.status(401).send({
      message: 'Price amount requires a number'
    })
  }

  if (options.some(val => !val.price.currency)) {
    return res.status(401).send({
      message: 'Price currency is required'
    })
  }

  if (options.some(val => !currencySymbol(val.price.currency))) {
    return res.status(401).send({
      message: 'Price currency is not a 3 letter ISO'
    })
  }

  try {
    const productVariant = new ProductVariant(data)

    const savedProductVariant = await productVariant.save()
    const product = await Product.findById(product_id)

    product.variants.push(savedProductVariant._id)
    product.save()

    res.status(201).send({ data: productVariant })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductVariants = async (req, res) => {
  try {
    const productVariants = await ProductVariant.findAllProductVariants()

    res.status(200).send({ data: productVariants })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductVariant = async (req, res) => {
  const productVariant = await ProductVariant.findOne({ _id: req.params.variantId })

  res.status(200).send({ data: productVariant })
}

const updateProductVariant = async (req, res) => {
  const variantId = req.params.variantId
  const productId = req.params.productId
  const currentProductVariantDetails = await ProductVariant.findOne({ variantId })
  const { type, name, options } = req.body.data

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

  if (!options) {
    return res.status(401).send({
      message: 'Option array is required'
    })
  }

  if (options.some(val => !val.name)) {
    return res.status(401).send({
      message: 'Option name is required'
    })
  }

  if (options.some(val => !val.description)) {
    return res.status(401).send({
      message: 'Option description is required'
    })
  }

  if (options.some(val => isNaN(val.stock))) {
    return res.status(401).send({
      message: 'Stock is required'
    })
  }

  if (options.some(val => typeof val.stock !== 'number')) {
    return res.status(401).send({
      message: 'Stock requires a number'
    })
  }

  if (options.some(val => !val.price)) {
    return res.status(401).send({
      message: 'Price is required'
    })
  }

  if (options.some(val => !val.price) && options.some(val => typeof val.price !== 'object')) {
    return res.status(401).send({
      message: 'Price requires an object'
    })
  }

  if (options.some(val => isNaN(val.price.amount))) {
    return res.status(401).send({
      message: 'Price amount is required'
    })
  }

  if (options.some(val => !isNaN(val.price.amount)) && options.some(val => typeof val.price.amount !== 'number')) {
    return res.status(401).send({
      message: 'Price amount requires a number'
    })
  }

  if (options.some(val => !val.price.currency)) {
    return res.status(401).send({
      message: 'Price currency is required'
    })
  }

  if (options.some(val => !currencySymbol(val.price.currency))) {
    return res.status(401).send({
      message: 'Price currency is not a 3 letter ISO'
    })
  }

  const data = {
    type,
    _id: variantId,
    name: name || currentProductVariantDetails.name,
    options: options.map((option, index) => {
      return {
        name: option.name,
        description: option.description,
        stock: option.stock,
        price: {
          amount: option.price.amount,
          currency: option.price.currency
        }
      }
    })
  }

  try {
    await ProductVariant.updateProductVariant(data)
    const product = await Product.findById(productId)

    product.updated_at = new Date()
    product.save()

    res.status(200).send({ data })
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteProductVariant = async (req, res) => {
  try {
    const productId = req.params.productId
    const variantId = req.params.variantId
    const product = await Product.findById(productId)

    await product.variants.pull(variantId)
    await product.save()
    await ProductVariant.deleteProductVariant(variantId)

    res.status(200).send({
      message: 'Product variant successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createProductVariant,
  getProductVariants,
  getProductVariant,
  updateProductVariant,
  deleteProductVariant
}

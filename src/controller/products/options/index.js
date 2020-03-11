const ProductOption = require('../../../models/product/option/index.js')
const Product = require('../../../models/product')
const currencySymbol = require('currency-symbol-map')

const createProductOption = async (req, res) => {
  const data = req.body
  const {
    type,
    display_name,
    option_values
  } = data
  const product_id = req.params.productId

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product-options') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (!display_name) {
    return res.status(401).send({
      message: 'Display name is required'
    })
  }

  if (!option_values) {
    return res.status(401).send({
      message: 'Option values is required'
    })
  }

  try {
    var productOption = new ProductOption({
      ...data,
      product_id
    })

    const savedProductOptions = await productOption.save()
    const product = await Product.findById(product_id)

    product.options.push(savedProductOptions._id)
    product.save()

    res.status(201).send({ data: savedProductOptions })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductOptions = async (req, res) => {
  try {
    const productId = req.params.productId
    const productOptions = await ProductOption.findAllProductOptions(productId)

    res.status(200).send({ data: productOptions })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductOption = async (req, res) => {
  const productId = req.params.productId
  const optionId = req.params.optionId
  const productOption = await ProductOption.findOption(productId, optionId)

  res.status(200).send(productOption)
}

const updateProductOption = async (req, res) => {
  const { type } = req.body

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product-options') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  try {
    await ProductOption.updateProductOption(req.body)

    res.status(200).send(req.body)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteProductOption = async (req, res) => {
  const productId = req.params.productId
  const optionId = req.params.optionId
  try {
    const product = await Product.findById(productId)
    await product.options.pull(optionId)
    await product.save()
    await ProductOption.deleteProductOption(productId, optionId)

    res.status(200).send({
      message: 'Product variant option successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createProductOption,
  getProductOptions,
  getProductOption,
  updateProductOption,
  deleteProductOption
}

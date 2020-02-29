const ProductVariantOption = require('../../../../models/product/variant/option/index.js')
const ProductVariant = require('../../../../models/product/variant/index.js')
const currencySymbol = require('currency-symbol-map')

const createProductVariantOption = async (req, res) => {
  const data = req.body.data
  const { type, name, stock, price } = data
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

  if (isNaN(stock)) {
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

  if (!price && typeof price !== 'object') {
    return res.status(401).send({
      message: 'Price requires an object'
    })
  }

  if (isNaN(price.amount)) {
    return res.status(401).send({
      message: 'Price amount is required'
    })
  }

  if (!isNaN(price.amount) && typeof price.amount !== 'number') {
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
    const productVariantOption = new ProductVariantOption({ ...data, variant_id })

    const savedProductVariantOption = await productVariantOption.save()
    const productVariant = await ProductVariant.findById(variant_id)

    productVariant.options.push(savedProductVariantOption._id)
    productVariant.save()

    res.status(201).send(productVariantOption)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductVariantOptions = async (req, res) => {
  try {
    const variantId = req.params.variantId
    const productVariants = await ProductVariantOption.findAllProductVariantOptions(variantId)

    res.status(200).send(productVariants)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductVariantOption = async (req, res) => {
  const variantId = req.params.variantId
  const optionId = req.params.optionId
  const productVariant = await ProductVariantOption.findOne({ _id: optionId, variant_id: variantId })

  res.status(200).send(productVariant)
}

const updateProductVariantOption = async (req, res) => {
  const variantId = req.params.variantId
  const optionId = req.params.optionId
  const currentProductVariantOptionDetails = await ProductVariantOption.findOne({ _id: optionId, variant_id: variantId })
  const { type, name, stock, price } = req.body.data

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

  if (isNaN(stock)) {
    return res.status(401).send({
      message: 'Stock is required'
    })
  }

  if (typeof stock !== 'number') {
    return res.status(401).send({
      message: 'Stock requires a number'
    })
  }

  if (price && typeof price !== 'object') {
    return res.status(401).send({
      message: 'Price requires an object'
    })
  }

  if (price && isNaN(price.amount)) {
    return res.status(401).send({
      message: 'Price amount is required'
    })
  }

  if (price && !isNaN(price.amount) && typeof price.amount !== 'number') {
    return res.status(401).send({
      message: 'Price amount requires a number'
    })
  }

  if (price && !currencySymbol(price.currency)) {
    return res.status(401).send({
      message: 'Price currency is not a 3 letter ISO'
    })
  }

  const data = {
    type,
    _id: optionId,
    name: name || currentProductVariantOptionDetails.name,
    stock: stock || currentProductVariantOptionDetails.stock,
    price: {
      amount: (price && !isNaN(price.amount)) ? price.amount : currentProductVariantOptionDetails.price.amount,
      currency: (price && price.currency) ? price.currency : currentProductVariantOptionDetails.price.currency
    }
  }

  try {
    await ProductVariantOption.updateProductVariantOption(data)

    res.status(200).send(data)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteProductVariantOption = async (req, res) => {
  try {
    const optionId = req.params.optionId
    const variantId = req.params.variantId
    const productVariant = await ProductVariant.findOne({ _id: variantId })
    await productVariant.options.pull(optionId)
    await productVariant.save()
    await ProductVariantOption.deleteProductVariantOption(optionId)

    res.status(200).send({
      message: 'Product variant option successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createProductVariantOption,
  getProductVariantOptions,
  getProductVariantOption,
  updateProductVariantOption,
  deleteProductVariantOption
}

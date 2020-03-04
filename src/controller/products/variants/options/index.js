const ProductVariantOption = require('../../../../models/product/variant/option/index.js')
const Product = require('../../../../models/product')
const currencySymbol = require('currency-symbol-map')

function updateName (current, option1, option2, option3) {
  const opt1 = option1 || current.option1
  const opt2 = option2 === '' ? null : option2 || current.option2
  const opt3 = option3 === '' ? null : option3 || current.option3

  return [opt1, opt2, opt3].filter(Boolean).join(' / ')
}

const createProductVariantOption = async (req, res) => {
  const data = req.body
  const {
    type,
    option1,
    option2,
    option3,
    stock,
    price
  } = data
  const product_id = req.params.productId

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product-variant-options') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (!option1) {
    return res.status(401).send({
      message: 'Option 1 is required'
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
    var productVariantOption = new ProductVariantOption({
      ...data,
      name: [option1, option2, option3].slice(0, -1).join(' / '),
      product_id
    })

    const savedProductVariantOptions = await productVariantOption.save()
    const product = await Product.findById(product_id)

    product.variant_options.push(savedProductVariantOptions._id)
    product.save()

    res.status(201).send(productVariantOption)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductVariantOptions = async (req, res) => {
  try {
    const productId = req.params.productId
    const productVariants = await ProductVariantOption.findAllProductVariantOptions(productId)

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
  const {
    type,
    stock,
    price,
    option1,
    option2,
    option3
  } = req.body

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product-variant-options') {
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
    name: updateName(currentProductVariantOptionDetails, option1, option2, option3),
    option1: option1 || currentProductVariantOptionDetails.option1,
    option2: option2 === '' ? null : option2 || currentProductVariantOptionDetails.option2,
    option3: option3 === '' ? null : option3 || currentProductVariantOptionDetails.option3,
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
  const productId = req.params.productId
  try {
    const optionId = req.params.optionId
    const product = await Product.findById(productId)
    await product.variant_options.pull(optionId)
    await product.save()
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

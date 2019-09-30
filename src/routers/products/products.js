const express = require('express')
const Product = require('../../models/product/Product')
const auth = require('../../middleware/auth')
const currencySymbol = require('currency-symbol-map')
const router = express.Router()

// Create a new Product
router.post('/products', auth, async (req, res) => {
  const { type, name, slug, sku, stock, description, price, commodity_type } = req.body

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (!name) {
    return res.status(401).send({
      message: 'Name is required'
    })
  }

  if (!slug) {
    return res.status(401).send({
      message: 'Slug is required'
    })
  }

  if (!sku) {
    return res.status(401).send({
      message: 'SKU is required'
    })
  }

  if (!stock) {
    return res.status(401).send({
      message: 'Stock is required'
    })
  }

  if (!description) {
    return res.status(401).send({
      message: 'Description is required'
    })
  }

  if (!price) {
    return res.status(401).send({
      message: 'Price is required'
    })
  }

  if (!price.amount) {
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

  if (!commodity_type) {
    return res.status(401).send({
      message: 'Commodity Type is required'
    })
  }

  if (commodity_type !== 'physical' && commodity_type !== 'digital') {
    return res.status(401).send({
      message: 'Commodity Type should be either physical or digital types'
    })
  }

  try {
    const products = new Product({ ...req.body, customer_id: req.params.customerId })

    await products.save()

    res.status(201).send(products)
  } catch (err) {
    res.status(400).send(err)
  }
})

// Get all products
router.get('/products', auth, async (req, res) => {
  try {
    const products = await Product.findAllProducts()

    res.status(200).send(products)
  } catch (err) {
    res.status(400).send(err)
  }
})

// Get product
router.get('/products/:productId', auth, async (req, res) => {
  const product = await Product.findOne({ _id: req.params.productId })

  res.status(200).send(product)
})

// Update product
router.put('/products/:productId', auth, async (req, res) => {
  const _id = req.params.productId
  const currentProductDetails = await Product.findOne({ _id })
  const { type, name, slug, sku, stock, description, price, commodity_type } = req.body

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (price && !price.amount) {
    return res.status(401).send({
      message: 'Price amount is required'
    })
  }

  if (price && typeof price.amount !== 'number') {
    return res.status(401).send({
      message: 'Price amount requires a number'
    })
  }

  if ((price && price.currency) && !currencySymbol(price.currency)) {
    return res.status(401).send({
      message: 'Price currency is not a 3 letter ISO'
    })
  }

  if (commodity_type && (commodity_type !== 'physical' && commodity_type !== 'digital')) {
    return res.status(401).send({
      message: 'Commodity Type should be either physical or digital types'
    })
  }

  const data = {
    type,
    _id,
    name: name || currentProductDetails.name,
    slug: slug || currentProductDetails.slug,
    sku: sku || currentProductDetails.sku,
    stock: stock || currentProductDetails.stock,
    description: description || currentProductDetails.description,
    price: price || currentProductDetails.price,
    commodity_type: commodity_type || currentProductDetails.commodity_type
  }

  try {
    const product = await Product.updateProduct(data)

    res.status(200).send(product)
  } catch (err) {
    res.status(400).send(err)
  }
})

// Delete product
router.delete('/products/:productId', auth, async (req, res) => {
  try {
    await Product.deleteProduct(req.params.productId)

    res.status(200).send({
      message: 'Product successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router

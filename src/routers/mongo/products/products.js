const express = require('express')
const Product = require('../../../models/product')
const auth = require('../../../middleware/auth')
const currencySymbol = require('currency-symbol-map')
const errorHandler = require('../../../utils/errorHandler')
const router = express.Router()

// Create a new Product
router.post('/products', auth, async (req, res) => {
  const customer_id = req.params.customerId
  const data = req.body.data
  const { type, name, slug, sku, stock, status, description, price, commodity_type } = data

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

  if (status && (status !== 'draft' || status !== 'live')) {
    return res.status(401).send({
      message: 'Status must be either `draft` or `live`'
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
    const products = new Product({ ...data, customer_id })

    await products.save()

    res.status(201).send({ data: products })
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
})

// Get all products
router.get('/products', auth, async (req, res) => {
  try {
    const query = req.query.query
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    let products

    if (query) {
      products = await Product.search({ page, query })
    } else {
      products = await Product.findAllProducts({ page, limit })
    }
    res.status(200).send({ data: products.data, meta: products.meta })
  } catch (err) {
    res.status(400).send(err)
  }
})

// Get product
router.get('/products/:productId', auth, async (req, res) => {
  const _id = req.params.productId
  const product = await Product.findOne({ _id }).populate('relationships.categories')

  res.status(200).send({ data: product })
})

// Update product
router.put('/products/:productId', auth, async (req, res) => {
  const _id = req.params.productId
  const currentProductDetails = await Product.findOne({ _id })
  const data = req.body.data
  const { type, name, slug, sku, stock, status, description, price, commodity_type, updated_at, created_at } = data

  if (status && (status !== 'draft' || status !== 'live')) {
    return res.status(401).send({
      message: 'Status must be either `draft` or `live`'
    })
  }

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

  try {
    const product = await Product.updateProduct({
      type,
      _id,
      name: name || currentProductDetails.name,
      slug: slug || currentProductDetails.slug,
      sku: sku || currentProductDetails.sku,
      stock: stock || currentProductDetails.stock,
      status: status || currentProductDetails.status,
      description: description || currentProductDetails.description,
      price: price || currentProductDetails.price,
      commodity_type: commodity_type || currentProductDetails.commodity_type,
      updated_at: updated_at || currentProductDetails.updated_at,
      created_at: created_at || currentProductDetails.created_at
    })

    res.status(200).send({ data: product })
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

const express = require('express')
const Product = require('../models/Product')
const auth = require('../middleware/auth')
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

  if (!Array.isArray(price)) {
    return res.status(401).send({
      message: 'Price is required'
    })
  }

  if (price.some(p => typeof p.amount !== 'number')) {
    return res.status(401).send({
      message: 'Price amount is required'
    })
  }

  if (price.some(p => typeof p.currency !== 'string')) {
    return res.status(401).send({
      message: 'Price currency is required'
    })
  }

  if (price.some(p => p.currency.length > 3)) {
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

module.exports = router

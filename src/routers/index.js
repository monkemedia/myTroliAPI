const { Router } = require('express')
const client = require('./client.js')
const customers = require('./customers.js')
const addresses = require('./addresses.js')
const products = require('./products/products.js')
const promotions = require('./promotions.js')
const productsCategoryRelationships = require('./products/relationships/category.js')
const categories = require('./categories.js')

const router = Router()

router.use(
  client,
  customers,
  addresses,
  products,
  promotions,
  categories,
  productsCategoryRelationships
)

module.exports = router

const { Router } = require('express')
const client = require('./client.js')
const customers = require('./customers.js')
const addresses = require('./addresses.js')
const products = require('./products/index.js')
const promotions = require('./promotions.js')
const categories = require('./categories.js')
const productsCategoryRelationships = require('./products/relationships/categories.js')
const productsFileRelationships = require('./products/relationships/files.js')

const router = Router()

router.use(
  client,
  customers,
  addresses,
  products,
  promotions,
  categories,
  productsCategoryRelationships,
  productsFileRelationships
)

module.exports = router

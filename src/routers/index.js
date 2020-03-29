const { Router } = require('express')
const client = require('./client.js')
const customers = require('./customers/index.js')
const customerAddresses = require('./customers/addresses/index.js')
const products = require('./products/index.js')
const promotions = require('./promotions.js')
const categories = require('./categories.js')
const variations = require('./variations.js')
const productVariants = require('./products/variants/index.js')
const productOptions = require('./products/options/index.js')
const productCategories = require('./products/categories/index.js')

const router = Router()

router.use(
  client,
  customers,
  customerAddresses,
  products,
  promotions,
  categories,
  variations,
  productVariants,
  productOptions,
  productCategories
)

module.exports = router

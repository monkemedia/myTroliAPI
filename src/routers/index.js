const { Router } = require('express')
const client = require('./client.js')
const customers = require('./customers.js')
const addresses = require('./addresses.js')
const products = require('./products/index.js')
const promotions = require('./promotions.js')
const categories = require('./categories.js')
const variations = require('./variations.js')
const productsVariants = require('./products/variants/index.js')
const productsVariantOptions = require('./products/variants/options/index.js')
const productCategories = require('./products/categories/index.js')
const productsFileRelationships = require('./products/relationships/files.js')

const router = Router()

router.use(
  client,
  customers,
  addresses,
  products,
  promotions,
  categories,
  variations,
  productsVariants,
  productsVariantOptions,
  productCategories,
  productsFileRelationships
)

module.exports = router

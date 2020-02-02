const { Router } = require('express')
const client = require('./client.js')
const customers = require('./customers.js')
const addresses = require('./addresses.js')
const products = require('./products/index.js')
const promotions = require('./promotions.js')
const categories = require('./categories.js')
const variants = require('./variants/index.js')
const variantOptions = require('./variants/options/index.js')
const OptionModifiers = require('./variants/modifiers/index.js')
const productsCategoryRelationships = require('./products/relationships/categories.js')
const productsVariantRelationships = require('./products/relationships/variants.js')
const productsFileRelationships = require('./products/relationships/files.js')

const router = Router()

router.use(
  client,
  customers,
  addresses,
  products,
  promotions,
  categories,
  variants,
  variantOptions,
  OptionModifiers,
  productsCategoryRelationships,
  productsVariantRelationships,
  productsFileRelationships
)

module.exports = router

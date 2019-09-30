const { Router } = require('express')
const client = require('./client.js')
const customers = require('./customers.js')
const addresses = require('./addresses.js')
const products = require('./products.js')
const router = Router()

router.use(
  client,
  customers,
  addresses,
  products
)

module.exports = router

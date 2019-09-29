const { Router } = require('express')
const customers = require('./customers.js')
const addresses = require('./addresses.js')
const router = Router()

router.use(
  customers,
  addresses
)

module.exports = router

const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getStoreRevenue
} = require('../controller/performance')

// Get Store Revenue
router.get('/performance/store-revenue', auth, (req, res) => getStoreRevenue(req, res))

module.exports = router

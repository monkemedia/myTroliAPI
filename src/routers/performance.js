const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getStoreRevenue,
  getStorePerformance
} = require('../controller/performance')

// Store performance
router.get('/:storeHash/performance', auth, (req, res) => getStorePerformance(req, res))
// Get Store Revenue
router.get('/:storeHash/performance/store-revenue', auth, (req, res) => getStoreRevenue(req, res))


module.exports = router

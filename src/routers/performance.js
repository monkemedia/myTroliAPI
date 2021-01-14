const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { getStorePerformance } = require('../controller/performance')

// Store performance
router.get('/:storeHash/performance', auth, (req, res) => getStorePerformance(req, res))

module.exports = router

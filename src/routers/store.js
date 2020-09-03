const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getStore,
  updateStore
} = require('../controller/store')

// Get store
router.get('/:storeHash/store', auth, (req, res) => getStore(req, res))
// Update store
router.put('/:storeHash/store', auth, (req, res) => updateStore(req, res))

module.exports = router

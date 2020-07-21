const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getStore,
  updateStore
} = require('../controller/store')

// Get store
router.get('/store', auth, (req, res) => getStore(req, res))
// Update store
router.put('/store', auth, (req, res) => updateStore(req, res))

module.exports = router

const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  createStore,
  getStore,
  updateStore,
  deleteStore
} = require('../controller/store')

// Create store
router.post('/store', (req, res) => createStore(req, res))
// Get store
router.get('/store/:storeId', auth, (req, res) => getStore(req, res))
// Update store
router.put('/store/:storeId', auth, (req, res) => updateStore(req, res))
// Delete store
router.delete('/store/:storeId', auth, (req, res) => deleteStore(req, res))

module.exports = router

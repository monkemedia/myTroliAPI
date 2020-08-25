const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  createVariation,
  getVariations,
  getVariation,
  updateVariation,
  deleteVariation
} = require('../controller/variations.js')

// Create variation
router.post('/:storeHash/variations', auth, (req, res) => createVariation(req, res))
// Get variations
router.get('/:storeHash/variations', auth, (req, res) => getVariations(req, res))
// Get variation
router.get('/:storeHash/variations/:variationId', auth, (req, res) => getVariation(req, res))
// Update variation
router.put('/:storeHash/variations/:variationId', auth, (req, res) => updateVariation(req, res))
// Delete variation
router.delete('/:storeHash/variations/:variationId', auth, (req, res) => deleteVariation(req, res))

module.exports = router

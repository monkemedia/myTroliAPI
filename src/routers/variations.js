const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { createVariation, getVariations, getVariation, updateVariation, deleteVariation } = require('../controller/variations.js')

// Create a new variation
router.post('/variations', auth, (req, res) => createVariation(req, res))
// Get all variation
router.get('/variations', auth, (req, res) => getVariations(req, res))
// Get variation
router.get('/variations/:variationId', auth, (req, res) => getVariation(req, res))
// Update variation
router.put('/variations/:variationId', auth, (req, res) => updateVariation(req, res))
// Delete variation
router.delete('/variations/:variationId', auth, (req, res) => deleteVariation(req, res))

module.exports = router

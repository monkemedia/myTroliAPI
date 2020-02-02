const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { createVariant, getVariants, getVariant, updateVariant, deleteVariant } = require('../../controller/variants/index.js')

// Create a new variant
router.post('/variants', auth, (req, res) => createVariant(req, res))
// Get all variants
router.get('/variants', auth, (req, res) => getVariants(req, res))
// Get variant
router.get('/variants/:variantId', auth, (req, res) => getVariant(req, res))
// Update variant
router.put('/variants/:variantId', auth, (req, res) => updateVariant(req, res))
// Delete variant
router.delete('/variants/:variantId', auth, (req, res) => deleteVariant(req, res))

module.exports = router

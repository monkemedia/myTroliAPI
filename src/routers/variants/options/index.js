const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const { createVariantOption, getVariantOptions, getVariantOption, updateVariantOption, deleteVariantOption } = require('../../../controller/variants/options/index.js')

// Create a new option
router.post('/variants/:variantId/options', auth, (req, res) => createVariantOption(req, res))
// Get all options
router.get('/variants/:variantId/options', auth, (req, res) => getVariantOptions(req, res))
// Get option
router.get('/variants/:variantId/options/:optionId', auth, (req, res) => getVariantOption(req, res))
// Update option
router.put('/variants/:variantId/options/:optionId', auth, (req, res) => updateVariantOption(req, res))
// Delete option
router.delete('/variants/:variantId/options/:optionId', auth, (req, res) => deleteVariantOption(req, res))

module.exports = router

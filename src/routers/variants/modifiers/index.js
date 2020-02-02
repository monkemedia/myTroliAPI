const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const { createOptionModifier, getOptionModifiers, getOptionModifier, updateOptionModifier, deleteOptionModifier } = require('../../../controller/variants/modifiers/index.js')

// Create a new option
router.post('/variants/:variantId/options/:optionId/modifiers', auth, (req, res) => createOptionModifier(req, res))
// Get all options
router.get('/variants/:variantId/options/:optionId/modifiers', auth, (req, res) => getOptionModifiers(req, res))
// Get option
router.get('/variants/:variantId/options/:optionId/modifiers/:modifierId', auth, (req, res) => getOptionModifier(req, res))
// Update option
router.put('/variants/:variantId/options/:optionId/modifiers/:modifierId', auth, (req, res) => updateOptionModifier(req, res))
// Delete option
router.delete('/variants/:variantId/options/:optionId/modifiers/:modifierId', auth, (req, res) => deleteOptionModifier(req, res))

module.exports = router

const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { createPromotion, getPromotions, getPromotion, updatePromotion, deletePromotion } = require('../../controller/promotion')

// Create a new Promotion
router.post('/promotions', auth, async (req, res) => createPromotion(req, res))
// Get all promotions
router.get('/promotions', auth, async (req, res) => getPromotions(req, res))
// Get promotion
router.get('/promotions/:promotionId', auth, async (req, res) => getPromotion(req, res))
// Update promotion
router.put('/promotions/:promotionId', auth, async (req, res) => updatePromotion(req, res))
// Delete promotion
router.delete('/promotions/:promotionId', auth, async (req, res) => deletePromotion(req, res))

module.exports = router

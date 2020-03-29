const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  createPromotion,
  getPromotions,
  getPromotion,
  updatePromotion,
  deletePromotion
} = require('../controller/promotion')

// Create promotion
router.post('/promotions', auth, (req, res) => createPromotion(req, res))
// Get promotions
router.get('/promotions', auth, (req, res) => getPromotions(req, res))
// Get promotion
router.get('/promotions/:promotionId', auth, (req, res) => getPromotion(req, res))
// Update promotion
router.put('/promotions/:promotionId', auth, (req, res) => updatePromotion(req, res))
// Delete promotion
router.delete('/promotions/:promotionId', auth, (req, res) => deletePromotion(req, res))

module.exports = router

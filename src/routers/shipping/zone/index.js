const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const {
  createShippingZone,
  getShippingZones,
  getShippingZone,
  updateShippingZone,
  deleteShippingZone
} = require('../../../controller/shipping/zone')

// Create shipping zone
router.post('/shipping/zone', auth, (req, res) => createShippingZone(req, res))
// Get shipping zones
router.get('/shipping/zone', auth, (req, res) => getShippingZones(req, res))
// Get shipping zone
router.get('/shipping/zone/:zoneId', auth, (req, res) => getShippingZone(req, res))
// Update shipping zone
router.put('/shipping/zone/:zoneId', auth, (req, res) => updateShippingZone(req, res))
// Delete shipping zone
router.delete('/shipping/zone/:zoneId', auth, (req, res) => deleteShippingZone(req, res))

module.exports = router

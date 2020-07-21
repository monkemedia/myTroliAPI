const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getSettings,
  updateSettings
} = require('../controller/settings')

// Get settings
router.get('/settings', auth, (req, res) => getSettings(req, res))
// Update settings
router.put('/settings', auth, (req, res) => updateSettings(req, res))

module.exports = router

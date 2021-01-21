const express = require('express')
const cors = require('cors')
const router = express.Router()
const {
  refreshToken,
  accessToken,
  resetToken,
  resetPassword
} = require('../controller/oauth')

// Get access token from refresh token
router.post('/refresh-token', (req, res) => refreshToken(req, res))
// Get access token when user logins in
router.post('/access-token', cors(), (req, res) => accessToken(req, res))
// Send reset token to merchants email
router.post('/reset-token', (req, res) => resetToken(req, res))
// Reset password
router.put('/reset-password', (req, res) => resetPassword(req, res))

module.exports = router

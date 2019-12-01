const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Client = require('../models/Client')
const emailTemplate = require('../utils/emailTemplate')

// Get access token from refresh token
router.post('/refresh_token', async (req, res) => {
  try {
    const { grant_type, refresh_token } = req.body

    if (!grant_type) {
      return res.status(401).send({
        message: 'Grant Type is required'
      })
    }

    if (grant_type && grant_type !== 'refresh_token') {
      return res.status(401).send({
        message: 'Correct Grant Type is required'
      })
    }

    if (!refresh_token) {
      return res.status(401).send({
        message: 'Refresh Token is required'
      })
    }

    const client = await Client.findByRefreshToken(refresh_token)

    if (client === null) {
      return res.status(401).send({
        message: 'Client doesn\'t exist'
      })
    }

    if (client.refresh_token !== refresh_token) {
      return res.status(401).send({
        message: 'Not authorized'
      })
    }

    try {
      jwt.verify(client.refresh_token, process.env.API_SECRET)

      const accessToken = await client.generateToken()
      const refreshToken = await client.generateToken('48hrs')

      client.refresh_token = refreshToken
      await client.save()

      res.status(200).send({
        access_token: accessToken,
        refresh_token: refreshToken
      })
    } catch (err) {
      if (err.message === 'jwt expired') {
        return res.status(401).send({
          message: 'Refresh Token has expired'
        })
      }

      res.status(err.status).send(err)
    }
  } catch (err) {
    res.status(err.status).send(err)
  }
})

// Get access token when user logins in
router.post('/login', async (req, res) => {
  try {
    const { grant_type, client_secret, email, password } = req.body

    if (!email) {
      return res.status(401).send({
        message: 'Email is required'
      })
    }

    if (!password) {
      return res.status(401).send({
        message: 'Password is required'
      })
    }

    if (!client_secret) {
      return res.status(401).send({
        message: 'Client Secret is required'
      })
    }

    if (!client_secret && client_secret !== process.env.CLIENT_SECRET) {
      return res.status(401).send({
        message: 'Correct Client Secret is required'
      })
    }

    if (!grant_type) {
      return res.status(401).send({
        message: 'Grant Type is required'
      })
    }

    if (grant_type && grant_type !== 'client_credentials') {
      return res.status(401).send({
        message: 'Correct Grant Type is required'
      })
    }

    const client = await Client.findByCredentials(email, password)
    const accessToken = await client.generateToken()
    const refreshToken = await client.generateToken('48hrs')

    client.refresh_token = refreshToken
    await client.save()

    res.status(200).send({
      grant_type: 'client_credentials',
      client_id: client._id,
      access_token: accessToken,
      refresh_token: refreshToken
    })
  } catch (err) {
    res.status(err.status).send(err)
  }
})

// Send reset token to clients email
router.post('/reset-token', async (req, res) => {
  try {
    const { grant_type, email } = req.body

    if (!email) {
      return res.status(401).send({
        message: 'Email is required'
      })
    }

    if (!grant_type) {
      return res.status(401).send({
        message: 'Grant Type is required'
      })
    }

    if (grant_type && grant_type !== 'reset_token') {
      return res.status(401).send({
        message: 'Correct Grant Type is required'
      })
    }

    const client = await Client.findByEmail(email)

    if (!client) {
      // customer doesn't exist but we can't tell users that
      return res.status(200).send({
        message: 'Reset email is on it\'s way'
      })
    }

    const resetToken = await client.generateToken('1hr')

    client.reset_token = resetToken
    await client.save()

    emailTemplate.forgottenPasswordEmail({
      email,
      resetToken
    })

    res.status(200).send({
      grant_type: 'reset_token',
      reset_token: resetToken
    })
  } catch (err) {
    res.status(err.status).send(err)
  }
})

// Reset password
router.put('/reset-password', async (req, res) => {
  try {
    const { grant_type, password, reset_token } = req.body

    if (!password) {
      return res.status(401).send({
        message: 'Password is required'
      })
    }

    if (!reset_token) {
      return res.status(401).send({
        message: 'Reset Token is required'
      })
    }

    if (!grant_type) {
      return res.status(401).send({
        message: 'Grant Type is required'
      })
    }

    if (grant_type && grant_type !== 'reset_password') {
      return res.status(401).send({
        message: 'Correct Grant Type is required'
      })
    }

    try {
      jwt.verify(reset_token, process.env.API_SECRET)

      const client = await Client.findByResetToken(reset_token)

      if (!client) {
        // customer doesn't exist but we can't tell users that
        return res.status(401).send({
          message: 'Client does\'t exist'
        })
      }

      await Client.updatePassword({ _id: client._id, password })

      res.status(200).send({
        message: 'Password has been updated'
      })
    } catch (err) {
      if (err.message === 'jwt expired') {
        return res.status(401).send({
          message: 'Token has expired'
        })
      }
      return res.status(401).send({
        message: 'Token is incorrect'
      })
    }
  } catch (err) {
    res.status(err.status).send(err)
  }
})

module.exports = router

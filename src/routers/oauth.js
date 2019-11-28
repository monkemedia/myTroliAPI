const express = require('express')
const jwt = require('jsonwebtoken')
const Client = require('../models/Client')
const router = express.Router()

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

      const accessToken = await client.generateAccessToken()
      const refreshToken = await client.generateRefreshToken()

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
    const accessToken = await client.generateAccessToken()
    const refreshToken = await client.generateRefreshToken()

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

module.exports = router

const express = require('express')
const Client = require('../models/Client')
const router = express.Router()

// Create client
router.post('/', async (req, res) => {
  const { email, password } = req.body
  const grantType = req.body.grant_type

  if (!grantType) {
    return res.status(401).send({
      message: 'Grant Type is required'
    })
  }

  if (grantType && grantType !== 'client_credentials') {
    return res.status(401).send({
      message: 'Correct Grant Type is required'
    })
  }

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

  try {
    const client = new Client(req.body)
    await client.save()

    const { _id } = client

    const clientCopy = Object.assign(req.body, {
      password: !!password,
      _id
    })

    res.status(201).send(clientCopy)
  } catch (err) {
    res.status(err.status).send(err)
  }
})

// Get token
router.post('/access_token', async (req, res) => {
  try {
    const { email, password } = req.body
    const grantType = req.body.grant_type

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

    if (!grantType) {
      return res.status(401).send({
        message: 'Grant Type is required'
      })
    }

    if (grantType && grantType !== 'client_credentials') {
      return res.status(401).send({
        message: 'Correct Grant Type is required'
      })
    }

    const client = await Client.findByCredentials(email, password)
    const accessToken = await client.generateAccessToken()

    res.send({
      grant_type: 'client_credentials',
      client_id: client._id,
      access_token: accessToken
    })
  } catch (err) {
    res.status(err.status).send(err)
  }
})

module.exports = router

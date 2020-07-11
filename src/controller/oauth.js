const jwt = require('jsonwebtoken')
const Client = require('../models/client')
const emailTemplate = require('../utils/emailTemplate')

const accessTokenTime = '24hr'
const refreshTokenTime = '48hr'

const refreshToken = async (req, res) => {
  try {
    const { type, refresh_token } = req.body

    if (!type) {
      return res.status(401).send({
        message: 'Type is required'
      })
    }

    if (type !== 'refresh_token') {
      return res.status(401).send({
        message: 'Correct Type is required'
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

      const accessToken = await client.generateToken(accessTokenTime)
      const refreshToken = await client.generateToken(refreshTokenTime)

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
}

const login = async (req, res) => {
  try {
    const { type, client_secret, email, password } = req.body

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

    if (!type) {
      return res.status(401).send({
        message: 'Type is required'
      })
    }

    if (type !== 'client_credentials') {
      return res.status(401).send({
        message: 'Correct Type is required'
      })
    }

    const client = await Client.findByCredentials(email, password)
    const accessToken = await client.generateToken(accessTokenTime)
    const refreshToken = await client.generateToken(refreshTokenTime)

    client.refresh_token = refreshToken
    await client.save()

    res.status(200).send({
      type: 'client_credentials',
      client_id: client._id,
      access_token: accessToken,
      refresh_token: refreshToken
    })
  } catch (err) {
    console.log('ERROR', err)
    res.status(err.status).send(err)
  }
}

const resetToken = async (req, res) => {
  try {
    const { type, email } = req.body

    if (!email) {
      return res.status(401).send({
        message: 'Email is required'
      })
    }

    if (!type) {
      return res.status(401).send({
        message: 'Type is required'
      })
    }

    if (type !== 'reset_token') {
      return res.status(401).send({
        message: 'Correct Type is required'
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
      type: 'reset_token',
      reset_token: resetToken
    })
  } catch (err) {
    res.status(err.status).send(err)
  }
}

const resetPassword = async (req, res) => {
  try {
    const { type, password, reset_token } = req.body

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

    if (!type) {
      return res.status(401).send({
        message: 'Type is required'
      })
    }

    if (type !== 'reset_password') {
      return res.status(401).send({
        message: 'Correct Type is required'
      })
    }

    try {
      jwt.verify(reset_token, process.env.API_SECRET)

      const client = await Client.findByResetToken(reset_token)

      if (!client) {
        // customer doesn't exist but we can't tell users that
        return res.status(401).send({
          message: 'Client does not exist'
        })
      }

      await Client.updateClientWithPassword(client._id, password)

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
}

module.exports = {
  refreshToken,
  login,
  resetToken,
  resetPassword
}

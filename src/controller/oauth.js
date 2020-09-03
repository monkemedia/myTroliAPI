const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Merchant = require('../models/merchant')
const emailTemplate = require('../utils/emailTemplate')
const errorHandler = require('../utils/errorHandler')

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
        message: 'Correct type is required'
      })
    }

    if (!refresh_token) {
      return res.status(401).send({
        message: 'Refresh Token is required'
      })
    }

    const merchant = await Merchant.findByRefreshToken(refresh_token)

    if (merchant === null) {
      return res.status(401).send({
        message: 'Merchant doesn\'t exist'
      })
    }

    if (merchant.refresh_token !== refresh_token) {
      return res.status(401).send({
        message: 'Not authorized'
      })
    }

    try {
      jwt.verify(merchant.refresh_token, process.env.API_SECRET)

      const accessToken = await merchant.generateToken(accessTokenTime)
      const refreshToken = await merchant.generateToken(refreshTokenTime)

      merchant.refresh_token = refreshToken
      await merchant.save()

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

const accessToken = async (req, res) => {
  try {
    const { type, email, password } = req.body

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

    if (!type) {
      return res.status(401).send({
        message: 'Type is required'
      })
    }

    if (type !== 'merchant_credentials') {
      return res.status(401).send({
        message: 'Correct type is required'
      })
    }

    const merchant = await Merchant.findByEmailAddress(email)

    if (!merchant) {
      return res.status(401).send(errorHandler(401, 'Sorry, we can’t find an account with this email.'))
    }

    if (!bcrypt.compareSync(password, merchant.password)) {
      return res.status(401).send(errorHandler(401, 'Sorry, the password is not right for this account.'))
    }

    const accessToken = await merchant.generateToken(accessTokenTime)
    const refreshToken = await merchant.generateToken(refreshTokenTime)

    merchant.refresh_token = refreshToken

    await merchant.save()

    res.status(200).send({
      type: 'merchant_credentials',
      expires_in: 3600,
      access_token: accessToken,
      merchant_id: merchant._id,
      store_hash: merchant.store_hash,
      token_type: 'Bearer',
      refresh_token: refreshToken
    })
  } catch (err) {
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
        message: 'Correct type is required'
      })
    }

    const merchant = await Merchant.findByEmailAddress(email)

    if (!merchant) {
      // customer doesn't exist but we can't tell users that
      return res.status(200).send({
        message: 'Reset email is on it\'s way'
      })
    }

    const resetToken = await merchant.generateToken('1hr')

    merchant.reset_token = resetToken
    await merchant.save()

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
        message: 'Correct type is required'
      })
    }

    try {
      jwt.verify(reset_token, process.env.API_SECRET)

      const merchant = await Merchant.findByResetToken(reset_token)

      if (!merchant) {
        // customer doesn't exist but we can't tell users that
        return res.status(401).send({
          message: 'Merchant does not exist'
        })
      }

      await Merchant.updateMerchantWithPassword(merchant._id, password)

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
  accessToken,
  resetToken,
  resetPassword
}

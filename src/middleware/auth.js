const jwt = require('jsonwebtoken')
const errorHandler = require('../utils/errorHandler')
const Merchant = require('../models/merchant')


const auth = async (req, res, next) => {
  let token = req.header('Authorization')
  const tokenString = token.split(' ')[1]

  if (!token || tokenString === 'undefined' || !tokenString) {
    return res.status(401).send(errorHandler(401, 'Token is required'))
  }

  token = token.replace('Bearer ', '')

  try {
    const decodedToken = jwt.verify(token, process.env.API_SECRET)
    // Now see if the merchant contains the correct store hash
    const storeHash = req.params.storeHash
    const merchantId = decodedToken.merchant_id
    const merchant = await Merchant.findById(merchantId)

    if (merchant.store_hash !== storeHash) {
      return res.status(401).send(errorHandler(401, 'Store hash is not validated'))
    }

    next()

  } catch (err) {
    if (err.message === 'jwt expired') {
      return res.status(401).send(errorHandler(401, 'Token has expired'))
    }

    if (err.message === 'jwt malformed') {
      return res.status(401).send(errorHandler(401, 'Token has expired'))
    }


    return res.status(err.status).send(errorHandler(err.status, err.meesage))
  }
}

module.exports = auth

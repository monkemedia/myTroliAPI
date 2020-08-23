const jwt = require('jsonwebtoken')
const errorHandler = require('../utils/errorHandler')
const Client = require('../models/client')


const auth = async (req, res, next) => {
  let token = req.header('Authorization')
  const tokenString = token.split(' ')[1]

  if (!token || tokenString === 'undefined' || !tokenString) {
    return res.status(401).send(errorHandler(401, 'Token is required'))
  }

  token = token.replace('Bearer ', '')

  try {
    const decodedToken = jwt.verify(token, process.env.API_SECRET)
    // Now see if the client contains the correct store hash
    const storeHash = req.params.storeHash
    const clientId = decodedToken.client_id
    const client = await Client.findById(clientId)

    if (client.store_hash !== storeHash) {
      return res.status(401).send(errorHandler(401, 'Store hash is not validated'))
    }

    next()

  } catch (err) {
    if (err.message === 'jwt expired') {
      return res.status(401).send(errorHandler(401, 'Token has expired'))
    }

    res.status(err.status).send(err)
  }
}

module.exports = auth

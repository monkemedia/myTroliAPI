
const Payment = require('../../models/payment')
const errorHandler = require('../../utils/errorHandler')
const requestIp = require('request-ip')

const createAccount = async (req, res) => {
  const data = req.body
  const {
    type,
    country
  } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'payments') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  if (!country) {
    return res.status(401).send({
      message: 'Country is required'
    })
  }

  try {
    const account = await Payment.createAccount({ country })

    res.status(200).send(account)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

const updateAccount = async (req, res) => {
  const data = req.body
  const { type } = data
  const accountId = req.params.accountId
  const ip = requestIp.getClientIp(req)

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'payments') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  delete data.type


  try {
    const account = await Payment.updateAccount(accountId, {
      ...data,
      // tos_acceptance: {
      //   date: Math.floor(Date.now() / 1000),
      //   ip
      // }
    })

    res.status(200).send(account)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

const getAccount = async (req, res) => {
  const accountId = req.params.accountId

  try {
    const account = await Payment.getAccount(accountId)

    res.status(200).send(account)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

const getPerson = async (req, res) => {
  const accountId = req.params.accountId
  const personId = req.params.personId

  try {
    const person = await Payment.getPerson(accountId, personId)

    res.status(200).send(person)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

const updatePerson = async (req, res) => {
  const data = req.body
  const { type } = data
  const accountId = req.params.accountId
  const personId = req.params.personId

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'payments') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  delete data.type

  try {
    const person = await Payment.updatePerson(accountId, personId, data)

    res.status(200).send(person)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

const uploadFile = async (req, res) => {
  const file = req.file
  const type = req.body.type
  const purpose = req.body.purpose
  const accountId = req.params.accountId

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'payments') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  if (!purpose) {
    return res.status(401).send({
      message: 'Purpose is required'
    })
  }

  try {
    const image = await Payment.uploadFile(accountId, purpose, file)

    res.status(200).send(image)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

const createPayment = async (req, res) => {
  const data = req.body
  const {
    type,
    amount,
    currency,
    receipt_email,
    source
  } = data
  const store_hash = req.params.storeHash

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'payments') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  try {
    const chargeCustomer = await Payment.createPayment({ source, receipt_email, currency, amount, store_hash })

    res.status(200).send(chargeCustomer)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

module.exports = {
  createAccount,
  updateAccount,
  getAccount,
  getPerson,
  updatePerson,
  uploadFile,
  createPayment
}

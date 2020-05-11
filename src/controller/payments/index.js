
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const errorHandler = require('../../utils/errorHandler')

const createPayment = async (req, res) => {
  const data = req.body
  const {
    type,
    amount,
    currency,
    receipt_email,
    source
  } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'payments') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  try {
    const chargeCustomer = await stripe.charges.create({
      source,
      receipt_email,
      currency,
      amount
    })

    res.status(200).send(chargeCustomer)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

const getPayment = async (req, res) => {
  const id = req.params.paymentId
  try {
    const payment = await stripe.charges.retrieve(id)

    res.status(200).send(payment)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

const updatePayment = async (req, res) => {
  const id = req.params.paymentId
  const data = req.body

  const { type } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'payments') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  try {
    const payment = await stripe.charges.update(id, data)

    res.status(200).send(payment)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

module.exports = {
  createPayment,
  getPayment,
  updatePayment
}

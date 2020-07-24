const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const errorHandler = require('../../../utils/errorHandler')

const createPaymentRefund = async (req, res) => {
  const data = req.body
  const {
    type,
    amount
  } = data
  const charge = req.params.paymentId

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'payment-refunds') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  try {
    const paymentRefund = await stripe.refunds.create({
      charge,
      amount
    })

    res.status(200).send(paymentRefund)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

const getPaymentRefund = async (req, res) => {
  const refundId = req.params.refundId

  try {
    const paymentRefund = await stripe.refunds.retrieve(refundId)

    res.status(200).send(paymentRefund)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

module.exports = {
  createPaymentRefund,
  getPaymentRefund
}

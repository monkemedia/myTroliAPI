const PaymentRefund = require('../models/payment/refund')
const errorHandler = require('../../../utils/errorHandler')

const createPaymentRefund = async (req, res) => {
  const data = req.body
  const { amount } = data
  const paymentIntentId = req.params.paymentIntentId

  try {
    const paymentRefund = await PaymentRefund.createPaymentRefund(paymentIntentId, amount, storeHash)

    res.status(200).send(paymentRefund)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

const getPaymentRefund = async (req, res) => {
  const refundId = req.params.refundId

  try {
    const paymentRefund = await PaymentRefund.getPaymentRefund(refundId)

    res.status(200).send(paymentRefund)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

module.exports = {
  createPaymentRefund,
  getPaymentRefund
}

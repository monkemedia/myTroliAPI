const PaymentRefund = require('../models/payment/refund')
const errorHandler = require('../../../utils/errorHandler')

const createPaymentRefund = async (req, res) => {
  const data = req.body
  const {
    type,
    amount
  } = data
  const charge = req.params.chargeId
  const storeHash = req.params.storeHash

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
    const paymentRefund = await PaymentRefund.createPaymentRefund(charge, amount, storeHash)

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

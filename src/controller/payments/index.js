
const Payment = require('../../models/payment')
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
      message: 'Correct type is required'
    })
  }

  try {
    const chargeCustomer = await Payment.createPayment({ source, receipt_email, currency, amount })

    res.status(200).send(chargeCustomer)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

module.exports = {
  createPayment
}

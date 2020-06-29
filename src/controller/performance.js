const Order = require('../models/order/index.js')

const getStoreRevenue = async (req, res) => {
  const data = req.body
  const { type } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'store-performance') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  try {
    const orders = await Order.findOrders({})
    let totalExcTaxSum = 0
    let totalIncTaxSum = 0
    let shippingCostExcTaxSum = 0
    let shippingCostIncTaxSum = 0
    let refundedAmount = 0

    orders.data.map(order => {
      totalExcTaxSum += order.total_exc_tax
      totalIncTaxSum += order.total_inc_tax
      shippingCostExcTaxSum += order.shipping_cost_exc_tax
      shippingCostIncTaxSum += order.shipping_cost_inc_tax
      refundedAmount += order.refunded_amount
    })

    res.status(200).send({
      total_exc_tax: totalExcTaxSum,
      total_inc_tax: totalIncTaxSum,
      shipping_cost_exc_tax: shippingCostExcTaxSum,
      shipping_cost_inc_tax: shippingCostIncTaxSum,
      refunded_amount: refundedAmount
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  getStoreRevenue
}

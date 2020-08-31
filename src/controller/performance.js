const Order = require('../models/order')
const OrderRefund = require('../models/order/refund')

const getStoreRevenue = async (req, res) => {
  try {
    const query = req.query
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 20
    const orders = await Order().findOrders({ page, limit })
    const getRefunds = await OrderRefund().find()
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
    })

    getRefunds.map((refund) => {
      refundedAmount += refund.payment.amount
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

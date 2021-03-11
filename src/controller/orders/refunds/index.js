const Order = require('../../../models/order')
const OrderRefund = require('../../../models/order/refund')

const createOrderRefund = async (req, res) => {
  const data = req.body
  const order_id = req.params.orderId
  const store_hash = req.params.storeHash

  const { items, payment } = data

  if (!items) {
    return res.status(401).send({
      message: 'Items is required'
    })
  }

  if (items.length < 1) {
    return res.status(401).send({
      message: 'Items must be populated'
    })
  }

  if (!payment.provider) {
    return res.status(401).send({
      message: 'Payment provider is required'
    })
  }

  try {
    const orderRefund = new OrderRefund({
      order_id,
      store_hash,
      ...data
    })

    await orderRefund.save()

    const getRefunds = await OrderRefund.find({ order_id })

    const order = await Order.findOne({ id: order_id})

    let totalAmountSum = 0

    getRefunds.forEach((refund) => {
      totalAmountSum += refund.payment.amount
    })

    // Updates order status with either 'refunded' or 'partially refunded'
    order.status_id = totalAmountSum === order.total_inc_tax ? 4 : 14
    await order.save()

    res.status(201).send(orderRefund)
  } catch (err) {
    console.log('err', err)
    let error = {}
    err.message ? error.message = err.message : error = err
    res.status(400).send(error)
  }
}

const getOrderRefunds = async (req, res) => {
  const orderId = req.params.orderId

  try {
    const orderRefunds = await OrderRefund.findOrderRefunds(orderId)

    res.status(200).send(orderRefunds)
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createOrderRefund,
  getOrderRefunds
}

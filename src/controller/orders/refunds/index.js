const Order = require('../../../models/order/index.js')
const OrderRefund = require('../../../models/order/refunds/index.js')

const createOrderRefund = async (req, res) => {
  const data = req.body
  const orderId = req.params.orderId
  const order = await Order.findOne({ id: orderId })

  // Make sure order exists first
  if (!order) {
    return res.status(401).send({
      message: 'Order does\'nt exist'
    })
  }

  const { type, items } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'order-refund') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

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

  // if (!payments) {
  //   return res.status(401).send({
  //     message: 'Payments is required'
  //   })
  // }

  // if (payments.length < 1) {
  //   return res.status(401).send({
  //     message: 'Payments must be populated'
  //   })
  // }

  try {
    const orderRefund = new OrderRefund({
      order_id: orderId,
      ...data
    })

    await orderRefund.save()

    res.status(201).send(orderRefund)
  } catch (err) {
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

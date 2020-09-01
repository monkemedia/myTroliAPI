const OrderStatus = require('../../../models/order/status')

const getOrderStatuses = async (req, res) => {
  try {
    const orders = await OrderStatus.findOrderStatuses()

    res.status(200).send(orders)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getOrderStatus = async (req, res) => {
  const orderStatus = await OrderStatus.findOne({ status_id: req.params.orderStatusId })

  res.status(200).send(orderStatus)
}

module.exports = {
  getOrderStatuses,
  getOrderStatus
}

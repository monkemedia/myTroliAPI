const Order = require('../../models/order/index.js')
const emailTemplate = require('../../utils/emailTemplate')

const createOrder = async (req, res) => {
  const data = req.body
  const { type, line_items, billing_address, shipping_address, send_invoice } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'order') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  if (!line_items) {
    return res.status(401).send({
      message: 'Products is required'
    })
  }

  if (line_items.length < 1) {
    return res.status(401).send({
      message: 'Products must be populated'
    })
  }

  if (!billing_address) {
    return res.status(401).send({
      message: 'Billing address is required'
    })
  }

  if (!shipping_address) {
    data.shipping_address = billing_address
  }

  try {
    const order = new Order()(data)

    await order.save()

    if (send_invoice) {
      await emailTemplate.orderInvoice({
        email: billing_address.email
      })
    }

    res.status(201).send(order)
  } catch (err) {
    let error = {}
    err.message ? error.message = err.message : error = err
    res.status(400).send(error)
  }
}

const getOrders = async (req, res) => {
  try {
    const query = req.query
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 20
    const keyword = query.keyword
    const statusId = query.status_id
    let orders

    if (keyword) {
      orders = await Order().search({ page, keyword, limit })
    } else if (statusId) {
      orders = await Order().findOrdersByStatusId({ page, limit, statusId })
    } else {
      orders = await Order().findOrders({ page, limit })
    }

    res.status(200).send(orders)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getOrder = async (req, res) => {
  const orderId = req.params.orderId

  let order
  if (orderId === 'count') {
    order = await Order().getCount()
  } else {
    order = await Order().findOrder(orderId)
  }

  res.status(200).send(order)
}

const updateOrder = async (req, res) => {
  const orderId = req.params.orderId
  const data = req.body
  const { type, billing_address, status_id } = data
  const currentOrder = await Order().findOne({ id: req.params.orderId })

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'order') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  try {
    await Order().updateOrder(orderId, data)
    const order = await Order().findOne({ id: orderId })

    if (currentOrder.status_id !== status_id) {
      // Status Id has changed so email customer
      await emailTemplate.orderInvoice({
        email: billing_address ? billing_address.email : order.billing_address.email
      })
    }

    res.status(200).send(order)
  } catch (err) {
    res.status(400).send({ err: err.message || err })
  }
}

const deleteOrder = async (req, res) => {
  const orderId = req.params.orderId
  try {
    await Order().deleteOrder(orderId)

    res.status(200).send({
      message: 'Order successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder
}

const OrderStatus = require('../../../models/order/orderStatus/index.js')

const createOrderStatus = async (req, res) => {
  const data = req.body

  if (data.some(val => !val.type)) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (data.some(val => val.type !== 'order-status')) {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  if (data.some(val => isNaN(val.status_id))) {
    return res.status(401).send({
      message: 'Status ID is required'
    })
  }

  if (data.some(val => !val.name)) {
    return res.status(401).send({
      message: 'Name is required'
    })
  }

  if (data.some(val => !val.value)) {
    return res.status(401).send({
      message: 'Value is required'
    })
  }

  try {
    const promise = data.map(async obj => {
      const orderStatus = new OrderStatus(obj)
      const save = await orderStatus.save()
      return save
    })
    const savedOrderStatuses = await Promise.all(promise)

    res.status(201).send(savedOrderStatuses)
  } catch (err) {
    res.status(400).send(err)
  }
}

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

const updateOrderStatus = async (req, res) => {
  const data = req.body
  const orderStatusId = req.params.orderStatusId
  const { type, status_id, name, value } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'order-status') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  if (isNaN(status_id)) {
    return res.status(401).send({
      message: 'Status ID is required'
    })
  }

  if (!name) {
    return res.status(401).send({
      message: 'Name is required'
    })
  }

  if (!value) {
    return res.status(401).send({
      message: 'Value is required'
    })
  }

  try {
    await OrderStatus.updateOrderStatus(orderStatusId, data)
    const orderStatus = await OrderStatus.findOne({ status_id: orderStatusId })

    res.status(200).send(orderStatus)
  } catch (err) {
    res.status(400).send(err)
  }
}

// const deleteCategory = async (req, res) => {
//   try {
//     // Delete any relationships first
//     const relationships = await ProductCategories.findProductCategories(req.params.categoryId)
//     relationships.map(async relationship => {
//       await ProductCategories.deleteCategory(relationship._id)
//     })

//     await Category.deleteCategory(req.params.categoryId)

//     res.status(200).send({
//       message: 'Category successfully deleted'
//     })
//   } catch (err) {
//     res.status(400).send(err)
//   }
// }

module.exports = {
  createOrderStatus,
  getOrderStatuses,
  getOrderStatus,
  updateOrderStatus
  // deleteCategory
}

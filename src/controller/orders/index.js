const Order = require('../../models/order/index.js')

const createOrder = async (req, res) => {
  const data = req.body
  const { type, products, billing_address, shipping_address } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'order') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (!products) {
    return res.status(401).send({
      message: 'Products is required'
    })
  }

  if (products.length < 1) {
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
    const order = new Order(data)

    await order.save()

    res.status(201).send(order)
  } catch (err) {
    let error = {}
    err.message ? error.message = err.message : error = err
    res.status(400).send(error)
  }
}

const getOrders = async (req, res) => {
  try {
    const orders = await Order.findOrders()

    res.status(200).send(orders)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.orderId })

  res.status(200).send(order)
}

// const updateCategory = async (req, res) => {
//   const _id = req.params.categoryId
//   const currentCategoryDetails = await Category.findOne({ _id })
//   const { type, name, slug, description, status } = req.body

//   if (!type) {
//     return res.status(401).send({
//       message: 'Type is required'
//     })
//   }

//   if (type && type !== 'categories') {
//     return res.status(401).send({
//       message: 'Correct Type is required'
//     })
//   }

//   if (status && (status !== 'draft' && status !== 'live')) {
//     return res.status(401).send({
//       message: 'Correct Status is required'
//     })
//   }

//   const data = {
//     type,
//     _id,
//     name: name || currentCategoryDetails.name,
//     slug: slug || currentCategoryDetails.slug,
//     description: description || currentCategoryDetails.description,
//     status: status || currentCategoryDetails.status
//   }

//   try {
//     await Category.updateCategory(data)

//     res.status(200).send(data)
//   } catch (err) {
//     res.status(400).send(err)
//   }
// }

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
  createOrder,
  getOrders,
  getOrder
  // updateCategory,
  // deleteCategory
}

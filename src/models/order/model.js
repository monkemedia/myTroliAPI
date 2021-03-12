const mongoose = require('mongoose')
const OrderSchema = require('./schema')
const Product = require('../product')
const ProductVariants = require('../product/variant')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const { convertISOToCountry} = require('../../utils/helpers')

OrderSchema.plugin(AutoIncrement, {
  inc_field: 'id',
  start_seq: 100
})

async function updateTotalSold (productId, quantity, direction) {
  const product = await Product.updateOne({ _id: productId }, {
    $inc: {
      total_sold: direction === 'increase' ? quantity : -quantity
    }
  })

  return product
}

async function updateProductStock ({ productId, variantId, trackInventory, currentStock, qty }, direction) {
  const newStock = direction === 'decrease' ? currentStock - qty : currentStock + qty
  let update

  if (trackInventory === 'variant-inventory') {
    update = await ProductVariants.updateOne({ _id: variantId }, {
      stock: newStock
    })
  } else if (trackInventory === 'product-inventory') {
    update = await Product.updateOne({ _id: productId }, {
      stock: newStock
    })
  }

  return update
}

async function stockLevelHandler (product) {
  // Does product have options
  const variantId = product.variant_id
  const productId = product.product_id
  const trackInventory = product.track_inventory
  let stock

  if (trackInventory === 'variant-inventory') {
    const productVariant = await ProductVariants.findOne({ _id: variantId })
    stock = productVariant.stock
  } else if (trackInventory === 'product-inventory') {
    const prod = await Product.findOne({ _id: productId })
    stock = prod.stock
  }

  return stock
}

// Check stock before creating order
OrderSchema.pre('save', async function (next) {
  const order = this
  const lineItems = order.line_items

  order.billing_address.country = await convertISOToCountry(order.billing_address.country_code)
  order.shipping_address.country = await convertISOToCountry(order.shipping_address.country_code)

  const promise = await lineItems.map(async orderProduct => {
    const productId = orderProduct.product_id
    const productName = orderProduct.name
    const trackInventory = orderProduct.track_inventory
    const variantId = orderProduct.variant_id
    const orderQty = orderProduct.quantity

    // Increment total sold field
    await updateTotalSold(productId, orderQty, 'increase')

    if (trackInventory === 'none') {
      return next()
    }

    const stockLevel = await stockLevelHandler(orderProduct)

    if (orderQty > stockLevel) {
      throw new Error(`Product '${productName}' is out of stock`)
    }

    // There is enough stock, so decrease stock
    await updateProductStock({
      currentStock: stockLevel,
      qty: orderQty,
      trackInventory,
      variantId,
      productId
    }, 'decrease')

    next()
  })

  await Promise.all(promise)
})

// Get orders
OrderSchema.statics.findOrders = async ({ page, limit, store_hash }) => {
  const orders = await Order
    .aggregate([
      {
        $match: { store_hash }
      },
      {
        $lookup: {
          from: 'orderrefunds',
          localField: 'refunded',
          foreignField: '_id',
          as: 'refunded'
        }
      },
      { $sort: {'created_at' : -1} },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ])

  const total = await Order.countDocuments({ store_hash })
  return {
    data: orders,
    meta: {
      pagination: {
        current: page,
        total: orders.length
      },
      results: {
        total
      }
    }
  }
}

// Get order
OrderSchema.statics.findOrder = async (id) => {
  const order = await Order
    .aggregate([
      {
        $match: { id: parseInt(id) }
      },
      {
        $limit: 1
      }, 
      {
        $lookup: {
          from: 'orderrefunds',
          localField: 'refunded',
          foreignField: '_id',
          as: 'refunded'
        }
      }
    ])

  return order[0]
}

// Get orders by status id
OrderSchema.statics.findOrdersByStatusId = async ({ page, limit, statusId, store_hash }) => {
  const statusIdCollection = statusId ? statusId.split(',') : []
  const convertToNumbers = statusIdCollection.length > 0 ? statusIdCollection.map(val => parseInt(val)) : []
  const orders = await Order
    .aggregate([
      {
        $match: { status_id: { $in: convertToNumbers }, store_hash }
      },
      {
        $lookup: {
          from: 'orderrefunds',
          localField: 'refunded',
          foreignField: '_id',
          as: 'refunded'
        }
      },
      { $sort: {'created_at' : -1} },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ])

  const total = await Order.countDocuments({ store_hash })
  return {
    data: orders,
    meta: {
      pagination: {
        current: page,
        total: orders.length
      },
      results: {
        total
      }
    }
  }
}

// Get orders count
OrderSchema.statics.getCount = async (status_id, store_hash) => {
  let total
  if (!status_id) {
    total = await Order.countDocuments({ store_hash })
  } else {
    total = await Order.countDocuments({ status_id, store_hash })
  }
  return {
    count: total
  }
}

// Search orders by order id or customer name
OrderSchema.statics.search = async ({ page, keyword, limit, store_hash }) => {
  const searchString = new RegExp(decodeURIComponent(keyword), 'i')
  const fullname = {
    fullname: { $concat: ['$billing_address.first_name', ' ', '$billing_address.last_name'] }
  }
  const orders = await Order
    .aggregate([
      {
        $lookup: {
          from: 'orderrefunds',
          localField: 'refunded',
          foreignField: '_id',
          as: 'refunded'
        }
      }
    ])
    .addFields(fullname)
    .match({
      store_hash,
      $or: [
        { fullname: searchString },
        { id: parseInt(keyword) }
      ]
    })
    .sort('-created_at')
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Order
    .aggregate()
    .addFields(fullname)
    .match({
      store_hash,
      $or: [
        { fullname: searchString },
        { id: parseInt(keyword) }
      ]
    })

  return {
    data: orders,
    meta: {
      pagination: {
        current: page,
        total: orders.length
      },
      results: {
        total: total.length
      }
    }
  }
}

// Update order
OrderSchema.statics.updateOrder = async (orderId, orderDetails) => {
  // const currentOrderQty =
  const lineItems = orderDetails.line_items

  if (lineItems) {
    const promise = await lineItems.map(async orderProduct => {
      const storedOrder = await Order.findOne({ id: orderId })
      const storedOrderProduct = storedOrder.line_items.find((order) => {
        return storedOrder._id.toString() === orderProduct._id
      })
      const storedOrderProductQty = storedOrderProduct ? storedOrderProduct.quantity : 0
      const orderQty = orderProduct.quantity
      const productName = orderProduct.name
      const productId = orderProduct.product_id
      const variantId = orderProduct.variant_id
      const stockLevel = await stockLevelHandler(orderProduct)

      // Quantity can not be 0 {
      if (orderQty === '' || orderQty === 0) {
        throw new Error(`Product \`${productName}\` quantity needs to be a valid amount`)
      }

      // Merchant has decreased order quantity, so increase stock level and reduce total solds
      if (orderQty < storedOrderProductQty) {
        const stockToAdd = storedOrderProductQty - orderQty
        // Increment total sold field
        await updateTotalSold(productId, stockToAdd, 'decrease')
        updateProductStock({
          currentStock: stockLevel,
          qty: stockToAdd,
          variantId,
          productId
        }, 'increase')
      } else if (orderQty > storedOrderProductQty) {
        const stockToRemove = orderQty - storedOrderProductQty
        // const totalSoldQuantity =
        if (stockToRemove > stockLevel) {
          throw new Error(`Product \`${productName}\` is out of stock`)
        }
        await updateTotalSold(productId, stockToRemove, 'increase')
        updateProductStock({
          currentStock: stockLevel,
          qty: stockToRemove,
          variantId,
          productId
        }, 'decrease')
      }
    })

    await Promise.all(promise)
  }
  orderDetails.billing_address.country = await convertISOToCountry(orderDetails.billing_address.country_code)
  orderDetails.shipping_address.country = await convertISOToCountry(orderDetails.shipping_address.country_code)
  const orderResp = await Order.updateOne({ id: orderId }, {
    ...orderDetails,
    updated_at: Date.now()
  })
  return orderResp
}

// Delete order
OrderSchema.statics.deleteOrder = async (orderId) => {
  const order = await Order.deleteOne({ id: orderId })
  return order
}

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order

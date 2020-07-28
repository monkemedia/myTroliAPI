const mongoose = require('mongoose')
const orderSchema = require('./schema')
const Product = require('../product/index.js')
const ProductVariants = require('../product/variant/index.js')
const AutoIncrement = require('mongoose-sequence')(mongoose)

orderSchema.plugin(AutoIncrement, {
  inc_field: 'id',
  start_seq: 100
})

async function updateTotalSold (productId, quantity, direction) {
  let product

  if (direction === 'increase') {
    product = await Product.updateOne({ _id: productId }, {
      $inc: {
        total_sold: quantity
      }
    })
  } else {
    product = await Product.updateOne({ _id: productId }, {
      $inc: {
        total_sold: -quantity
      }
    })
  }

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
orderSchema.pre('save', async function (next) {
  const order = this
  const orderProducts = order.products

  const promise = await orderProducts.map(async orderProduct => {
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
orderSchema.statics.findOrders = async ({ page = null, limit = null }) => {
  const orders = await Order
    .find()
    .sort('-created_at')
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Order.countDocuments()
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

// Get orders by status id
orderSchema.statics.findOrdersByStatusId = async ({ page, limit, statusId }) => {
  const statusIdCollection = statusId ? statusId.split(',') : []

  const orders = await Order
    .find()
    .where('status_id')
    .in(statusIdCollection)
    .sort('-created_at')
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Order.countDocuments()
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
orderSchema.statics.getCount = async () => {
  const total = await Order.countDocuments()
  return {
    count: total
  }
}

// Search orders by order id or customer name
orderSchema.statics.search = async ({ page, keyword, limit }) => {
  const searchString = new RegExp(decodeURIComponent(keyword), 'i')
  const searchQuery = {
    fullname: { $concat: ['$billing_address.first_name', ' ', '$billing_address.last_name'] }
  }
  const searchArray = { $or: [{ fullname: searchString }, { id: parseInt(keyword) || null }] }
  const orders = await Order
    .aggregate()
    .addFields(searchQuery)
    .match(searchArray)
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Order.countDocuments(searchArray)
  return {
    data: orders,
    meta: {
      pagination: {
        current: page,
        total: orders.length
      },
      results: {
        total: total
      }
    }
  }
}

// Update order
orderSchema.statics.updateOrder = async (orderId, orderDetails) => {
  // const currentOrderQty =
  const orderProducts = orderDetails.products

  if (orderProducts) {
    const promise = await orderProducts.map(async orderProduct => {
      const storedOrder = await Order.findOne({ id: orderId })
      const storedOrderProduct = storedOrder.products.find((order) => {
        return order._id.toString() === orderProduct._id
      })
      const storedOrderProductQty = storedOrderProduct ? storedOrderProduct.quantity : 0
      const orderQty = orderProduct.quantity
      const productName = orderProduct.name
      const productId = orderProduct.product_id
      const variantId = orderProduct.variant_id
      const stockLevel = await stockLevelHandler(orderProduct)

      console.log(storedOrderProduct)

      // Quantity can not be 0 {
      if (orderQty === '' || orderQty === 0) {
        throw new Error(`Product \`${productName}\` quantity needs to be a valid amount`)
      }

      // Client has decreased order quantity, so increase stock level and reduce total solds
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
        console.log('stockToRemove', stockToRemove)
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
  const order = await Order.updateOne({ id: orderId }, {
    ...orderDetails,
    updated_at: Date.now()
  })
  return order
}

// Delete order
orderSchema.statics.deleteOrder = async (orderId) => {
  const order = await Order.deleteOne({ id: orderId })
  return order
}

const Order = mongoose.model('Order', orderSchema)

module.exports = Order

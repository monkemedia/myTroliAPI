const mongoose = require('mongoose')
const currencySymbol = require('currency-symbol-map')
const Schema = mongoose.Schema

const productSchema = Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  stock: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'draft'
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Object,
    required: true
  },
  commodity_type: {
    type: String,
    required: true
  },
  meta: {
    type: Object,
    required: false
  },
  relationships: {
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ProductCategoryRelationship'
      }
    ]
  }
})

function formatCurrency (amount, currency) {
  return currencySymbol(currency) + amount.toFixed(2).toString()
}

function updateMeta (product, amount, currency, stock) {
  return {
    display_price: {
      currency,
      formatted: formatCurrency(amount, currency)
    },
    stock: {
      level: product.stock,
      availability: stock === 0 ? 'out-stock' : 'in-stock'
    }
  }
}

// Add meta data before saving
productSchema.pre('save', async function (next) {
  const product = this
  const amount = product.price.amount
  const currency = product.price.currency
  const stock = product.stock

  product.meta = updateMeta(product, amount, currency, stock)
  next()
})

// Get all products
productSchema.statics.findAllProducts = async (page, limit) => {
  const products = await Product.find({}).populate('relationships.categories').skip((page - 1) * limit).limit(limit)
  const total = await Product.countDocuments()
  return {
    data: products,
    meta: {
      pagination: {
        current: page,
        total: products.length
      },
      results: {
        total
      }
    }
  }
}

// Get product by product id
productSchema.statics.findAddress = async (productId) => {
  const product = await Product.findOne({ _id: productId })
  return product
}

// Update product
productSchema.statics.updateProduct = async (productDetails) => {
  const { _id, price, stock } = productDetails
  const data = {
    ...productDetails,
    meta: updateMeta(productDetails, price.amount, price.currency, stock)
  }

  await Product.updateOne({ _id }, data)
  return data
}

// Delete product by id
productSchema.statics.deleteProduct = async (_id) => {
  const product = await Product.deleteOne({ _id })
  return product
}

const Product = mongoose.model('Product', productSchema)

module.exports = Product

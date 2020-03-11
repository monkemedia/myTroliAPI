const Product = require('../../models/product')
const currencySymbol = require('currency-symbol-map')
const errorHandler = require('../../utils/errorHandler')

const createProduct = async (req, res) => {
  const customer_id = req.params.customerId
  const data = req.body
  const { type, name, slug, sku, stock, status, description, price, commodity_type } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (!name) {
    return res.status(401).send({
      message: 'Name is required'
    })
  }

  if (!slug) {
    return res.status(401).send({
      message: 'Slug is required'
    })
  }

  if (!sku) {
    return res.status(401).send({
      message: 'SKU is required'
    })
  }

  if (isNaN(stock)) {
    return res.status(401).send({
      message: 'Stock is required'
    })
  }

  if (typeof stock !== 'number') {
    return res.status(401).send({
      message: 'Stock requires a number'
    })
  }

  if (!status) {
    return res.status(401).send({
      message: 'Status is required'
    })
  }

  if (status !== 'draft' && status !== 'live') {
    return res.status(401).send({
      message: 'Status must be either `draft` or `live`'
    })
  }

  if (!description) {
    return res.status(401).send({
      message: 'Description is required'
    })
  }

  if (!price) {
    return res.status(401).send({
      message: 'Price is required'
    })
  }

  if (price && typeof price !== 'object') {
    return res.status(401).send({
      message: 'Price requires an object'
    })
  }

  if (isNaN(price.amount)) {
    return res.status(401).send({
      message: 'Price amount is required'
    })
  }

  if (!isNaN(price.amount) && typeof price.amount !== 'number') {
    return res.status(401).send({
      message: 'Price amount requires a number'
    })
  }

  if (!price.currency) {
    return res.status(401).send({
      message: 'Price currency is required'
    })
  }

  if (!currencySymbol(price.currency)) {
    return res.status(401).send({
      message: 'Price currency is not a 3 letter ISO'
    })
  }

  if (!commodity_type) {
    return res.status(401).send({
      message: 'Commodity Type is required'
    })
  }

  if (commodity_type !== 'physical' && commodity_type !== 'digital') {
    return res.status(401).send({
      message: 'Commodity Type should be either physical or digital types'
    })
  }

  try {
    const products = new Product({ ...data, customer_id })

    await products.save()

    res.status(201).send(products)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

const getProducts = async (req, res) => {
  try {
    const query = req.query.query
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    let products

    if (query) {
      products = await Product.search({ page, query })
    } else {
      products = await Product.findAllProducts({ page, limit })
    }
    res.status(200).send({ data: products.data, meta: products.meta })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProduct = async (req, res) => {
  const _id = req.params.productId
  const product = await Product.findById({ _id })

  res.status(200).send(product)
}

const updateProduct = async (req, res) => {
  const _id = req.params.productId
  const currentProductDetails = await Product.findOne({ _id })
  const data = req.body
  const { type, name, slug, sku, stock, status, description, relationships, price, commodity_type, updated_at, created_at } = data

  if (status && (status !== 'draft' && status !== 'live')) {
    return res.status(401).send({
      message: 'Status must be either `draft` or `live`'
    })
  }

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (!isNaN(stock) && typeof stock !== 'number') {
    return res.status(401).send({
      message: 'Stock requires a number'
    })
  }

  if (price && typeof price !== 'object') {
    return res.status(401).send({
      message: 'Price requires an object'
    })
  }

  if (price && !isNaN(price.amount) && typeof price.amount !== 'number') {
    return res.status(401).send({
      message: 'Price amount requires a number'
    })
  }

  if (price && price.currency && !currencySymbol(price.currency)) {
    return res.status(401).send({
      message: 'Price currency is not a 3 letter ISO'
    })
  }

  if (commodity_type && (commodity_type !== 'physical' && commodity_type !== 'digital')) {
    return res.status(401).send({
      message: 'Commodity Type should be either physical or digital types'
    })
  }

  try {
    const product = await Product.updateProduct({
      type,
      _id,
      name: name || currentProductDetails.name,
      slug: slug || currentProductDetails.slug,
      sku: sku || currentProductDetails.sku,
      stock: !isNaN(stock) ? stock : currentProductDetails.stock,
      status: status || currentProductDetails.status,
      description: description || currentProductDetails.description,
      categories: currentProductDetails.categories,
      variants: currentProductDetails.variants,
      relationships: {
        files: (relationships && relationships.files) || currentProductDetails.relationships.files
      },
      price: {
        amount: (price && !isNaN(price.amount)) ? price.amount : currentProductDetails.price.amount,
        currency: (price && price.currency) ? price.currency : currentProductDetails.price.currency
      },
      commodity_type: commodity_type || currentProductDetails.commodity_type,
      updated_at: updated_at || currentProductDetails.updated_at,
      created_at: created_at || currentProductDetails.created_at
    })

    res.status(200).send(product)
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
}

const deleteProduct = async (req, res) => {
  try {
    await Product.deleteProduct(req.params.productId)

    res.status(200).send({
      message: 'Product successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
}


const Product = require('../../models/product')
const errorHandler = require('../../utils/errorHandler')

const createProduct = async (req, res) => {
  const customer_id = req.params.customerId
  const data = req.body
  const {
    type,
    name,
    slug,
    sku,
    stock,
    status,
    description,
    commodity_type
  } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product') {
    return res.status(401).send({
      message: 'Correct type is required'
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
    const products = new Product()({ ...data, customer_id })

    await products.save()

    res.status(201).send(products)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

const getProducts = async (req, res) => {
  try {
    const query = req.query
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 20
    const keyword = query && query.keyword
    let products

    if (keyword) {
      products = await Product().search({ page, keyword, limit })
    } else {
      products = await Product().findProducts({ page, limit })
    }
    res.status(200).send(products)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProduct = async (req, res) => {
  const productId = req.params.productId
  const product = await Product().findProduct(productId)

  res.status(200).send(product)
}

const getProductCount = async (req, res) => {
  const isRatings = req.query.ratings
  const product = await Product().getCount(isRatings)

  res.status(200).send(product)
}

const updateProduct = async (req, res) => {
  const productId = req.params.productId
  const data = req.body
  const { type } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  try {
    const product = await Product().updateProduct(productId, data)

    res.status(200).send(product)
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
}

const deleteProduct = async (req, res) => {
  try {
    await Product().deleteProduct(req.params.productId)

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
  getProductCount,
  updateProduct,
  deleteProduct
}

const ProductReview = require('../../../models/product/reviews/index.js')
const Product = require('../../../models/product')

const createProductReview = async (req, res) => {
  const data = req.body
  const {
    title
  } = data
  const productId = req.params.productId
  const storeHash = req.params.storeHash

  if (!title) {
    return res.status(401).send({
      message: 'Title is required'
    })
  }

  try {
    const productReview = new ProductReview({
      store_hash: storeHash,
      product_id: productId,
      ...data
    })
    await productReview.save()

    res.status(201).send(productReview)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductReviews = async (req, res) => {
  const query = req.query
  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || 20
  const keyword = query && query.keyword

  let productReviews

  try {
    const productId = req.params.productId
    const store_hash = req.params.storeHash

    if (keyword) {
      productReviews = await ProductReview.search({ page, keyword, limit, store_hash })
    } else {
      productReviews = await ProductReview.findProductReviews({ page, limit, productId, store_hash })
    }

    res.status(200).send(productReviews)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductReview = async (req, res) => {
  const reviewId = req.params.reviewId
  const productId = req.params.productId
  const productReview = await ProductReview.findOne({ _id: reviewId, product_id: productId })

  res.status(200).send(productReview)
}

const updateProductReview = async (req, res) => {
  const data = req.body
  const { status } = data
  const productId = req.params.productId
  const reviewId = req.params.reviewId

  try {
    await ProductReview.updateProductReview(reviewId, data)
    const productReview = await ProductReview.findOne({ _id: reviewId, product_id: productId })
    let pushPull

    status === 'approved' ? pushPull = '$push' : pushPull = '$pull'

    await Product.updateOne({ _id: productId }, {
      [pushPull]: {
        reviews: productReview._id
      },
      updated_at: Date.now()
    })

    res.status(200).send(productReview)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteProductReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId
    const productId = req.params.productId

    await ProductReview.deleteProductReview(reviewId, productId)

    res.status(200).send({
      message: 'Product review successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createProductReview,
  getProductReviews,
  getProductReview,
  updateProductReview,
  deleteProductReview
}

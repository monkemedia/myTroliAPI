const ProductFacet = require('../../../models/product/facet/index.js')
const Product = require('../../../models/product')

const createProductFacet = async (req, res) => {
  const data = req.body
  const {
    type,
    name,
    value
  } = data
  const productId = req.params.productId

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product-facet') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  if (!name) {
    return res.status(401).send({
      message: 'Name is required'
    })
  }

  if (!value) {
    return res.status(401).send({
      message: 'value is required'
    })
  }

  try {
    const productFacet = new ProductFacet({
      product_id: productId,
      ...data
    })
    await productFacet.save()

    await Product.updateOne({ _id: productId }, {
      $push: {
        facets: productFacet._id
      },
      updated_at: Date.now()
    })

    res.status(201).send(productFacet)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductFacets = async (req, res) => {
  try {
    const productId = req.params.productId
    const productFacets = await ProductFacet.findProductFacets(productId)

    res.status(200).send(productFacets)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductFacet = async (req, res) => {
  const facetId = req.params.facetId
  const productId = req.params.productId
  const productFacet = await ProductFacet.findOne({ _id: facetId, product_id: productId })

  res.status(200).send(productFacet)
}

const updateProductFacet = async (req, res) => {
  const data = req.body
  const { type } = data
  const productId = req.params.productId
  const facetId = req.params.facetId

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product-facet') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  try {
    await ProductFacet.updateProductFacet(facetId, data)
    const productFacet = await ProductFacet.findOne({ _id: facetId, product_id: productId })

    res.status(200).send(productFacet)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteProductFacet = async (req, res) => {
  try {
    const facetId = req.params.facetId
    const productId = req.params.productId

    await ProductFacet.deleteProductFacet(facetId, productId)

    res.status(200).send({
      message: 'Product facet successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createProductFacet,
  getProductFacets,
  getProductFacet,
  updateProductFacet,
  deleteProductFacet
}

const ProductCustomField = require('../../../models/product/customFields')
const Product = require('../../../models/product')

const createProductCustomField = async (req, res) => {
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

  if (type && type !== 'product-custom-field') {
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
    const productCustomField = new ProductCustomField({
      product_id: productId,
      ...data
    })
    await productCustomField.save()

    await Product().updateOne({ _id: productId }, {
      $push: {
        custom_fields: productCustomField._id
      },
      updated_at: Date.now()
    })

    res.status(201).send(productCustomField)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductCustomFields = async (req, res) => {
  try {
    const productId = req.params.productId
    const productCustomFields = await ProductCustomField.findProductCustomFields(productId)

    res.status(200).send(productCustomFields)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductCustomField = async (req, res) => {
  const customFieldId = req.params.customFieldId
  const productId = req.params.productId
  const productCustomField = await ProductCustomField.findOne({ _id: customFieldId, product_id: productId })

  res.status(200).send(productCustomField)
}

const updateProductCustomField = async (req, res) => {
  const data = req.body
  const { type } = data
  const productId = req.params.productId
  const customFieldId = req.params.customFieldId

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product-custom-field') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  try {
    await ProductCustomField.updateProductCustomField(customFieldId, data)
    const productCustomField = await ProductCustomField.findOne({ _id: customFieldId, product_id: productId })

    res.status(200).send(productCustomField)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteProductCustomField = async (req, res) => {
  try {
    const customFieldId = req.params.customFieldId
    const productId = req.params.productId

    await ProductCustomField.deleteProductCustomField(customFieldId, productId)

    res.status(200).send({
      message: 'Custom field successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createProductCustomField,
  getProductCustomFields,
  getProductCustomField,
  updateProductCustomField,
  deleteProductCustomField
}

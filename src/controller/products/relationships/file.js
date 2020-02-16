const FileRelationship = require('../../../models/product/relationships/file')
const Product = require('../../../models/product')

const createFileRelationship = async (req, res) => {
  const data = req.body.data
  const _id = req.params.productId

  if (data.some(val => !val.type)) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (data.some(val => val.type !== 'file')) {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (data.some(val => !val.file_id)) {
    return res.status(401).send({
      message: 'File ID is required'
    })
  }

  try {
    const relationshipPromise = data.map(async obj => {
      const files = new FileRelationship(obj)

      const save = await files.save()
      return save
    })

    const savedFileRelationship = await Promise.all(relationshipPromise)
    const product = await Product.findById(_id)

    const productPromise = savedFileRelationship.map(async obj => {
      product.relationships.files.push(obj)
      product.save()
    })

    product.updated_at = new Date()
    product.save()

    await Promise.all(productPromise)
    res.status(201).send({ data: savedFileRelationship })
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteFileRelationship = async (req, res) => {
  const productId = req.params.productId
  const data = req.body.data

  if (data.some(val => !val.type)) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (data.some(val => val.type !== 'file')) {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (data.some(val => !val.file_id)) {
    return res.status(401).send({
      message: 'Category ID is required'
    })
  }

  try {
    const product = await Product.findById(productId)

    await data.map(async obj => {
      await FileRelationship.deleteFile(obj.file_id)
      await product.relationships.files.pull(obj.file_id)
    })

    product.updated_at = new Date()
    product.save()

    res.status(200).send({
      message: 'File relationship successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createFileRelationship,
  deleteFileRelationship
}

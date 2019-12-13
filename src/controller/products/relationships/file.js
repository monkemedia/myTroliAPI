const FileRelationship = require('../../../models/product/relationships/file')
const Product = require('../../../models/product')

const createFileRelationship = async (req, res) => {
  const data = req.body.data
  const _id = req.params.productId
  const { type, file_id } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type !== 'file') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (!file_id) {
    return res.status(401).send({
      message: 'File ID is required'
    })
  }

  try {
    const files = new FileRelationship(data)
    const savedFileRelationship = await files.save()
    const product = await Product.findById(_id)

    product.relationships.files.push(savedFileRelationship)
    product.save()
    res.status(201).send(savedFileRelationship)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteFileRelationship = async (req, res) => {
  const data = req.body.data
  const _id = req.params.productId
  const { type, file_id } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type !== 'file') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (!file_id) {
    return res.status(401).send({
      message: 'File ID is required'
    })
  }

  try {
    await FileRelationship.deleteFile(file_id)

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

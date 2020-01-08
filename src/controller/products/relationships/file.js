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
      message: 'Category ID is required'
    })
  }

  try {
    const files = new FileRelationship({ data })
    const savedFileRelationship = await files.save()
    const product = await Product.findById(_id)

    product.relationships.files = savedFileRelationship._id
    product.save()
    res.status(201).send(savedFileRelationship)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteFileRelationship = async (req, res) => {
  const productId = req.params.productId
  const data = req.body.data
  const { type, file_id } = data

  function relationshipId (fileId, files) {
    return files.filter(file => file.file_id === fileId)[0]._id
  }

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
    const product = await Product.findById(productId).populate('relationships.files')
    product.relationships.files.remove(relationshipId(file_id, product.relationships.files))
    await product.save()
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

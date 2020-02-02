const VariantRelationship = require('../../../models/product/relationships/variant/index.js')
const Product = require('../../../models/product')

const createVariantRelationship = async (req, res) => {
  const data = req.body.data
  const _id = req.params.productId

  if (data.some(val => !val.type)) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (data.some(val => val.type !== 'variant')) {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  try {
    const relationshipPromise = data.map(async obj => {
      const variants = new VariantRelationship(obj)
      const save = await variants.save()
      return save
    })

    const savedVariantRelationship = await Promise.all(relationshipPromise)
    const product = await Product.findById(_id)

    const productPromise = savedVariantRelationship.map(async obj => {
      product.relationships.variants.push(obj)
      product.save()
    })

    await Promise.all(productPromise)
    res.status(201).send({ data: savedVariantRelationship })
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteVariantRelationship = async (req, res) => {
  const productId = req.params.productId
  const data = req.body.data

  if (data.some(val => !val.type)) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (data.some(val => val.type !== 'variant')) {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (data.some(val => !val.variant_id)) {
    return res.status(401).send({
      message: 'Variant ID is required'
    })
  }

  try {
    const product = await Product.findById(productId)

    await data.map(async obj => {
      const getVariantRelationshipId = await VariantRelationship.findRelationshipIdByVariantId(obj.variant_id)
      getVariantRelationshipId.map(async rel => {
        await product.relationships.variants.pull({ _id: rel._id })
      })
      await VariantRelationship.deleteVariant(obj.variant_id)
      product.save()
    })

    res.status(200).send({
      message: 'Variant relationship successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

// const updateVariantRelationship = async (req, res) => {
//   const data = req.body.data

//   if (data.some(val => !val.type)) {
//     return res.status(401).send({
//       message: 'Type is required'
//     })
//   }

//   if (data.some(val => val.type !== 'variant')) {
//     return res.status(401).send({
//       message: 'Correct Type is required'
//     })
//   }

//   if (data.some(val => !val.variant_id)) {
//     return res.status(401).send({
//       message: 'Variant ID is required'
//     })
//   }

//   try {
//     const product_id = req.params.productId
//     const product = await Product.findById(product_id)
//     const relationshipId = product.relationships.variants

//     await VariantRelationship.updateVariant({ _id: relationshipId, data })

//     res.status(200).send({ data })
//   } catch (err) {
//     res.status(400).send(err)
//   }
// }

module.exports = {
  createVariantRelationship,
  deleteVariantRelationship
  // updateVariantRelationship
}

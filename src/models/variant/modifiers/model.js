const mongoose = require('mongoose')
const uniqueArrayPlugin = require('mongoose-unique-array')
const productOptionModifierSchema = require('./schema')

productOptionModifierSchema.plugin(uniqueArrayPlugin)

// Find all category relationships by category id
// productOptionModifierSchema.statics.findAllByCategoryIds = async (id) => {
//   const category = await Category.find({ 'data.category_id': id })
//   return category
// }

// Get all modifier
productOptionModifierSchema.statics.findAllModifiers = () => Modifier.find({})

// Find modifier by id
productOptionModifierSchema.statics.findModifier = (modifierId) => Modifier.findOne({ _id: modifierId })

// Delete modifier
productOptionModifierSchema.statics.deleteModifier = (modifierId) => Modifier.deleteOne({ _id: modifierId })

// Update modifier
productOptionModifierSchema.statics.updateModifier = async (modifierDetails) => {
  const { _id } = modifierDetails
  await Modifier.updateOne({ _id }, modifierDetails)
}

const Modifier = mongoose.model('ProductOptionModifier', productOptionModifierSchema)

module.exports = Modifier

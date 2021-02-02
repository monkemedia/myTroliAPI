const MerchantCategoryCode = require('../models/merchantCategoryCode')

const getMerchantCategoryCodes = async (req, res) => {
  try {
    const codes = await MerchantCategoryCode.findMerchantCategoryCodes()

    res.status(200).send(codes)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getMerchantCategoryCode = async (req, res) => {
  const mcc = req.params.mcc
  
  try {
    const code = await MerchantCategoryCode.findOne({ mcc })
    res.status(200).send(code)
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  getMerchantCategoryCodes,
  getMerchantCategoryCode
}

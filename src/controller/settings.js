const Setting = require('../models/setting')

const getSettings = async (req, res) => {
  const store_hash = req.params.storeHash
  try {
    const settings = await Setting.findSettings(store_hash)

    res.status(200).send(settings)
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateSettings = async (req, res) => {
  const data = req.body
  const store_hash = req.params.storeHash

  try {
    await Setting.updateSettings(data, store_hash)
    const settings = await Setting.findSettings(store_hash)

    res.status(200).send(settings)
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  getSettings,
  updateSettings
}

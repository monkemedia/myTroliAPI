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
  const { type } = data
  const store_hash = req.params.storeHash

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'settings') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

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

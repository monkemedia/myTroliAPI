const Setting = require('../models/setting')

const getSettings = async (req, res) => {
  try {
    const settings = await Setting().findSettings()

    res.status(200).send(settings)
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateSettings = async (req, res) => {
  const data = req.body
  const { type } = data

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
    await Setting().updateSettings(data)
    const settings = await Setting().findSettings()

    res.status(200).send(settings)
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  getSettings,
  updateSettings
}

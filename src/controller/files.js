
const uploadcare = require('uploadcare')(process.env.UPLOADCARE_PUBLIC_KEY, process.env.UPLOADCARE_PRIVATE_KEY)
const fs = require('fs')
const errorHandler = require('../utils/errorHandler')

const uploadFile = (req, res) => {
  const file = req.file
  const type = req.body.type

  if (!file) {
    return res.status(401).send({
      message: 'File is required'
    })
  }

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'file') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  // Upload image to uploadcare
  uploadcare.file.upload(fs.createReadStream(file.path), (error, response) => {
    if (error) {
      return res.status(401).send(errorHandler(401, error))
    }

    // Get file data
    uploadcare.files.info(response.file, (err, info) => {
      if (err) {
        return res.status(401).send(errorHandler(401, error))
      }

      // Remove file from upload directory
      fs.unlink(file.path, (er) => {
        if (er) {
          return res.status(401).send(errorHandler(401, er))
        }
        return res.status(201).send(info)
      })
    })
  })
}

const getFiles = (req, res) => {
  uploadcare.files.list({ page: 1, limit: 100 }, (err, info) => {
    if (err) {
      return res.status(401).send(errorHandler(401, err))
    }
    return res.status(201).send(info)
  })
}

const getFile = (req, res) => {
  const file = req.params.fileId

  uploadcare.files.info(file, (err, info) => {
    if (err) {
      return res.status(401).send(errorHandler(401, err))
    }
    return res.status(201).send(info)
  })
}

const deleteFile = (req, res) => {
  const file = req.params.fileId

  uploadcare.files.remove(file, (err, info) => {
    if (err) {
      return res.status(401).send(errorHandler(401, err))
    }
    return res.status(201).send('File has been deleted')
  })
}

const storeFiles = async (req, res) => {
  const files = req.body

  const promises = files.map(async (id) => {
    return new Promise((resolve, reject) => {
      return uploadcare.files.store(id, (err, info) => {
        if (err) {
          reject(new Error(err))
        }
        resolve(info)
      })
    })
  })

  try {
    const results = await Promise.all(promises)
    res.status(201).send(results)
  } catch (err) {
    res.status(401).send(errorHandler(401, err))
  }
}

module.exports = {
  uploadFile,
  getFiles,
  getFile,
  deleteFile,
  storeFiles
}

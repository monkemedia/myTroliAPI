const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { uploadImage } = require('../controller/image')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

// Upload new image
router.post('/', auth, upload.single('file'), (req, res) => {
  return uploadImage(req, res)
})

module.exports = router

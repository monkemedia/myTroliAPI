const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { uploadImage } = require('../controller/image')

// Upload new image
router.post('/', auth, (req, res) => uploadImage(req, res))

module.exports = router

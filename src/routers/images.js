const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  uploadImage,
  getImages,
  getImage,
  deleteImage,
  storeImages
} = require('../controller/images')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

// Upload new image
router.post('/', auth, upload.single('image'), (req, res) => uploadImage(req, res))

// Get all images
router.get('/', auth, (req, res) => getImages(req, res))

// Get image
router.get('/:imageId', auth, (req, res) => getImage(req, res))

// delete image
router.delete('/:imageId', auth, (req, res) => deleteImage(req, res))

// Store images
router.put('/storage', auth, (req, res) => storeImages(req, res))

module.exports = router

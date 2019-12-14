const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { uploadFile, getFiles, getFile, deleteFile } = require('../controller/files')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

// Upload new file
router.post('/', auth, upload.single('file'), (req, res) => uploadFile(req, res))

// Get all files
router.get('/', auth, (req, res) => getFiles(req, res))

// Get file
router.get('/:fileId', auth, (req, res) => getFile(req, res))

// delete file
router.delete('/:fileId', auth, (req, res) => deleteFile(req, res))

module.exports = router

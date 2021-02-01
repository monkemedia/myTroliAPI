const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  createPayment,
  createAccount,
  updateAccount,
  getAccount,
  getPerson,
  updatePerson,
  uploadFile,
  getPayment,
  updatePayment
} = require('../controller/payments')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

// Create new Payment
router.post('/:storeHash/payments', auth, (req, res) => createPayment(req, res))
// Create account
router.post('/:storeHash/payments/create-account', auth, (req, res) => createAccount(req, res))
//Update account
router.put('/:storeHash/payments/accounts/:accountId', auth, (req, res) => updateAccount(req, res))
//Get account
router.get('/:storeHash/payments/accounts/:accountId', auth, (req, res) => getAccount(req, res))
// Create files
router.post('/:storeHash/payments/accounts/:accountId/upload-file', auth, upload.single('file'), (req, res) => uploadFile(req, res))
//Get person
router.get('/:storeHash/payments/accounts/:accountId/persons/:personId', auth, (req, res) => getPerson(req, res))
//Update person
router.put('/:storeHash/payments/accounts/:accountId/persons/:personId', auth, (req, res) => updatePerson(req, res))
// Get payment
router.get('/:storeHash/payments/:chargeId', auth, (req, res) => getPayment(req, res))
// delete image
router.put('/:storeHash/payments/:chargeId', auth, (req, res) => updatePayment(req, res))

module.exports = router

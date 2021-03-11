const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  createPayment,
  createAccount,
  updateAccount,
  getAccount,
  createPerson,
  getPersons,
  getPerson,
  deletePerson,
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
router.post('/:storeHash/payments/accounts', auth, (req, res) => createAccount(req, res))
// Update account
router.put('/:storeHash/payments/accounts/:accountId', auth, (req, res) => updateAccount(req, res))
// Get account
router.get('/:storeHash/payments/accounts/:accountId', auth, (req, res) => getAccount(req, res))
// Create files
router.post('/:storeHash/payments/accounts/:accountId/upload-file', auth, upload.single('file'), (req, res) => uploadFile(req, res))
// Create person
router.post('/:storeHash/payments/accounts/:accountId/persons', auth, (req, res) => createPerson(req, res))
// Get persons
router.get('/:storeHash/payments/accounts/:accountId/persons', auth, (req, res) => getPersons(req, res))
// Get person
router.get('/:storeHash/payments/accounts/:accountId/persons/:personId', auth, (req, res) => getPerson(req, res))
// Update person
router.put('/:storeHash/payments/accounts/:accountId/persons/:personId', auth, (req, res) => updatePerson(req, res))
// Delete person
router.delete('/:storeHash/payments/accounts/:accountId/persons/:personId', auth, (req, res) => deletePerson(req, res))
// Get payment
router.get('/:storeHash/payments/:paymentIntentId', auth, (req, res) => getPayment(req, res))
// Update image
router.put('/:storeHash/payments/:paymentIntentId', auth, (req, res) => updatePayment(req, res))

module.exports = router

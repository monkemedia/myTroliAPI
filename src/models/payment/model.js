const mongoose = require('mongoose')
const Stripe = require('stripe')
const paymentSchema = require('./schema')
const Store = require('../store')
const fs = require('fs')
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

// Create account
paymentSchema.statics.createAccount = async ({ country, business_type }) => {  
  const account = await stripe.accounts.create({
    type: 'custom',
    capabilities: {
      card_payments: {
        requested: true,
      },
      transfers: {
        requested: true,
      }
    },
    country,
    business_type
  })

  return account
}

// Update account
paymentSchema.statics.updateAccount = async (accountId, data) => {  
  const account = await stripe.accounts.update(accountId, data)

  return account
}

// Get account
paymentSchema.statics.getAccount = async (accountId) => {  
  const account = await stripe.accounts.retrieve(accountId)

  return account
}

// Create person
paymentSchema.statics.createPerson = async (accountId, data) => {  
  const account = await stripe.accounts.createPerson(accountId, data)

  return account
}

// Update person
paymentSchema.statics.updatePerson = async (accountId, personId, data) => {  
  const account = await stripe.accounts.updatePerson(accountId, personId, data)

  return account
}

// Get persons
paymentSchema.statics.getPersons = async (accountId) => {  
  const account = await stripe.accounts.listPersons(accountId)

  return account
}

// Get person
paymentSchema.statics.getPerson = async (accountId, personId) => {  
  const account = await stripe.accounts.retrievePerson(accountId, personId)

  return account
}

// Upload file
paymentSchema.statics.uploadFile = async (accountId, purpose, file) => {  
  console.log('file', file)
  const files = await stripe.files.create({
    purpose,
    file: {
      data: fs.readFileSync(file.path),
      name: file.originalname,
      type: 'application/octet-stream',
    },
  }, {
    stripeAccount: accountId,
  })

  return files
}

// Create payment
paymentSchema.statics.createPayment = async ({ source, receipt_email, currency, amount, store_hash }) => {
  const store = await Store.findOne({ store_hash })
  
  const payment = await Stripe(store.stripe_secret_key).charges.create({
    source,
    receipt_email,
    currency,
    amount,
    store_hash
  })
  return payment
}

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment

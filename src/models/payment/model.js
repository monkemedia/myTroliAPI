const mongoose = require('mongoose')
const Stripe = require('stripe')
const paymentSchema = require('./schema')
const fs = require('fs')
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
const _isEmpty = require('lodash/isEmpty')
const errorHandler = require('../../utils/errorHandler')

// Create account
paymentSchema.statics.createAccount = async ({ country, business_type, client_ip_address }) => {  
  const account = await stripe.accounts.create({
    capabilities: {
      card_payments: {
        requested: true,
      },
      transfers: {
        requested: true,
      }
    },
    tos_acceptance: {
      date: Math.floor(Date.now() / 1000),
      ip: client_ip_address
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
  const person = await stripe.accounts.createPerson(accountId, data)

  return person
}

// Update person
paymentSchema.statics.updatePerson = async (accountId, personId, data) => {  
  const person = await stripe.accounts.updatePerson(accountId, personId, data)

  return person
}

// Get persons
paymentSchema.statics.getPersons = async (accountId) => {  
  const persons = await stripe.accounts.listPersons(accountId)

  const company = {
    directors_provided: true,
    owners_provided: true,
    executives_provided: true
  }

  if (!_isEmpty(company)) {
    await stripe.accounts.update(accountId, { company })
  }

  return persons
}

// Get person
paymentSchema.statics.getPerson = async (accountId, personId) => {  
  const person = await stripe.accounts.retrievePerson(accountId, personId)

  return person
}

// Delete person
paymentSchema.statics.deletePerson = async (accountId, personId) => {  
  const person = await stripe.accounts.deletePerson(accountId, personId)

  return person
}

// Upload file
paymentSchema.statics.uploadFile = async (accountId, purpose, file) => {  
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
paymentSchema.statics.createPayment = async (data) => {
  const { amount, payment_method_id, currency, stripe_account_id } = data
  const _PERCENTAGE = 5 // 5%
  const fee = amount * (parseFloat(_PERCENTAGE) / 100)
  const troliFee = Math.round(fee)

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      payment_method: payment_method_id,
      payment_method_options: {
        card: {
          moto: true
        }
      },
      confirm: true,
      application_fee_amount: troliFee,
      amount,
      currency
    }, { stripeAccount: stripe_account_id })

    return {
      payment_intent_id: paymentIntent.id
    }
  } catch (err) {
    throw errorHandler(422, { message: err.raw.message, code: err.code })
  }
}

// Update bank account
paymentSchema.statics.updateBankAccount = async (accountId, bankAccountId, data) => {  
  const bank = await stripe.accounts.updateExternalAccount(accountId, bankAccountId, data)

  return bank
}

// Delete bank account
paymentSchema.statics.deleteBankAccount = async (accountId, bankAccountId) => {  
  const bank = await stripe.accounts.deleteExternalAccount(accountId, bankAccountId)

  return bank
}

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment

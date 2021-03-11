const mongoose = require('mongoose')
const Stripe = require('stripe')
const paymentSchema = require('./schema')
const fs = require('fs')
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
const _isEmpty = require('lodash/isEmpty')

// Create account
paymentSchema.statics.createAccount = async ({ country, business_type, client_ip_address }) => {  
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
  const stripeAccount = data.stripe_account_id
  const amount = data.amount
  const _PERCENTAGE = 5 // 5%
  const fee = amount * (parseFloat(_PERCENTAGE) / 100)
  const troliFee = Math.round(fee)

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      payment_method_types: ['card'],
      application_fee_amount: troliFee,
      // transfer_data: {
      //   amount: (amount - deductAmount) * 100,
      //   destination: data.stripe_account_id,
      // },
      amount: data.amount,
      currency: data.currency
    }, { stripeAccount })

    return {
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    }
  } catch (err) {
    console.log(err)
  }
}

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment

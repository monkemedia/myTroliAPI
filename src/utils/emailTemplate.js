const postmark = require('postmark')
const postmarkClient = new postmark.ServerClient(process.env.POSTMARK_ID)

module.exports = {
  forgottenPasswordEmail: async (data) => {
    const textBodyUrl = `${process.env.WEB_ADDRESS}/auth/forgotten-password/${data.resetToken}`
    await postmarkClient.sendEmail({
      From: process.env.EMAIL_ADDRESS,
      To: data.email,
      Subject: 'Test',
      TextBody: `Visit ${textBodyUrl}`
    })
  },

  confirmAccount: async (data) => {
    const textBodyUrl = `${process.env.WEB_ADDRESS}/auth/forgotten-password/${data.resetToken}`
    await postmarkClient.sendEmail({
      From: process.env.EMAIL_ADDRESS,
      To: data.email,
      Subject: 'Confirm email address',
      TextBody: `Richard Roberts, You must confirm your ${data.email} email before you can sign in (link is only valid once): ${textBodyUrl}`
    })
  },

  activateAccount: async (data) => {
    const textBodyUrl = `${process.env.WEB_ADDRESS}/auth/activate-account/${data.activateToken}`
    await postmarkClient.sendEmail({
      From: process.env.EMAIL_ADDRESS,
      To: data.email,
      Subject: 'Activate account',
      TextBody: `${data.name}, please activate your account ${textBodyUrl}`
    })
  },

  orderInvoice: async (data) => {
    await postmarkClient.sendEmail({
      From: process.env.EMAIL_ADDRESS,
      To: data.email,
      Subject: 'Order invoice',
      TextBody: 'Thank you for your order'
    })
  },

  verifyEmailAddress: async (data) => {
    const textBodyUrl = `${process.env.WEB_ADDRESS}/verify/${data.token}`
    await postmarkClient.sendEmail({
      From: process.env.EMAIL_ADDRESS,
      To: data.email,
      Subject: 'Verify email address',
      TextBody: `${data.name}, please confirm you email address ${textBodyUrl}`
    })
  }
}

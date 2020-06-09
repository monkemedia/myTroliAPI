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

  orderInvoice: async (data) => {
    await postmarkClient.sendEmail({
      From: process.env.EMAIL_ADDRESS,
      To: data.email,
      Subject: 'Order invoice',
      TextBody: 'Thank you for your order'
    })
  }
}

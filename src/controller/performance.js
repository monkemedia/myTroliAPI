const Order = require('../models/order')
const OrderRefund = require('../models/order/refund')

const { google } = require('googleapis')
const scopes = 'https://www.googleapis.com/auth/analytics.readonly'

const jwt = new google.auth.JWT(process.env.GA_EMAIL_ADDRESS, null, process.env.GA_API_KEY.replace(new RegExp("\\\\n", "\g"), "\n"), scopes)

async function getData(metric, start, end) {
  await jwt.authorize()
  const result = await google.analytics('v3').data.ga.get({
    'auth': jwt,
    'ids': 'ga:235433600',
    'start-date': start,
    'end-date': end,
    'metrics': `ga:${metric}`
  })

  return result
}

const getPercentChange = (currentNumber, previousNumber) => {  
  return parseFloat((((currentNumber - previousNumber) / currentNumber) * 100).toFixed(2))
} 

const getStorePerformance = async (req, res) => {
  try {
    const TRANSACTION_REVENUE = 'transactionRevenue'
    const currentWeekRevenue = await getData(TRANSACTION_REVENUE, '7daysAgo', 'today')
    const lastWeekRevenue = await getData(TRANSACTION_REVENUE, '14daysAgo', '8daysAgo')
    const currentWeekResult = parseFloat(parseFloat(currentWeekRevenue.data.totalsForAllResults['ga:transactionRevenue']).toFixed(2))
    const lastWeekResult = parseFloat(parseFloat(lastWeekRevenue.data.totalsForAllResults['ga:transactionRevenue']).toFixed(2))
    const difference = getPercentChange(currentWeekResult, 41)
    return res.status(200).send({
      current_week_revenue: currentWeekResult,
      last_week_revenue: lastWeekResult,
      difference
    })
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
}

const getStoreRevenue = async (req, res) => {
  try {
    const query = req.query
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 20
    const orders = await Order().findOrders({ page, limit })
    const getRefunds = await OrderRefund().find()
    let totalExcTaxSum = 0
    let totalIncTaxSum = 0
    let shippingCostExcTaxSum = 0
    let shippingCostIncTaxSum = 0
    let refundedAmount = 0

    orders.data.map(order => {
      totalExcTaxSum += order.total_exc_tax
      totalIncTaxSum += order.total_inc_tax
      shippingCostExcTaxSum += order.shipping_cost_exc_tax
      shippingCostIncTaxSum += order.shipping_cost_inc_tax
    })

    getRefunds.map((refund) => {
      refundedAmount += refund.payment.amount
    })

    res.status(200).send({
      total_exc_tax: totalExcTaxSum,
      total_inc_tax: totalIncTaxSum,
      shipping_cost_exc_tax: shippingCostExcTaxSum,
      shipping_cost_inc_tax: shippingCostIncTaxSum,
      refunded_amount: refundedAmount
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  getStorePerformance,
  getStoreRevenue
}

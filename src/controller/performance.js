const Order = require('../models/order')
const OrderRefund = require('../models/order/refund')

const { google } = require('googleapis')
const scopes = 'https://www.googleapis.com/auth/analytics.readonly'

const jwt = new google.auth.JWT(process.env.GA_EMAIL_ADDRESS, null, process.env.GA_API_KEY.replace(new RegExp("\\\\n", "\g"), "\n"), scopes)

const getPercentChange = (currentNumber, previousNumber) => {  
  return parseFloat((((currentNumber - previousNumber) / currentNumber) * 100).toFixed(2))
} 

let i = 0

async function getData({ name, id, metric, dimensions, filters, start, end }) {
  await setTimeout[Object.getOwnPropertySymbols(setTimeout)[0]](
    Math.trunc(1000 * Math.random()),
  ) // 3 sec
  await jwt.authorize()
  const result = await google.analytics('v3').data.ga.get({
    'auth': jwt,
    'ids': `ga:${id}`,
    'start-date': start,
    'end-date': end,
    'metrics': metric,
    'dimensions': dimensions,
    'filters': filters
  })

  const res = {}
  res[name] = {
    value: Math.round(result.data.totalsForAllResults[metric] * 100) / 100,
    start,
    end,
  }
  return res
}

const getStorePerformance = async (req, res) => {
  try {
    const promises = []
    const ECOMMERCE_ID = '235433600'
    const TRANSACTIONS = 'ga:transactions'
    const TRANSACTION_REVENUE = 'ga:transactionRevenue'
    const data = [
      {
        name: 'revenue_current',
        id: ECOMMERCE_ID,
        metric: TRANSACTION_REVENUE,
        start: '7daysAgo',
        end: 'today'
      },
      {
        name: 'revenue_previous',
        id: ECOMMERCE_ID,
        metric: TRANSACTION_REVENUE,
        start: '14daysAgo',
        end: '8daysAgo'
      },
      {
        name: 'transactions_current',
        id: ECOMMERCE_ID,
        metric: TRANSACTIONS,
        start: '7daysAgo',
        end: 'today'
      },
      {
        name: 'transactions_previous',
        id: ECOMMERCE_ID,
        metric: TRANSACTIONS,
        start: '14daysAgo',
        end: '8daysAgo'
      },
      {
        name: 'conversion_current',
        id: ECOMMERCE_ID,
        metric: 'ga:transactionsPerSession',
        start: '7daysAgo',
        end: 'today'
      },
      {
        name: 'conversion_previous',
        id: ECOMMERCE_ID,
        metric: 'ga:transactionsPerSession',
        start: '14daysAgo',
        end: '8daysAgo'
      },
      {
        name: 'registations_current',
        id: ECOMMERCE_ID,
        metric: 'ga:totalEvents',
        start: '7daysAgo',
        end: 'today',
        dimensions: 'ga:eventAction',
        filters: 'ga:eventAction==registration'
      },
      {
        name: 'registations_previous',
        id: ECOMMERCE_ID,
        metric: 'ga:totalEvents',
        start: '14daysAgo',
        end: '8daysAgo',
        dimensions: 'ga:eventAction',
        filters: 'ga:eventAction==registration'
      },
      {
        name: 'visits_current',
        id: ECOMMERCE_ID,
        metric: 'ga:totalEvents',
        start: '14daysAgo',
        end: '8daysAgo',
        dimensions: 'ga:eventAction',
        filters: 'ga:eventAction==registration'
      },
    ]
    
    data.forEach(el => {
      promises.push(getData(el))
    })

    const promise = await Promise.all(promises)
    console.log('promise', promise)
    // console.log(getCurrentWeek)
    // const getPreviousWeek = await getData('235433600', `${TRANSACTION_REVENUE}, ${TRANSACTIONS}`, '14daysAgo', '8daysAgo')
    // const getOrderCurrentWeek = await getData('235500072', 'ga:users', '7daysAgo', 'today')

    // console.log('poo', getOrderCurrentWeek)
    // const currentWeekRevenue = parseFloat(parseFloat(getCurrentWeek.data.totalsForAllResults[TRANSACTION_REVENUE]).toFixed(2))
    // const previousWeekRevenue = parseFloat(parseFloat(getPreviousWeek.data.totalsForAllResults[TRANSACTION_REVENUE]).toFixed(2))
    // const currentWeekOrders = parseFloat(getCurrentWeek.data.totalsForAllResults[TRANSACTIONS])
    // const previousWeekOrders = parseFloat(getPreviousWeek.data.totalsForAllResults[TRANSACTIONS])
    // return res.status(200).send({
    //   revenue: {
    //     current_week: currentWeekRevenue,
    //     previous_week: previousWeekRevenue,
    //     difference: getPercentChange(currentWeekRevenue, previousWeekRevenue)
    //   },
    //   orders: {
    //     current_week: currentWeekOrders,
    //     previous_week: previousWeekOrders,
    //     difference: getPercentChange(currentWeekOrders, previousWeekOrders)
    //   },
    //   getCurrentWeek

    // })
    return res.status(200).send(promise)
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
}

// const getStorePerformance = async (req, res) => {
//   try {
//     const TRANSACTIONS = 'ga:transactions'
//     const TRANSACTION_REVENUE = 'ga:transactionRevenue'
//     console.log('triggered')
//     const getCurrentWeekRevenue = await getData(TRANSACTION_REVENUE, '7daysAgo', 'today')
//     console.log(1)
//     const getPreviousWeekRevenue = await getData(TRANSACTION_REVENUE, '14daysAgo', '8daysAgo')
//     console.log(2)
//     const getCurrentWeekOrder = await getData(TRANSACTIONS, '7daysAgo', 'today')
//     console.log('poo', getCurrentWeekOrder)
//     const getPreviousWeekOrder = await getData(TRANSACTIONS, '14daysAgo', '8daysAgo')
//     console.log(4)
 
//     const currentWeekRevenue = parseFloat(parseFloat(getCurrentWeekRevenue.data.totalsForAllResults[TRANSACTION_REVENUE]).toFixed(2))
//     const previousWeekRevenue = parseFloat(parseFloat(getPreviousWeekRevenue.data.totalsForAllResults[TRANSACTION_REVENUE]).toFixed(2))
//     const currentWeekOrders = parseFloat(getCurrentWeekOrder.data.totalsForAllResults[TRANSACTIONS])
//     const previousWeekOrders = parseFloat(getPreviousWeekOrder.data.totalsForAllResults[TRANSACTIONS])
//     return res.status(200).send({
//       revenue: {
//         current_week: currentWeekRevenue,
//         previous_week: previousWeekRevenue,
//         difference: getPercentChange(currentWeekRevenue, previousWeekRevenue)
//       },
//       orders: {
//         current_week: currentWeekOrders,
//         previous_week: previousWeekOrders,
//         difference: getPercentChange(currentWeekOrders, previousWeekOrders)
//       }

//     })
//   } catch (err) {
//     console.log(err)
//     res.status(400).send(err)
//   }
// }

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

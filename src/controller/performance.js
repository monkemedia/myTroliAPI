const { google } = require('googleapis')
const scopes = 'https://www.googleapis.com/auth/analytics.readonly'
const getPercentChange = require('../utils/helpers').getPercentChange

const jwt = new google.auth.JWT(process.env.GA_EMAIL_ADDRESS, null, process.env.GA_API_KEY.replace(new RegExp("\\\\n", "\g"), "\n"), scopes)

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

  let res = {}
  res = {
    value: Math.round(result.data.totalsForAllResults[metric] * 100) / 100,
    metric,
    name,
    start,
    end,
  }
  return res
}

const getStorePerformance = async (req, res) => {
  try {
    const promises = []
    const ECOMMERCE_ID = process.env.GA_ECOMMERCE_ID
    const TRANSACTIONS = 'ga:transactions'
    const TRANSACTION_REVENUE = 'ga:transactionRevenue'
    const data = [
      {
        name: 'revenue',
        id: ECOMMERCE_ID,
        metric: TRANSACTION_REVENUE,
        start: '7daysAgo',
        end: 'today'
      },
      {
        name: 'revenue',
        id: ECOMMERCE_ID,
        metric: TRANSACTION_REVENUE,
        start: '14daysAgo',
        end: '8daysAgo'
      },
      {
        name: 'transactions',
        id: ECOMMERCE_ID,
        metric: TRANSACTIONS,
        start: '7daysAgo',
        end: 'today'
      },
      {
        name: 'transactions',
        id: ECOMMERCE_ID,
        metric: TRANSACTIONS,
        start: '14daysAgo',
        end: '8daysAgo'
      },
      {
        name: 'conversion',
        id: ECOMMERCE_ID,
        metric: 'ga:transactionsPerSession',
        start: '7daysAgo',
        end: 'today'
      },
      {
        name: 'conversion',
        id: ECOMMERCE_ID,
        metric: 'ga:transactionsPerSession',
        start: '14daysAgo',
        end: '8daysAgo'
      },
      {
        name: 'registrations',
        id: ECOMMERCE_ID,
        metric: 'ga:totalEvents',
        start: '7daysAgo',
        end: 'today',
        dimensions: 'ga:eventAction',
        filters: 'ga:eventAction==registration'
      },
      {
        name: 'registrations',
        id: ECOMMERCE_ID,
        metric: 'ga:totalEvents',
        start: '14daysAgo',
        end: '8daysAgo',
        dimensions: 'ga:eventAction',
        filters: 'ga:eventAction==registration'
      }
    ]
    
    data.forEach(el => {
      promises.push(getData(el))
    })

    const promise = await Promise.all(promises)

    const obj = {}
    promise.forEach(({ value, name }) => {
      if (obj[name]) {
        obj[name].previous = value
        obj[name].difference = getPercentChange(obj[name].current, value)
      } else {
        obj[name] = {
          current: value
        }
      }
    })

    return res.status(200).send(obj)
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
}

module.exports = {
  getStorePerformance
}

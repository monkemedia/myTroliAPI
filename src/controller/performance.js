const { google } = require('googleapis')
const moment = require('moment')
const scopes = 'https://www.googleapis.com/auth/analytics.readonly'
const { getPercentChange } = require('../utils/helpers')

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
    value: result.data.totalsForAllResults[metric],
    rows: result.data.rows,
    metric,
    name,
    start,
    end
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
        end: 'today',
        dimensions: 'ga:date' // Gets values per day for chart plotting
      },
      {
        name: 'revenue',
        id: ECOMMERCE_ID,
        metric: TRANSACTION_REVENUE,
        start: '14daysAgo',
        end: '8daysAgo',
        dimensions: 'ga:date'
      },
      {
        name: 'transactions',
        id: ECOMMERCE_ID,
        metric: TRANSACTIONS,
        start: '7daysAgo',
        end: 'today',
        dimensions: 'ga:date'
      },
      {
        name: 'transactions',
        id: ECOMMERCE_ID,
        metric: TRANSACTIONS,
        start: '14daysAgo',
        end: '8daysAgo',
        dimensions: 'ga:date'
      },
      {
        name: 'conversion',
        id: ECOMMERCE_ID,
        metric: 'ga:transactionsPerSession',
        start: '7daysAgo',
        end: 'today',
        dimensions: 'ga:date'
      },
      {
        name: 'conversion',
        id: ECOMMERCE_ID,
        metric: 'ga:transactionsPerSession',
        start: '14daysAgo',
        end: '8daysAgo',
        dimensions: 'ga:date'
      },
      {
        name: 'customers',
        id: ECOMMERCE_ID,
        metric: 'ga:totalEvents',
        start: '7daysAgo',
        end: 'today',
        dimensions: 'ga:eventAction',
        filters: 'ga:eventAction==registration',
        dimensions: 'ga:date'
      },
      {
        name: 'customers',
        id: ECOMMERCE_ID,
        metric: 'ga:totalEvents',
        start: '14daysAgo',
        end: '8daysAgo',
        dimensions: 'ga:eventAction',
        filters: 'ga:eventAction==registration',
        dimensions: 'ga:date'
      }
    ]
    
    data.forEach(el => {
      promises.push(getData(el))
    })

    const promise = await Promise.all(promises)

    const obj = {}
    promise.forEach(({ value, name, rows }) => {
      const [series, categories] = mapSeries(rows)
      const val = isMoney(value, name)
      if (obj[name]) {
        obj[name].previous = val
        obj[name].difference = getPercentChange(obj[name].current, val)
      } else {
        obj[name] = {
          current: val,
          series: series,
          categories: categories
        }
      }
    })

    function mapSeries (rows) {
      const categories = []
      const series = []
      rows.forEach(row => {
        const [category, data] = row
        categories.push(moment(category))
        series.push(Math.round(data * 100) / 100)

      })
      return [series, categories]
    }

    function isMoney (val, n) {
      if (n === 'revenue') {
        return val * 100
      }
      return val
    }

    return res.status(200).send(obj)
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
}

module.exports = {
  getStorePerformance
}

const { Router } = require('express')
const merchants = require('./merchants.js')
const customers = require('./customers/index.js')
const customerAddresses = require('./customers/addresses/index.js')
const customerCoupons = require('./customers/coupons/index.js')
const countries = require('./countries.js')
const currencies = require('./currencies.js')
const products = require('./products/index.js')
const coupons = require('./coupons.js')
const categories = require('./categories.js')
const brands = require('./brands.js')
const variations = require('./variations.js')
const images = require('./images.js')
const store = require('./store.js')
const shippingAddress = require('./shipping/address/index.js')
const shippingZones = require('./shipping/zones/index.js')
const shippingMethods = require('./shipping/zones/methods/index.js')
const settings = require('./settings.js')
const payments = require('./payments.js')
const productVariants = require('./products/variants/index.js')
const productVariantImages = require('./products/variants/images/index.js')
const productOptions = require('./products/options/index.js')
const productImages = require('./products/images/index.js')
const productCustomFields = require('./products/customFields/index.js')
const productReviews = require('./products/reviews/index.js')
const productFiltering = require('./productFiltering.js')
const performance = require('./performance.js')
const orders = require('./orders/index.js')
const orderStatus = require('./orders/status/index.js')
const orderRefunds = require('./orders/refunds/index.js')

const router = Router()

router.use(
  merchants,
  customers,
  coupons,
  customerAddresses,
  customerCoupons,
  countries,
  currencies,
  productReviews,
  products,
  categories,
  brands,
  variations,
  store,
  images,
  shippingAddress,
  shippingZones,
  shippingMethods,
  settings,
  payments,
  productVariants,
  productVariantImages,
  productOptions,
  productImages,
  productCustomFields,
  productFiltering,
  performance,
  orders,
  orderStatus,
  orderRefunds
)

module.exports = router

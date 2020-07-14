const CustomerCoupon = require('../../../models/customer/coupon')

const createCustomerCoupon = async (req, res) => {
  const data = req.body
  const {
    type,
    coupon_id
  } = data
  const customer_id = req.params.customerId

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'customer-coupon') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (!coupon_id) {
    return res.status(401).send({
      message: 'Coupon Id is required'
    })
  }

  try {
    const customerCoupon = new CustomerCoupon({
      ...data,
      customer_id,
      uses: 1
    })

    await customerCoupon.save()

    res.status(201).send(customerCoupon)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCustomerCoupons = async (req, res) => {
  try {
    const customerId = req.params.customerId
    const customerCoupons = await CustomerCoupon.findCustomerCoupons(customerId)

    res.status(200).send(customerCoupons)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCustomerCoupon = async (req, res) => {
  try {
    const customerId = req.params.customerId
    const couponId = req.params.couponId
    const customerCoupon = await CustomerCoupon.findCustomerCoupon(customerId, couponId)

    res.status(200).send(customerCoupon)
  } catch (err) {
    res.status(400).send(err)
  }
}

const incrementCustomerCoupon = async (req, res) => {
  const customerId = req.params.customerId
  const couponId = req.params.couponId

  try {
    await CustomerCoupon.incrementCustomerCoupon(customerId, couponId)
    const customerCoupon = await CustomerCoupon.findCustomerCoupon(customerId, couponId)

    res.status(200).send(customerCoupon)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteCustomerCoupon = async (req, res) => {
  try {
    const couponId = req.params.couponId

    await CustomerCoupon.deleteCustomerCoupon(couponId)

    res.status(200).send({
      message: 'Customer coupon successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createCustomerCoupon,
  getCustomerCoupons,
  getCustomerCoupon,
  incrementCustomerCoupon,
  deleteCustomerCoupon
}

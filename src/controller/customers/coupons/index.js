const CustomerCoupon = require('../../../models/customer/Coupon')

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

// const getCustomerCoupons = async (req, res) => {
//   try {
//     const customerId = req.params.customerId
//     const customerAddresses = await CustomerAddress.findCustomerAddresses(customerId)

//     res.status(200).send(customerAddresses)
//   } catch (err) {
//     res.status(400).send(err)
//   }
// }

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

// const updateCustomerAddress = async (req, res) => {
//   const addressId = req.params.addressId
//   const data = req.body
//   const { type } = data

//   if (!type) {
//     return res.status(401).send({
//       message: 'Type is required'
//     })
//   }

//   if (type && type !== 'customer-address') {
//     return res.status(401).send({
//       message: 'Correct Type is required'
//     })
//   }

//   try {
//     await CustomerAddress.updateCustomerAddress(addressId, data)
//     const customerAddress = await CustomerAddress.findCustomerAddress(addressId)

//     res.status(200).send(customerAddress)
//   } catch (err) {
//     res.status(400).send(err)
//   }
// }

// const deleteCustomerAddress = async (req, res) => {
//   try {
//     const addressId = req.params.addressId
//     await CustomerAddress.deleteCustomerAddress(addressId)

//     res.status(200).send({
//       message: 'Customer Address successfully deleted'
//     })
//   } catch (err) {
//     res.status(400).send(err)
//   }
// }

module.exports = {
  createCustomerCoupon,
  getCustomerCoupon
  // getCustomerAddresses,
  // getCustomerAddress,
  // updateCustomerAddress,
  // deleteCustomerAddress
}

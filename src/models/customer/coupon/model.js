const mongoose = require('mongoose')
const customerCouponSchema = require('./schema')

// Find coupon
// customerAddressSchema.statics.findCustomerAddresses = async (customerId) => {
//   const addresses = await CustomerAddress.find({ customer_id: customerId })
//   return addresses
// }

// Find address
customerCouponSchema.statics.findCustomerCoupon = async (customerId, couponId) => {
  const coupon = await CustomerCoupon.findOne({
    customer_id: customerId,
    coupon_id: couponId
  })
  return coupon
}

// // Update address
// customerAddressSchema.statics.updateCustomerAddress = async (addressId, addressDetails) => {
//   const address = await CustomerAddress.updateOne({ _id: addressId }, addressDetails)
//   return address
// }

// // Delete address
// customerAddressSchema.statics.deleteCustomerAddress = async (addressId) => {
//   const address = await CustomerAddress.deleteOne({ _id: addressId })
//   return address
// }

const CustomerCoupon = mongoose.model('CustomerCoupon', customerCouponSchema)

module.exports = CustomerCoupon

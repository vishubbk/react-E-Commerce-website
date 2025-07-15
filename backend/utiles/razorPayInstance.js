require("dotenv").config(); // 🔥 Must be first line
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: `rzp_test_SmOFvblhVOWFhS`,
  key_secret:`ZpLW3lvMfYid34jaMEPDK59W`,
});

module.exports = { razorpay };

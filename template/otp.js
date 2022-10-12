const sms = require("../config/common").sms;

module.exports = {
  userRegistration({ company_name, OTP, time_in_min }) {
    return `
            Hello your OTP for LMS is ${OTP}. It is valid for 10 minutes.Thankyou. Team ${sms.company_name} 
        `;
  },
  numberUpdate({ customer_name, OTP, company_name }) {
    return `
            Hello ${customer_name}, your OTP to update your Mobile Number is: ${OTP}, Thank you. Team ${sms.company_name}
        `;
  },
  paymentVerification({ customer_name, company_name, OTP }) {
    return `
            Hello ${customer_name}, your OTP to complete the payment Process is: ${OTP}, Thank you. Team ${sms.company_name}
        `;
  },
};

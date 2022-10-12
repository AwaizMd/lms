const { accountSid, authToken, twilioNumber } = require("../config/env").twilio;
const client = require("twilio")(accountSid, authToken);

module.exports = {
  async sendSms({ number, msg }) {
    client.messages
      .create({
        body: msg,
        to: number, // Text this number
        from:"+16094731013", // From a valid Twilio number
      })
      .then((message) =>
        console.log("Your otp is sent successfully!!!!!!!!", message)
      )
      .catch((err) => {
        console.log("Error", err);
      });
  },
};

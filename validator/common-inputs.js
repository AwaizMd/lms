const Joi = require("joi");

const inputRequests = {
  signIn: {
    contactNumber: Joi.number().required(),
    password: Joi.string().required(),
  },
  verifyOtp: {
    contactNumber: Joi.string().required(),
    otp: Joi.string().required(),
  },
  signUp: {
    id: Joi.allow(),
    firstName: Joi.string().required(),
    email: Joi.string().required(),
    lastName: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    contactNumber: Joi.number().required(),
    dob: Joi.string().required(),
    password: Joi.string().required(),
    userType: Joi.string(),
  },
  editProfile: {
    firstName: Joi.string(),
    email: Joi.string(),
    lastName: Joi.string(),
    state: Joi.string(),
    city: Joi.string(),
    phone: Joi.number(),
    password: Joi.string(),
    dob: Joi.string(),
    step: Joi.string().required()
  }
};

module.exports = inputRequests;

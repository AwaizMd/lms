const Joi = require('joi');

const inputRequests = {
  
};

const validateRequestInput = (object, templateName) => {
  const schema = Joi.object().keys(inputRequests[templateName]);
  const isValid = schema.validate(object);
  if (isValid.hasOwnProperty('error')) {
    return isValid.error;
  }
  return false;
};

module.exports = { validateRequestInput };

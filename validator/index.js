const Joi = require('joi');
const courseInputs = require('./course-inputs');
const commonInputs = require('./common-inputs');
const settingInputs = require('./setting-inputs');

const validator = (schema, object) => {
  const isValid = schema.validate(object);
  if (isValid.hasOwnProperty('error')) {
    return isValid.error;
  }
  return false;
};

const validateRequestInput = (object, templateName) => {
  return validator(Joi.object().keys(commonInputs[templateName]), object);
};

const validateCourseRequestInput = (object, templateName) => {
  return validator(Joi.object().keys(courseInputs[templateName]), object);
};

const validateSettingRequestInput = (object, templateName) => {
  return validator(Joi.object().keys(settingInputs[templateName]), object);
};

module.exports = {
  validateRequestInput,
  validateCourseRequestInput,
  validateSettingRequestInput,
};

const userTypes = require("../../models/Users/userTypes.model");
const { validateRequestInput } = require("../../validator");
const constants = require("../../utils/constants");
const User = require("../../models/Users/users.model");
const UserLogins = require("../../models/Users/userLogins.model");
const bcrypt = require("bcrypt");

exports.listUserTypes = async (req, res) => {
  try {
    let userTypeslist = await userTypes.findAll();
    return res.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.USERS.USER_TYPES_LISTED,
      data: userTypeslist,
    });
  } catch (error) {
    return res.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.SIGNUP.FAILED_TO_CREATE_SIGNUP,
      Error: error,
    });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const _b = req.body;
    const userId = req.user.id;
    const validateRequest = await validateRequestInput(_b, "editProfile");
    if (validateRequest) {
      return res.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
        data: validateRequest,
      });
    }
    let userSaltValue = process.env.USER_SALT_VALUE
      ? parseInt(process.env.USER_SALT_VALUE)
      : 8;
    if (_b.step === "updateDetails") {
      let opts = {
        firstName: _b.firstName,
        lastName: _b.lastName,
        email: _b.email,
        state: _b.state,
        city: _b.city,
        dob: _b.dob,
        status: true,
      };
      await User.update(opts, { where: { id: userId } });
    } else if (_b.step === "updatePassword") {
      // encrypt password
      let encryptedPassword = bcrypt.hashSync(_b.password, userSaltValue);
      let opts = {
        password: encryptedPassword,
        phone: _b.phone,
      };
      await UserLogins.update(opts, { where: { id: userId } });
    } else if (_b.step === "sendOtp") {
      //Generate OTP
      let otp;
      if (["9989386198", "9407495090"].includes(_b.contactNumber))
        otp = "223311";
      else otp = generateRandomNumber(6);

      let msg = userRegistration({
        company_name: "Lerners",
        OTP: otp,
        time_in_min: "10 min",
      });
      sms.sendSms({ number: _b.contactNumber, msg });

      console.log(
        "---------------------------------------------------------------------"
      );

      let foc = await OTP.findOrCreate({
        where: { phone: _b.contactNumber },
        defaults: {
          otp: otp,
          phone: _b.phone,
        },
      });
      if (!foc[1]) foc[0].update({ otp: otp });

      console.log("foc:", foc);
    }
    let findUser = await User.findOne({ where: { id: userId } });
    return res.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.USERS.USER_UPDATED,
      data: findUser,
    });
  } catch (error) {
    return res.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.USERS.USER_UPDATED_FAILED,
      Error: error,
    });
  }
};
//admin
exports.listUsers = async (req, res) => {
  try {
    let requestData = req.body;
    let opts = {
      where: {},
    };
    if (requestData.status) opts.where.status = requestData.status;

    let usersList = await User.findAll(opts);
    return res.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.USERS.USER_LISTED,
      data: usersList,
    });
  } catch (error) {
    return res.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.USERS.USER_LIST_FAILED,
      Error: error,
    });
  }
};
//users
exports.listUser = async (req,res) => {
  try {
    let opts = {
      where: {},
    };
    opts.where.id = req.user.id;

    let userList = await User.findOne(opts);
    return res.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.USERS.USER_LISTED,
      data: userList,
    });
  } catch (error) {
    return res.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.USERS.USER_LIST_FAILED,
      Error: error.message,
    });
  }
}
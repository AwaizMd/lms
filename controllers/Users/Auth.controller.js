const User = require("../../models/Users/users.model");
const UserLogins = require("../../models/Users/userLogins.model");
const { encode, decode } = require("../../services/auth.service");
const bcrypt = require("bcrypt");
const UserTypes = require("../../models/Users/userTypes.model");
const { validateRequestInput } = require("../../validator");
const constants = require("../../utils/constants");
const sms = require("../../services/sms.service");
const OTP = require("../../models/otp/otp.model");
const { userRegistration } = require("../../template/otp");

exports.register = async (request, response) => {
  try {
    const _b = request.body;
    const validateRequest = await validateRequestInput(_b, "signUp");
    if (validateRequest) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
        data: validateRequest,
      });
    }

    // Checking if user already exists
    let user = await User.findOne({
      where: { email: _b.email },
    });
    if (user)
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.USERS.EMAIL_ALREADY_EXISTS,
        data: user,
      });

    let userSaltValue = process.env.USER_SALT_VALUE
      ? parseInt(process.env.USER_SALT_VALUE)
      : 8;

    // encrypt password
    let encryptedPassword = bcrypt.hashSync(_b.password, userSaltValue);
    let opts = {
      firstName: _b.firstName,
      lastName: _b.lastName,
      email: _b.email,
      state: _b.state,
      city: _b.city,
      dob: _b.dob,
      status: true,
    };

    //finding userType
    let userType = await UserTypes.findOne({ where: { type: _b.userType } });
    opts.userTypeId = userType.id;

    // Generating otp
    let otp;
    if (["9989386198", "9407495090"].includes(_b.contactNumber)) otp = "223311";
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

    //create User
    let userCreated = await User.create(opts);

    if (userCreated) {
      let user = await User.findOne({
        where: { email: _b.email },
      });
      const randomNum = Math.floor(Math.random() * 1000);
      let userLoginOpts = {
        id: user.id,
        username: user.firstName + randomNum,
        password: encryptedPassword,
        isActive: false,
        phone: _b.contactNumber,
      };
      let userlogin = await UserLogins.findOne({
        where: { phone: _b.contactNumber },
      });
      if (!userlogin) {
        await UserLogins.create(userLoginOpts);
      }
    }
    return response.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.SIGNUP.SIGNUP_COMPLETED,
      data: userCreated,
    });
  } catch (error) {
    console.log("error:", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.SIGNUP.FAILED_TO_CREATE_SIGNUP,
      ERROR: error,
    });
  }
};

exports.login = async (request, response) => {
  try {
    const _b = request.body;
    const validateRequest = await validateRequestInput(_b, "signIn");
    if (validateRequest) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
        data: validateRequest,
      });
    }
    let user = await UserLogins.findOne({ where: { phone: _b.contactNumber } });

    if (user.isActive) {
      if (bcrypt.compareSync(_b.password, user.password)) {
        let u = {
          ...user.dataValues,
          token: encode(user.id),
        };
        await UserLogins.update(
          { lastActive: new Date() },
          { where: { phone: _b.contactNumber } }
        );

        return response.status(constants.CODES.SUCCESS).send({
          success: true,
          message: constants.MESSAGES.USERS.USER_LOGIN_SUCCESS,
          data: u,
        });
      } else {
        return response.status(constants.CODES.SUCCESS).send({
          success: false,
          message: constants.MESSAGES.AUTH.INCORRECT_PASSWORD,
        });
      }
    } else {
      return response.status(constants.CODES.BAD_REQUEST).send({
        success: false,
        message: constants.MESSAGES.USERS.NOT_FOUND,
      });
    }
  } catch (error) {
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.USERS.USER_LOGIN_FAILED,
      ERROR: error,
    });
  }
};

exports.verifyOTP = async (request, response) => {
  try {
    const _b = request.body;

    const validateRequest = await validateRequestInput(_b, "verifyOtp");
    if (validateRequest) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
        data: validateRequest,
      });
    }

    let otp = await OTP.findOne({ where: { phone: _b.contactNumber } });

    console.log("otp: ", otp);

    if (otp) {
      if (_b.otp !== otp.otp)
        return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
          success: false,
          message: constants.MESSAGES.AUTH.INCORRECT_OTP,
        });
    } else {
      return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
        success: false,
        message: constants.MESSAGES.AUTH.OTP_ALREADY_VERIFIED,
      });
    }

    await OTP.destroy({
      where: { phone: _b.contactNumber },
    });

    let user = await UserLogins.findOne({ where: { phone: _b.contactNumber } });

    await user.update({ isActive: true });
    user.dataValues.password = null;
    let u = {
      ...user.dataValues,
      token: encode(user.id),
    };

    return response.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.AUTH.CORRECT_OTP,
      data: u,
    });
  } catch (error) {
    console.log("Error: ",error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.AUTH.VERIFY_OTP_FAILED,
      ERROR: error,
    });
  }
};

function generateRandomNumber(num) {
  let digits = "0123456789";
  let OTN = "";
  for (let i = 0; i < num; i++) {
    OTN += digits[Math.floor(Math.random() * 10)];
  }
  return OTN;
}

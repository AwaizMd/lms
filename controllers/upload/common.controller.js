const fs = require("fs");
const { isEmpty } = require("lodash");
const constants = require("../../utils/constants");
const {
  uploadFileToS3,
  getS3Key,
  getSignedURL,
} = require("../../utils/s3.services");
const {
  FILE_UPLOAD_CATEGORY,
  ACCEPTED_FILE_EXTENTIONS,
} = require("../../utils/common.constants");
const UserTypes = require("../../models/Users/userTypes.model");
const Users = require("../../models/Users/users.model");

const uploadFile = async (request, response) => {
  try {
    const requestData = request.body;
    let fileName = "";
    if (
      isEmpty(requestData.category) ||
      (!isEmpty(requestData.category) &&
        !FILE_UPLOAD_CATEGORY.includes(requestData.category))
    ) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.S3.INVALID_CATEGORY,
      });
    }
    if (request.file && request.file.originalname) {
      fileName = request.file.originalname;
      const fileExtension = fileName.split(".").pop();
      if (!ACCEPTED_FILE_EXTENTIONS.includes(fileExtension)) {
        return response.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.S3.INVALID_FILE_EXTENSION,
        });
      }
    }
    //finding the userTypes(roles)
    const roleDetails = await UserTypes.findOne({
      where: { id: request.user.userTypeId },
    });
    // ------
    if (!roleDetails) {
      return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
        success: false,
        message: constants.MESSAGES.ROLES.TYPE_INVALID,
      });
    }
    roleCodeFolder = roleDetails.type;

    let userCode = request.user.id + request.user.firstName;
    const fileBuffer = fs.createReadStream(request.file.path);
    const filePath = userCode
      ? `${roleCodeFolder}/${userCode}/${requestData.category.toLowerCase()}/${Math.round(
          new Date().getTime() / 1000
        )}_${fileName.replace(" ", "_")}`
      : "";
    const uploadedFileData = await uploadFileToS3(filePath, fileBuffer);
    if (uploadedFileData) {
      fs.unlinkSync(request.file.path);
      const fileDetails = getS3Key(uploadedFileData.Location);
      const signedUrl = await getSignedURL(fileDetails.key, "download");
      return response.status(constants.CODES.SUCCESS).send({
        success: true,
        message: constants.MESSAGES.S3.FILE_UPLOADED,
        fileUrl: uploadedFileData.Location,
        signedUrl: signedUrl,
      });
    } else {
      return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
        success: false,
        message: constants.MESSAGES.S3.FILE_UPLOAD_FAILED,
      });
    }
  } catch (error) {
    console.log(error);
    response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: error.message,
    });
  }
};

const uploadCourseFile = async (request, response) => {
  try {
    const requestData = request.body;
    let fileName = "";
    if (
      isEmpty(requestData.category) ||
      (!isEmpty(requestData.category) &&
        !FILE_UPLOAD_CATEGORY.includes(requestData.category))
    ) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.S3.INVALID_CATEGORY,
      });
    }
    if (request.file && request.file.originalname) {
      fileName = request.file.originalname;
      const fileExtension = fileName.split(".").pop();
      if (!ACCEPTED_FILE_EXTENTIONS.includes(fileExtension)) {
        return response.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.S3.INVALID_FILE_EXTENSION,
        });
      }
    }

    const roleDetails = await UserTypes.findOne({
      where: { id: request.user.userTypeId },
    });

    let roleCodeFolder = "";
    if (!roleDetails) {
      return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
        success: false,
        message: constants.MESSAGES.ROLES.TYPE_INVALID,
      });
    }
    roleCodeFolder = roleDetails.type;

    let userCode = request.user.id;

    const userDetails = await Users.findOne({
      where: { id: userCode },
    });

    const fileBuffer = fs.createReadStream(request.file.path);
    const filePath = userCode
      ? `${roleCodeFolder}/${userCode}/${requestData.category.toLowerCase()}/${Math.round(
          new Date().getTime() / 1000
        )}_${fileName.replace(" ", "_")}`
      : "";
    const uploadedFileData = await uploadFileToS3(filePath, fileBuffer);
    if (uploadedFileData) {
      fs.unlinkSync(request.file.path);
      const fileDetails = getS3Key(uploadedFileData.Location);
      const signedUrl = await getSignedURL(fileDetails.key, "download");
      return response.status(constants.CODES.SUCCESS).send({
        success: true,
        message: constants.MESSAGES.S3.FILE_UPLOADED,
        fileUrl: uploadedFileData.Location,
        signedUrl: signedUrl,
      });
    } else {
      return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
        success: false,
        message: constants.MESSAGES.S3.FILE_UPLOAD_FAILED,
      });
    }
  } catch (error) {
    console.log(error);
    response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadFile,
  uploadCourseFile,
};

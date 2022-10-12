const Content = require("../../models/Course/courseContent.model");
const { validateCourseRequestInput } = require("../../validator");
const constants = require("../../utils/constants");

exports.add = async (request, response) => {
  try {
    const requestData = request.body;
    const validateRequest = await validateCourseRequestInput(
      requestData,
      "addContent"
    );
    if (validateRequest) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
        data: validateRequest,
      });
    }
    let listContents = await Content.findOne({
      where: {
        contentOrder: requestData.contentOrder,
        coursesChapterId: requestData.coursesChapterId,
      },
    });
    if(listContents){
      return response.status(constants.CODES.CONFLICT).send({
        success: false,
        message: constants.MESSAGES.COURSE.COURSE_CONTENT_ALREADY_EXISTS
      });
    }
    let addContent = await Content.create(requestData);
    return response.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.COURSE.COURSE_CONTENT_ADDED,
      data: addContent,
    });
  } catch (error) {
    console.log("Error: ", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.COURSE.COURSE_CONTENT_ADDED_FAILED,
      ERROR: error.message,
    });
  }
};

exports.update = async (request, response) => {
  try {
    const requestData = request.body;

    const validateRequest = await validateCourseRequestInput(
      requestData,
      "updateContent"
    );
    if (validateRequest) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
        data: validateRequest,
      });
    }
    await Content.update(requestData, {
      where: { id: requestData.contentId },
    });

    let listContents = await Content.findAll({
      where: { id: requestData.contentId },
    });

    return response.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.COURSE.COURSE_CONTENT_UPDATED,
      data: listContents,
    });
  } catch (error) {
    console.log("Error: ", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.COURSE.COURSE_CONTENT_UPDATE_FAILED,
      ERROR: error.message,
    });
  }
};

exports.list = async (request, response) => {
  try {
    const requestData = request.body;
    let opts = {
      where: {},
      offset: requestData.offset || 0,
      limit: requestData.limit || 10,
    };
    if (requestData.offset) opts.offset = requestData.offset;
    if (requestData.limit) opts.limit = requestData.limit;
    if (requestData.chapterId)
      opts.where.coursesChapterId = requestData.chapterId;
    if (requestData.contentId) opts.where.id = requestData.contentId;

    let listContents = await Content.findAll(opts);

    return response.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.COURSE.COURSE_CONTENT_LIST,
      data: listContents,
    });
  } catch (error) {
    console.log("Error: ", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.COURSE.COURSE_CONTENT_LIST_FAILED,
      ERROR: error.message,
    });
  }
};

const Chapters = require("../../models/Course/courseChapters.model");
const { validateCourseRequestInput } = require("../../validator");
const constants = require("../../utils/constants");
const Contents = require("../../models/Course/courseContent.model");

exports.add = async (request, response) => {
  try {
    const requestData = request.body;
    console.log("creator: ", requestData.creatorId);
    const validateRequest = await validateCourseRequestInput(
      requestData,
      "createChapter"
    );
    if (validateRequest) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
        data: validateRequest,
      });
    }
    let findChapter = await Chapters.findOne({
      where: {
        chapterOrder: requestData.chapterOrder,
        courseId: requestData.courseId,
      },
    });
    if(findChapter){
      return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
        success: false,
        message: constants.MESSAGES.COURSE.CHAPTER_ALREADY_ADDED,
      });
    }
    let addChapter = await Chapters.create(requestData);
    return response.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.COURSE.CHAPTER_ADDED,
      data: addChapter,
    });
  } catch (error) {
    console.log("Error: ", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.COURSE.FAILED_TO_ADD_CHAPTER,
      ERROR: error.message,
    });
  }
};

exports.update = async (request, response) => {
  try {
    const requestData = request.body;

    const validateRequest = await validateCourseRequestInput(
      requestData,
      "updateChapter"
    );
    if (validateRequest) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
        data: validateRequest,
      });
    }
    await Chapters.update(requestData, {
      where: { id: requestData.chapterId },
    });

    let listChapters = await Chapters.findAll({
      where: { id: requestData.chapterId },
    });

    return response.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.COURSE.CHAPTER_UPDATED,
      data: listChapters,
    });
  } catch (error) {
    console.log("Error: ", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.COURSE.FAILED_TO_UPDATED_CHAPTER,
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
    if (requestData.courseId) opts.where.courseId = requestData.courseId;
    if(requestData.chapterId){
      if (requestData.chapterId) opts.where.id = requestData.chapterId;
      opts.include=[{ model: Contents }]
    }

    let listChapters = await Chapters.findAll(opts);


    return response.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.COURSE.CHAPTER_LISTED,
      data: listChapters,
    });
  } catch (error) {
    console.log("Error: ", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.COURSE.FAILED_TO_UPDATED_CHAPTER,
      ERROR: error.message,
    });
  }
};

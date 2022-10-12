const { validateCourseRequestInput } = require("../../validator");
const constants = require("../../utils/constants");
const Courses = require("../../models/Course/course.model");
const CoursesDescription = require("../../models/Course/courseDescription.model");
const Op = require("sequelize").Op;
const Chapters = require("../../models/Course/courseChapters.model");
const CoursesContents = require("../../models/Course/courseContent.model");
const Reviews = require("../Courses/reviews.controllers");

//craete course
exports.createCourse = async (request, response) => {
  try {
    const requestData = request.body;
    requestData.creatorId = request.user.id;
    console.log("creator: ", requestData.creatorId);
    const validateRequest = await validateCourseRequestInput(
      requestData,
      "createCourse"
    );
    if (validateRequest) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
        data: validateRequest,
      });
    }
    let opts = {
      where: {
        courseSubCategoryId: requestData.courseSubCategoryId,
        name: requestData.name,
        creatorId: requestData.creatorId,
        status: true,
      },
    };
    let findCourse = await Courses.findOne(opts);
    if (findCourse) {
      return response.status(constants.CODES.CONFLICT).send({
        success: false,
        message: constants.MESSAGES.COURSE.COURSE_ALREADY_EXISTS,
      });
    }
    let createCourse = await Courses.create(requestData);
    return response.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.COURSE.COURSE_CREATED,
      data: createCourse,
    });
  } catch (error) {
    console.log("Error: ", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.COURSE.FAILED_TO_CREATE_COURSE,
      ERROR: error.message,
    });
  }
};

//add course details
exports.courseDetails = async (request, response) => {
  try {
    const requestData = request.body;
    const validateRequest = await validateCourseRequestInput(
      requestData,
      "courseDetails"
    );
    if (validateRequest) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
        data: validateRequest,
      });
    }
    let addDetails = await CoursesDescription.create(requestData);
    return response.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.COURSE.COURSE_DETAILS_CREATED,
      data: addDetails,
    });
  } catch (error) {
    console.log("Error: ", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.COURSE.FAILED_TO_CREATE_COURSE_DETAILS,
      ERROR: error,
    });
  }
};

//update courses
exports.updateCourse = async (request, response) => {
  try {
    const requestData = request.body;
    const validateRequest = await validateCourseRequestInput(
      requestData,
      "updateCourse"
    );
    if (validateRequest) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
        data: validateRequest,
      });
    }
    let updateCourse = await Courses.update(requestData, {
      where: { id: requestData.courseId },
    });
    let updateCourseDetails = await CoursesDescription.update(requestData, {
      where: { courseId: requestData.courseId },
    });

    console.log("--------------------: ", updateCourse, updateCourseDetails);

    let opts = {
      where: { id: requestData.courseId },
      include: [{ model: CoursesDescription }],
    };

    let findCourse = await Courses.findOne(opts);

    return response.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.COURSE.COURSE_UPDATED,
      data: findCourse,
    });
  } catch (error) {
    console.log("Error: ", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.COURSE.FAILED_TO_CREATE_COURSE_DETAILS,
      ERROR: error.message,
    });
  }
};

//list courses
exports.listCourse = async (request, response) => {
  try {
    const requestData = request.body;
    let opts = {
      where: {},
      offset: requestData.offset || 0,
      limit: requestData.limit || 20,
      include: [{ model: CoursesDescription }],
    };

    if (requestData.offset) opts.offset = requestData.offset;
    if (requestData.limit) opts.limit = requestData.limit;
    if (requestData.status) opts.where.status = requestData.status;
    if (requestData.status == false) opts.where.status = false;
    if (requestData.name)
      opts.where.name = { [Op.like]: `%${requestData.name}%` };
    if (requestData.price) opts.where.offerPrice = { [Op.lte]: requestData.price };

    if (requestData.courseId) {
      opts.where.id = requestData.courseId;
      opts.include = [
        { model: CoursesDescription },
        { model: Chapters, include: [{ model: CoursesContents }] },
        { model: Reviews }
      ];
    }

    let findCourses = await Courses.findAll(opts);
    let AllCourses = await Courses.findAll();
    let totalCount = AllCourses.length;

    return response.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.COURSE.COURSE_LISTED,
      count: findCourses.length,
      AllCourses: totalCount,
      data: findCourses,
    });
  } catch (error) {
    console.log("Error: ", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.COURSE.FAILED_TO_CREATE_COURSE_DETAILS,
      ERROR: error.message,
    });
  }
};

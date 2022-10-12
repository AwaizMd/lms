const { validateCourseRequestInput } = require("../../validator");
const constants = require("../../utils/constants");
const Reviews = require("../../models/Course/reviews.model");
const Courses = require("../../models/Course/course.model");
const Op = require("sequelize").Op;

exports.add = async (request, response) => {
  try {
    const requestData = request.body;
    const validateRequest = await validateCourseRequestInput(
      requestData,
      "addReviews"
    );
    if (validateRequest) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
        data: validateRequest,
      });
    }
    let userId = request.user.id;
    let findReview = await Reviews.findOne({
      where: { userId: userId, courseId: requestData.courseId },
    });
    requestData.userId = userId;
    let findCourse = await Courses.findOne({
      where: { id: requestData.courseId },
      attributes: ["avgRatings", "noOfRatings"],
    });
    //ratings logic
    let avgRatings = findCourse.avgRatings;
    let totalUsers = findCourse.noOfRatings;
    let totalRatings =
      (avgRatings * totalUsers + requestData.ratings) / (totalUsers + 1);

    if (findReview) {
      let updateReview = await Reviews.update(requestData, {
        where: { userId: userId, courseId: requestData.courseId },
      });
      //need to change rating logic for updates.
      if (updateReview) {
        totalRatings =
          (avgRatings - findReview.ratings * totalUsers + requestData.ratings) /
          totalUsers;
        await Courses.update(
          {
            avgRatings: totalRatings,
            noOfRatings: totalUsers,
          },
          { where: { id: requestData.courseId } }
        );
      }
      return response.status(constants.CODES.SUCCESS).send({
        success: true,
        message: constants.MESSAGES.REVIEWS.REVIEW_UPDATED,
        data: updateReview,
      });
    } else {
      let createReview = await Reviews.create(requestData);
      if (createReview) {
        await Courses.update(
          { avgRatings: totalRatings, noOfRatings: totalUsers + 1 },
          { where: { id: requestData.courseId } }
        );
      }
      return response.status(constants.CODES.SUCCESS).send({
        success: true,
        message: constants.MESSAGES.REVIEWS.REVIEW_CREATED,
        data: createReview,
      });
    }
  } catch (error) {
    console.log("error:", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.REVIEWS.FAILED_TO_CREATE_REVIEW,
      ERROR: error,
    });
  }
};

exports.update = async (request, response) => {
  try {
    const requestData = request.body;
    const validateRequest = await validateCourseRequestInput(
      requestData,
      "updateReviews"
    );
    if (validateRequest) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
        data: validateRequest,
      });
    }
    let userId = request.user.id;
    let findReview = await Reviews.findOne({
      where: { id: requestData.reviewId },
    });
    requestData.userId = userId;
    //ratings logic
    let findCourse = await Courses.findOne({
      where: { id: requestData.courseId },
      attributes: ["avgRatings", "noOfRatings"],
    });
    let avgRatings = findCourse.avgRatings;
    let totalUsers = findCourse.noOfRatings;
    let totalRatings =
          (avgRatings - findReview.ratings * totalUsers + requestData.ratings) /
          totalUsers;
    if (findReview) {
      let updateReview = await Reviews.update(requestData, {
        where: { id: requestData.reviewId },
      });
      if (updateReview) {
        await Courses.update(
          { avgRatings: totalRatings, noOfRatings: totalUsers },
          { where: { id: requestData.courseId } }
        );
      }
      return response.status(constants.CODES.SUCCESS).send({
        success: true,
        message: constants.MESSAGES.REVIEWS.REVIEW_UPDATED,
        data: updateReview,
      });
    }
  } catch (error) {
    console.log("error:", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.REVIEWS.FAILED_TO_UPDATE_REVIEW,
      ERROR: error,
    });
  }
};

exports.list = async (request, response) => {
  try {
    let requestData = request.body;
    let opts = {
      where: {},
    };

    if (requestData.ratings)
      opts.where.ratings = { [Op.lte]: requestData.ratings };

    if (requestData.courseId) opts.where.courseId = requestData.courseId;
    if (requestData.userId) opts.where.userId = requestData.userId;
    if (requestData.reviewId) opts.where.id = requestData.reviewId;

    let listReviews = await Reviews.findAll(opts);
    return response.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.REVIEWS.REVIEW_LISTED,
      data: listReviews,
    });
  } catch (error) {
    console.log("error:", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.REVIEWS.REVIEW_LISTED_FAILED,
      ERROR: error,
    });
  }
};

exports.delete = async (request, response) => {
  try {
    const requestData = request.body;
    let deleteReview = await Reviews.destroy({
      where: { id: requestData.reviewId },
    });

    return response.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.REVIEWS.REVIEW_DELETED,
      data: deleteReview,
    });
  } catch (error) {
    console.log("error:", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.REVIEWS.REVIEW_DELETE_FAILED,
      ERROR: error,
    });
  }
};

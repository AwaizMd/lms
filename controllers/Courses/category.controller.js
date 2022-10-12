const { validateCourseRequestInput } = require("../../validator");
const constants = require("../../utils/constants");
const Category = require("../../models/Course/category.model");

exports.addCategory = async (request, response) => {
  try {
    const requestData = request.body;
    const validateRequest = await validateCourseRequestInput(
      requestData,
      "createCategory"
    );
    if (validateRequest) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
        data: validateRequest,
      });
    }
    let findCategory = await Category.findOne({
      where: { name: requestData.name },
    });
    if (findCategory) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.COURSE.COURSE_CATEGORY_EXISTS,
        data: findCategory,
      });
    }
    let createCategory = await Category.create(requestData);
    return response.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.COURSE.COURSE_CATEGORY_CREATED,
      data: createCategory,
    });
  } catch (error) {
    console.log("error:", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.COURSE.FAILED_TO_CREATE_COURSE_CATEGORY,
      ERROR: error,
    });
  }
};

exports.updateCategory = async (request, response) => {
  try {
    const requestData = request.body;
    const validateRequest = await validateCourseRequestInput(
      requestData,
      "updateCategory"
    );
    if (validateRequest) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
        data: validateRequest,
      });
    }
    let findCategory = await Category.findOne({
      where: { id: requestData.categoryId },
    });
    if (findCategory) {
      let updateCategory = await Category.update(requestData, {
        where: { id: requestData.categoryId },
      });
      let findUpdatedCategory = await Category.findOne({
        where: { id: requestData.categoryId },
      });
      return response.status(constants.CODES.SUCCESS).send({
        success: true,
        message: constants.MESSAGES.COURSE.COURSE_CATEGORY_UPDATED,
        data: updateCategory,
        updatedData: findUpdatedCategory,
      });
    } else {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.COURSE.COURSE_CATEGORY_EXISTS,
        data: findCategory,
      });
    }
  } catch (error) {
    console.log("error:", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.COURSE.FAILED_TO_UPDATE_COURSE_CATEGORY,
      ERROR: error,
    });
  }
};

exports.listCategories = async (request, response) =>{
  try {
    let requestData = request.body;
    let opts = {
      where: {},
    };
    if (requestData.categoryId) opts.where.id = requestData.categoryId;

    if (requestData.status == true) opts.where.status = true;
    if (requestData.status == false) opts.where.status = false;

    let categoryList = await Category.findAll(opts);
    return response.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.COURSE.COURSE_CATEGORY_LISTED,
      data: categoryList,
    });
  } catch (error) {
    console.log("error:", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.COURSE.FAILED_TO_LIST_COURSE_CATEGORY,
      ERROR: error,
    });
  }
}
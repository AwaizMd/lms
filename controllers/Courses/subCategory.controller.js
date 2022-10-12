const { validateCourseRequestInput } = require("../../validator");
const constants = require("../../utils/constants");
const SubCategory = require("../../models/Course/subCategory.model");
const Category = require("../../models/Course/category.model");

exports.addSubCategory = async (request, response) => {
  try {
    const requestData = request.body;
    const validateRequest = await validateCourseRequestInput(
      requestData,
      "createSubCategory"
    );
    if (validateRequest) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
        data: validateRequest,
      });
    }
    let findSubCategory = await SubCategory.findOne({
      where: {
        name: requestData.name,
        courseCategoryId: requestData.categoryId,
      },
    });
    if (findSubCategory) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.COURSE.COURSE_SUB_CATEGORY_EXISTS,
        data: findSubCategory,
      });
    }
    let opts = {
      name: requestData.name,
      status: requestData.status,
      courseCategoryId: requestData.categoryId,
    };
    let createSubCategory = await SubCategory.create(opts);
    return response.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.COURSE.COURSE_SUB_CATEGORY_CREATED,
      data: createSubCategory,
    });
  } catch (error) {
    console.log("error:", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.COURSE.FAILED_TO_CREATE_COURSE_SUB_CATEGORY,
      ERROR: error.message,
    });
  }
};

exports.updateSubCategory = async (request, response) => {
  try {
    const requestData = request.body;
    const validateRequest = await validateCourseRequestInput(
      requestData,
      "updateSubCategory"
    );
    if (validateRequest) {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
        data: validateRequest,
      });
    }
    let findSubCategory = await SubCategory.findOne({
      where: { id: requestData.subCategoryId },
    });
    if (findSubCategory) {
      let updateSubCategory = await SubCategory.update(requestData, {
        where: { id: requestData.subCategoryId },
      });
      let findUpdatedSubCategory = await SubCategory.findOne({
        where: { id: requestData.subCategoryId },
      });
      return response.status(constants.CODES.SUCCESS).send({
        success: true,
        message: constants.MESSAGES.COURSE.COURSE_SUB_CATEGORY_UPDATED,
        data: updateSubCategory,
        updatedData: findUpdatedSubCategory,
      });
    } else {
      return response.status(constants.CODES.VALIDATION_FAILED).send({
        success: false,
        message: constants.MESSAGES.COURSE.COURSE_SUB_CATEGORY_EXISTS,
        data: validateRequest,
      });
    }
  } catch (error) {
    console.log("error:", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.COURSE.FAILED_TO_UPDATE_COURSE_SUB_CATEGORY,
      ERROR: error.message,
    });
  }
};

exports.listSubCategories = async (request, response) => {
  try {
    let requestData = request.body;
    let opts = {
      where: {},
      include: [{ model: Category }],
    };
    if (requestData.subCategoryId) opts.where.id = requestData.subCategoryId;

    if (requestData.status == true) opts.where.status = true;
    if (requestData.status == false) opts.where.status = false;

    let subCategoryList = await SubCategory.findAll(opts);
    return response.status(constants.CODES.SUCCESS).send({
      success: true,
      message: constants.MESSAGES.COURSE.COURSE_SUBCATEGORY_LISTED,
      data: subCategoryList,
    });
  } catch (error) {
    console.log("error:", error);
    return response.status(constants.CODES.SOMETHING_WENT_WRONG).send({
      success: false,
      message: constants.MESSAGES.COURSE.FAILED_TO_LIST_SUBCOURSE_CATEGORY,
      ERROR: error.message,
    });
  }
};

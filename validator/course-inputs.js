const Joi = require("joi");

const inputRequests = {
  createCategory: {
    id: Joi.allow(),
    name: Joi.string().required(),
    status: Joi.boolean().required(),
  },
  updateCategory: {
    categoryId: Joi.number().required(),
    name: Joi.string(),
    status: Joi.boolean(),
  },
  createSubCategory: {
    id: Joi.allow(),
    name: Joi.string().required(),
    categoryId: Joi.number().required(),
    status: Joi.boolean().required(),
  },
  updateSubCategory: {
    subCategoryId: Joi.number().required(),
    categoryId: Joi.number(),
    name: Joi.string(),
    status: Joi.boolean(),
  },
  createCourse: {
    id: Joi.allow(),
    courseSubCategoryId: Joi.number().required(),
    creatorId: Joi.number().required(),
    name: Joi.string().required(),
    thumbnailLink: Joi.string().required(),
    price: Joi.number().required(),
    offerPrice: Joi.number().required(),
    durationInHours: Joi.number().required(),
    status: Joi.number(),
  },
  courseDetails: {
    courseId: Joi.number().required(),
    description: Joi.string().required(),
    shortDescription: Joi.string(),
    whatYouWillLearn: Joi.string(),
    prerequisites: Joi.string(),
    keywords: Joi.string(),
    audienceType: Joi.string(),
    courseTimeline: Joi.string(),
    courseCertificate: Joi.boolean(),
    courseIntroUrl: Joi.string(),
    coursePublisheType: Joi.string(),
  },
  updateCourse: {
    courseId: Joi.number().required(),
    courseSubCategoryId: Joi.number(),
    creatorId: Joi.number(),
    name: Joi.string(),
    thumbnailLink: Joi.string(),
    price: Joi.number(),
    offerPrice: Joi.number(),
    durationInHours: Joi.number(),
    status: Joi.number(),
    description: Joi.string(),
    shortDescription: Joi.string(),
    whatYouWillLearn: Joi.string(),
    prerequisites: Joi.string(),
    keywords: Joi.string(),
    audienceType: Joi.string(),
    courseTimeline: Joi.string(),
    courseCertificate: Joi.boolean(),
    courseIntroUrl: Joi.string(),
    coursePublisheType: Joi.string(),
  },
  createChapter: {
    id: Joi.allow(),
    courseId: Joi.number().required(),
    name: Joi.string().required(),
    numberOfLectures: Joi.number().required(),
    averageLectureTime: Joi.string().required(),
    chapterOrder: Joi.number().required(),
    chapterDescription: Joi.string(),
    isActive: Joi.boolean().required(),
  },
  updateChapter: {
    chapterId: Joi.allow().required(),
    courseId: Joi.number(),
    name: Joi.string(),
    numberOfLectures: Joi.number(),
    averageLectureTime: Joi.string(),
    chapterOrder: Joi.number(),
    chapterDescription: Joi.string(),
    isActive: Joi.boolean(),
  },
  addContent: {
    id: Joi.allow(),
    name: Joi.string().required(),
    link: Joi.string().required(),
    duration: Joi.number().required(),
    contentOrder: Joi.number().required(),
    contentType: Joi.string().required(),
    isActive: Joi.boolean(),
    coursesChapterId: Joi.allow().required(),
  },
  updateContent: {
    contentId: Joi.allow().required(),
    name: Joi.string(),
    link: Joi.string(),
    duration: Joi.number(),
    contentOrder: Joi.number(),
    contentType: Joi.string(),
    isActive: Joi.boolean(),
    coursesChapterId: Joi.allow(),
  },
  addReviews: {
    id: Joi.allow(),
    courseId: Joi.number().required(),
    ratings: Joi.number().required(),
    title: Joi.string().required(),
    review: Joi.string(),
  },
  updateReviews: {
    reviewId : Joi.allow().required(),
    courseId: Joi.number().required(),
    ratings: Joi.number(),
    title: Joi.string(),
    review: Joi.string(),
  },
};

module.exports = inputRequests;

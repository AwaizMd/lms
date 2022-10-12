const Category = require("../Course/category.model");
const Courses = require("../Course/course.model");
const CoursesChapters = require("../Course/courseChapters.model");
const CoursesContents = require("../Course/courseContent.model");
const CoursesDescription = require("../Course/courseDescription.model");
const SubCategory = require("../Course/subCategory.model");
const User = require("../Users/users.model");
const UserTypes = require("../Users/userTypes.model");
const Reviews = require("../../models/Course/reviews.model")

module.exports = () => {
  //users
  oTm(UserTypes, User);
  //category and subcategory
  oTm(Category, SubCategory);
  //courses
  oTm(SubCategory, Courses);
  User.hasMany(Courses, { foreignKey: "creatorId" });
  Courses.belongsTo(User, { foreignKey: "creatorId" });
  oTm(Courses, CoursesDescription);
  oTm(Courses, CoursesChapters);
  oTm(CoursesChapters,CoursesContents);
  //reviews
  oTm(User, Reviews);
  oTm(Courses, Reviews)

  function oTm(A, B) {
    A.hasMany(B);
    B.belongsTo(A);
  }

  function oTm(A, B, as) {
    A.hasMany(B, { as: as });
    B.belongsTo(A, { as: as });
  }

  function oTo(A, B) {
    A.hasOne(B);
    B.belongsTo(A);
  }

  function mTm(A, B, C) {
    A.belongsToMany(B, { through: C });
    B.belongsToMany(A, { through: C });
  }

  function oTm_onDelete(A, B) {
    A.hasMany(B, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    B.belongsTo(A);
  }

  function mTmTr(A, B, C, D) {
    A.belongsToMany(B, { through: C, as: D });
    B.belongsToMany(A, { through: C, as: D });
  }
};

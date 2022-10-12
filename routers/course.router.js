const router = require("express").Router();
const categoryController = require("../controllers/Courses/category.controller");
const subCategoryController = require("../controllers/Courses/subCategory.controller");
const Course = require("../controllers/Courses/course.controller");
const CourseChapter = require("../controllers/Courses/chapters.controller");
const CourseContent = require("../controllers/Courses/content.controller");
const auth = require("../middleware/auth");
const Reviews = require("../controllers/Courses/reviews.controllers");

//category api's
router.post("/category/add", auth.admin, categoryController.addCategory);
router.put("/category/update", auth.admin, categoryController.updateCategory);
router.post("/category/list", categoryController.listCategories);

//subcategory api's
router.post(
  "/subcategory/add",
  auth.admin,
  subCategoryController.addSubCategory
);
router.put(
  "/subcategory/update",
  auth.admin,
  subCategoryController.updateSubCategory
);
router.post("/subcategory/list", subCategoryController.listSubCategories);

//course api's
router.post("/create", auth.creator, Course.createCourse);
router.post("/create-details", auth.creator, Course.courseDetails);
router.put("/update", auth.creator, Course.updateCourse);
router.put("/edit", auth.admin, Course.updateCourse);
router.post("/list", Course.listCourse);

//course chapters
router.post("/add-chapter", auth.creator, CourseChapter.add);
router.put("/update-chapter", auth.creator, CourseChapter.update);
router.post("/list-chapter", CourseChapter.list);

//course contents
router.post("/add-content", auth.creator, CourseContent.add);
router.put("/update-content", auth.creator, CourseContent.update);
router.post("/list-content", CourseContent.list);

//Reviews & Ratings
router.post("/add-review", auth.learner, Reviews.add);
router.put("/update-review", auth.learner, Reviews.update);
router.post("/list-reviews", Reviews.list);
router.delete("/delete", auth.learner, Reviews.delete);

module.exports = router;

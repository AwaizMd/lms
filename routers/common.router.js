const router = require("express").Router();
const controller = require('../controllers/upload/common.controller');
const multer = require('multer');
const auth = require("../middleware/auth");

//  PUT /common/upload-file
//  category - - eg: ORG-PROFILE/USER-PROFILE

router.post(
  '/upload-file',
  multer({ dest: 'temp-uploader/', limits: { fieldSize: 8 * 1024 * 1024 } }).single('file'), auth.all,
  controller.uploadFile
);

// PUT /common/upload-course-file
//  category - - eg: COURSE-IMAGES/COURSE-CONTENTS

router.post(
  '/upload-course-file',
  multer({ dest: 'temp-uploader/', limits: { fieldSize: 8 * 1024 * 1024 } }).single('file'), auth.all,
  controller.uploadCourseFile
);

module.exports = router;

const router = require("express").Router();
const userController = require("../controllers/Users/Users.controllers");
const auth = require("../middleware/auth");
//usertypes
router.get("/types/list", userController.listUserTypes);
router.put("/profile/edit", auth.user, userController.editProfile); 
router.post("/list", auth.admin, userController.listUsers);
router.post("/get", auth.user, userController.listUser);


module.exports = router;

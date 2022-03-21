const express = require("express")
const { route } = require("express/lib/application")
const router = express.Router()
const userController = require("../controllers/userController")
const auth = require("../middleware/auth")

router.get("/", userController.verify);
// router.post('/', userController.find);
router.post("/otp", userController.otp);   // post
router.get("/index", userController.get_index);     // post
router.post("/index", userController.post_index);     // post
router.get("/register", userController.get_register);     
router.post("/register", userController.post_register);     // post
router.get("/login", userController.get_login);
router.post("/login", userController.post_login);     // post

router.get("/forgot_password_step_1", userController.forgot_password_step_1);    
router.post("/forgot_password_step_2", userController.forgot_password_step_2);     // post    
router.post("/forgot_password_step_3", userController.forgot_password_step_3);     // post
router.post("/home", userController.home);     // post
router.get("/secret", auth, userController.secret);    
router.get("/logout", auth, userController.logout);    



// router.get('/adduser', userController.form);
// router.post('/adduser', userController.create);

// router.get('/edituser/:id', userController.edit);
// router.post('/edituser/:id', userController.update);

router.get('/viewuser/:id', userController.viewall);
// router.get('/:id', userController.delete);

module.exports = router;
const express = require("express")
const { route } = require("express/lib/application")
const router = express.Router()
const userController = require("../controllers/userController")

router.get("/", userController.view);
router.post('/', userController.find);

router.get('/adduser', userController.form);
router.post('/adduser', userController.create);

router.get('/edituser/:id', userController.edit);
router.post('/edituser/:id', userController.update);

router.get('/viewuser/:id', userController.viewall);
router.get('/:id', userController.delete);

module.exports = router;
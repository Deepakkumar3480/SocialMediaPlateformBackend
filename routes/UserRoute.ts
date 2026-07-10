const express = require("express");
const UserController = require("../controller/UserController");

const router = express.Router();

router.get("/", UserController.GetAllUsers);
router.get("/:id", UserController.GetUserById);

router.post("/", UserController.UserRegister);
router.post("/login", UserController.UserLogin);

router.put("/:id", UserController.UpdateUser);
router.delete("/:id", UserController.DeleteUser);



module.exports = router;
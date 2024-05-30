const express = require("express");
const AppController = require("../controllers/AppController");

const router = express.Router();

router
  .route("/")
  .get(AppController.getAllUsers)
  .post(AppController.createNewUser);

router
  .route("/:id")
  .delete(AppController.deleteUser)
  .post(AppController.checkPinCode);

module.exports = router;

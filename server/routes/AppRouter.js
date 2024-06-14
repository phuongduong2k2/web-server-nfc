const express = require("express");
const AppController = require("../controllers/AppController");

const router = express.Router();

router
  .route("/")
  .get(AppController.getAllUsers)
  .post(AppController.createNewUser)
  .delete(AppController.deleteUserRequest);

router
  .route("/:id")
  .delete(AppController.deleteUser)
  .post(AppController.verifyUser)
  .patch(AppController.updateUser);

router.route("/verify").get(AppController.getRequestUser);

router
  .route("/verify/:nfcId")
  .get(AppController.getUserByNfcId)
  .post(AppController.addRequestUser);

module.exports = router;

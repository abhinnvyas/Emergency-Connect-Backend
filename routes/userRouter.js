const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUser,
  getUserDetails,
} = require("../controllers/userController");

router.get("/getAllUsers", getAllUsers);
router.get("/getUserDetails/", getUserDetails);
router.post("/updateUser/", updateUser);

module.exports = router;

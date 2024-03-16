const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
} = require("../controllers/userController");

router.get("/getAllUsers", getAllUsers);
router.get("/getUserById/:id", getUserById);
router.post("/updateUser/:id", updateUser);

module.exports = router;
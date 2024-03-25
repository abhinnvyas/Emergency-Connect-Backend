const express = require("express");
const router = express.Router();
const {
  createContact,
  getUserContacts,
  deleteContact,
} = require("../controllers/contactController");

router.post("/createContact", createContact);
router.get("/getUserContacts", getUserContacts);
router.delete("/deleteContact/:id", deleteContact);

module.exports = router;

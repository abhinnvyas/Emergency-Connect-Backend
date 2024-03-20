const express = require("express");
const { deleteDB } = require("../controllers/dbController");
const router = express.Router();

router.get("/deleteDB", deleteDB);

module.exports = router;

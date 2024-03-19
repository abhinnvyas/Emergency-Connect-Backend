const express = require("express");
const {
  createAlerts,
  getAllAlerts,
} = require("../controllers/alertController");
const router = express.Router();

router.post("/createAlerts", createAlerts);
router.get("/getAllAlerts", getAllAlerts);

module.exports = router;

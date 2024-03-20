const express = require("express");
const {
  createAlerts,
  getAllAlerts,
  getUserAlerts,
  updateAlertStatus,
  getAlertById,
  getAllActiveAlertsAroundLocation,
} = require("../controllers/alertController");
const router = express.Router();

router.post("/createAlerts", createAlerts);
router.get("/getAllAlerts", getAllAlerts);
router.get("/getUserAlerts", getUserAlerts);
router.post("/updateAlertStatus", updateAlertStatus);
router.get("/getAlertById/:alertId", getAlertById);

// have to work on the functionality

router.get(
  "/getAllActiveAlertsAroundLocation",
  getAllActiveAlertsAroundLocation
);

module.exports = router;

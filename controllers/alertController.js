const { AlertType, AlertStatus } = require("@prisma/client");
const prisma = require("../prisma/index");

exports.createAlerts = async (req, res, next) => {
  try {
    const id = req.userId;
    const { type, location, status } = req.body;

    //status = Active, Resolved, Cancelled

    if (!type || !location || !id) {
      return res
        .status(400)
        .json({ status: false, msg: "All fields are required" });
    }

    // The user can only have one active alert at a time, so update all the active alerts status to cancelled

    if (!Object.values(AlertType).includes(type)) {
      return res.status(400).json({
        status: false,
        msg: "Use one of the 'type' filters - [General, Medical, Fire, Police, Ambulance]",
      });
    }

    if (!Object.values(AlertStatus).includes(status)) {
      return res.status(400).json({
        status: false,
        msg: "Use one of the 'status' filters - [Active, Resolved, Cancelled]",
      });
    }

    try {
      const existingActiveAlert = await prisma.alert.findMany({
        where: {
          userId: id,
          status: "Active",
        },
      });

      if (existingActiveAlert.length > 0) {
        // Loop through each active alert and update its status to "Cancelled"
        await Promise.all(
          existingActiveAlert.map(async (alert) => {
            await prisma.alert.update({
              where: {
                id: alert.id,
              },
              data: {
                status: "Cancelled",
              },
            });
          })
        );
      }
    } catch (err) {
      res.status(400).json({
        status: false,
        msg: `You probably already have one "Active" alert - ${err.message}`,
      });
    }

    const alert = await prisma.alert.create({
      data: {
        type: AlertType[type],
        location,
        status,
        user: { connect: { id } }, // Connect the Alert to the User
      },
    });

    if (!alert) {
      return res
        .status(400)
        .json({ status: false, msg: "Alert Creation Failed" });
    }

    return res
      .status(201)
      .json({ status: true, msg: "Alert Created Successfully" });
  } catch (err) {
    res.status(400).json({ status: false, msg: err.message });
  }
};

exports.getAllAlerts = async (req, res, next) => {
  try {
    const alerts = await prisma.alert.findMany();
    // alerts.map((alert) => {});
    return res.status(200).json({ status: true, data: alerts });
  } catch (err) {
    return res.status(400).json({ status: false, msg: err.message });
  }
};

exports.getAlertsById = async (req, res, next) => {};

exports.updateAlerts = async (req, res, next) => {};

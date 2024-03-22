const prisma = require("../prisma/index");

exports.deleteDB = async (req, res, next) => {
  try {
    await prisma.alert.deleteMany();
    const users = await prisma.user.findMany();

    // Delete all users
    await prisma.user.deleteMany();

    // Delete related alerts separately
    for (const user of users) {
      // Delete alerts associated with the current user
      await prisma.alert.deleteMany({
        where: {
          userId: user.id,
        },
      });
    }

    res.status(200).json({ status: true, msg: "Database has been cleared." });
  } catch (err) {
    console.log("Error at dbController/deleteDB: ", err.message);
    return res.status(400).json({ status: false, msg: err.message });
  }
};

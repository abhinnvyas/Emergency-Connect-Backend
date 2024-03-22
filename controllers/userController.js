const prisma = require("../prisma/index");

exports.getUserDetails = async (req, res, next) => {
  try {
    // const { id } = req.params;
    const id = req.userId;
    if (!id) {
      return res
        .status(400)
        .json({ status: false, msg: "User id is required" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(404).json({ status: false, msg: "User not found" });
    }
    user.password = undefined;
    return res.status(200).json({ status: true, data: user });
  } catch (err) {
    console.log("Error at userController/getUserDetails: ", err.message);
    return res.status(400).json({ status: false, msg: err.message });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    // const { id } = req.params;
    const id = req.userId;
    const { name, email, phone, age, blood_grp, gender } = req.body;
    if (!id || !name || !email || !phone || !age || !blood_grp || !gender) {
      return res
        .status(400)
        .json({ status: false, msg: "All fields are required" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ status: false, msg: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        phone,
        age,
        blood_grp,
        gender,
      },
    });

    updatedUser.password = undefined;

    return res.status(200).json({
      status: true,
      msg: "User Updated Successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.log("Er at userController/updateUser: ", err.message);
    return res.status(400).json({ status: false, msg: err.message });
  }
};

// These are not needed in the production

exports.deleteUser = async (req, res, next) => {};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    users.map((user) => {
      user.password = undefined;
    });
    return res.status(200).json({ status: true, data: users });
  } catch (err) {
    console.log("Error at userController/getAllUsers: ", err.message);
    return res.status(400).json({ status: false, msg: err.message });
  }
};

const prisma = require("../prisma/index");
const hashedPassword = require("../utils/hashPassword");
const getJwtToken = require("../utils/getJwtToken");
const bcrypt = require("bcrypt");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, phone, age, blood_grp, gender, password } = req.body;
    if (
      !name ||
      !email ||
      !phone ||
      !age ||
      !blood_grp ||
      !gender ||
      !password
    ) {
      return res
        .status(400)
        .json({ status: false, msg: "All fields are required" });
    }

    const checkUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (checkUser) {
      return res
        .status(400)
        .json({ status: false, msg: "User already exists" });
    }

    const passwordHash = await hashedPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        age,
        blood_grp,
        gender,
        password: passwordHash,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ status: false, msg: "User Creation Failed" });
    }

    return res
      .status(201)
      .json({ status: true, msg: "User Created Successfully" });
  } catch (err) {
    console.log("Error at authController/signup: ", err.message);
    return res.status(400).json({ status: false, msg: err.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, msg: "All fields are required" });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ status: false, msg: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log(isPasswordMatch);

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ status: false, msg: "Invalid Credentials" });
    }

    const token = getJwtToken(user.id);

    return res
      .status(200)
      .json({ status: true, msg: "User Login Successfull", token });
  } catch (error) {
    console.log("Error at authController/login: ", error.message);
    return res.status(400).json({ status: false, msg: error.message });
  }
};

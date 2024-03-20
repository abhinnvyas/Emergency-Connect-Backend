const jwt = require("jsonwebtoken");
const prisma = require("../prisma/index");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ status: false, msg: "Access Denied" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ status: false, msg: "Invalid Token" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      return res.status(400).json({ status: false, msg: "Access Denied" });
    }

    req.userId = decoded.userId;

    next();
  });
};

module.exports = verifyToken;

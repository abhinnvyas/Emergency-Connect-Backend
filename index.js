const express = require("express");
const rateLimit = require("express-rate-limit");
const app = express();
const port = 3000;
const pathSuffix = "/api/v-1";

// const cors = require("cors");

require("dotenv").config();

const limiter = rateLimit({
  windowMS: 60 * 1000, //1 minute
  limit: 50, // limit each IP to 5 requests per windowMS
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const verifyToken = require("./middlewares/authMiddleware");
app.use(`${pathSuffix}/user`, verifyToken, userRouter);
app.use(`${pathSuffix}/auth`, authRouter);

app.get("/", (req, res) => {
  res.send("Its an amazing life. Enojoy it.");
});

app.listen(port, () => {
  console.log("Server running on port : " + port);
});

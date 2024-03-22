const express = require("express");
const rateLimit = require("express-rate-limit");
const app = express();
const PORT = process.env.PORT || 3000;
const pathSuffix = "/api/v-1";

const cors = require("cors");

require("dotenv").config();

const limiter = rateLimit({
  windowMS: 60 * 1000, //1 minute
  limit: 50, // limit each IP to 5 requests per windowMS
  message: "Too many requests from this IP, please try again after a minute",
  legacyHeaders: false,
});

const corsOptions = {
  origin: "*", //(https://your-client-app.com)
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const alertRouter = require("./routes/alertRouter");
const dbRouter = require("./routes/dbRouter");
const verifyToken = require("./middlewares/authMiddleware");

// Non-Protected Routes
app.use(`${pathSuffix}/auth`, authRouter);

//Protected Routes
app.use(`${pathSuffix}/user`, verifyToken, userRouter);
app.use(`${pathSuffix}/alert`, verifyToken, alertRouter);
app.use(`${pathSuffix}/db`, verifyToken, dbRouter);

app.get("/", (req, res) => {
  res.send("Its an amazing life. Enojoy it.");
});

app.listen(PORT, () => {
  console.log("Server running on port : " + PORT);
});

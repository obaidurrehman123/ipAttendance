const express = require("express");
const { sequelize } = require("./models");
const superserroutes = require("./routes/superUserRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const ipRoutes = require("./routes/checkIpRoutes");
const attendanceRoutes = require("./routes/attendanceRoute");
const attendanceInfoRoutes = require("./routes/attendanceInfoRoutes");
const dotenv = require("dotenv");
const app = express();
const session = require("express-session");
app.use(express.json());
dotenv.config();
app.get("/", (req, res) => {
  res.send("helloooooooo");
});
app.use(
  session({
    secret: "Obaidsession",
    resave: false,
    saveUninitialized: false,
  })
);
app.use((req, res, next) => {
  console.log(req.session);
  next();
});
//routes
app.use("/api/v1/superuser", superserroutes);
app.use("/api/v1/userroutes", userRoutes);
app.use("/api/v1/productroutes", productRoutes);
app.use("/api/v1/iproute", ipRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/attendanceInfoRoutes", attendanceInfoRoutes);
const port = process.env.PORT || 4500;
app.listen(port, async () => {
  console.log(`Server is running ${port}`);
  try {
    await sequelize.authenticate();
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error);
  }
});

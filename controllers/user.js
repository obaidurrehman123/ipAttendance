const {
  User,
  Permissions,
  ipaddress,
  Attendance,
  AttendanceStatus,
} = require("../models");
const { getuserIp } = require("../helpers/gettingIp");
const session = require("express-session");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const JWT = require("jsonwebtoken");
const {
  hashPassword,
  comparePassword,
} = require("../helpers/encryptDecryptPass");
//creating user controller
const createUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      department,
      role,
      canRead,
      canCreate,
      canDelete,
      canUpdate,
    } = req.body;
    if (!firstname) {
      return res.status(400).json({ message: "firstname cannot be empty" });
    }
    if (!lastname) {
      return res.status(400).json({ message: "lastname cannot be empty" });
    }
    if (!email) {
      return res.status(400).json({ message: "email cannot be empty" });
    }
    if (!password) {
      return res.status(400).json({ message: "password cannot be empty" });
    }
    if (!department) {
      return res.status(400).json({ message: "department cannot be empty" });
    }
    if (!role) {
      return res.status(400).json({ message: "role cannot be empty" });
    }
    if (canRead === undefined) {
      return res.status(400).json({ message: "read access cannot be empty" });
    }
    if (canCreate === undefined) {
      return res.status(400).json({ message: "create access cannot be empty" });
    }
    if (canDelete === undefined) {
      return res.status(400).json({ message: "delete access cannot be empty" });
    }
    if (canUpdate === undefined) {
      return res.status(400).json({ message: "update access cannot be empty" });
    }
    const checkExistingEmail = await User.findOne({ where: { email: email } });
    if (checkExistingEmail) {
      return res.status(400).json({
        success: false,
        message: "email already exists",
      });
    }
    const hashedPass = await hashPassword(password);
    const user = await User.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPass,
      department: department,
      role: role,
      superUser: false,
    });
    const permissions = await Permissions.create({
      create: !!canCreate,
      canUpdate: !!canUpdate,
      delete: !!canDelete,
      read: !!canRead,
      userId: user.id,
    });
    const responseDetail = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      department: user.department,
      role: user.role,
      superUser: user.superUser,
      create: permissions.create,
      update: permissions.update,
      delete: permissions.delete,
      read: permissions.read,
    };
    return res.status(200).send({
      status: true,
      message: "Successfully created the user",
      responseDetail,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error while creating user",
      error,
    });
  }
};
// user logged in
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email cannot be empty" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password cannot be empty" });
    }
    const checkUser = await User.findOne({ where: { email } });
    if (!checkUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (checkUser.superUser) {
      return res
        .status(400)
        .json({ message: "SuperUser cannot be logged in from this route" });
    }
    let availableIp = req.ip;
    if (availableIp.startsWith("::ffff:")) {
      availableIp = availableIp.slice("::ffff:".length);
    }
    if (req.session.ipAddress && req.session.loggedIn) {
      return res
        .status(400)
        .json({ message: "already logged in and has started the session " });
    }
    const compare = await comparePassword(password, checkUser.password);
    if (!compare) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const token = JWT.sign({ id: checkUser.id }, process.env.SECRET_SIGNATURE, {
      expiresIn: "1d",
    });
    const ipCheck = await ipaddress.findOne({
      where: { ipAddress: availableIp },
    });
    const location = ipCheck ? ipCheck.location : "remote";
    const attendance = await Attendance.create({
      userId: checkUser.id,
      ipAddress: availableIp,
      location,
      startTime: new Date(),
    });
    req.session.loggedIn = true;
    req.session.userId = checkUser.id;
    req.session.ipAddress = availableIp;
    req.session.loginTime = new Date();
    req.session.attendanceId = attendance.id;
    return res.status(200).json({
      status: true,
      message: "Successfully logged in as a user",
      token,
      attendance,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error while login", error });
  }
};
// office location

const isOfficeLocation = (location) => {
  const officeLocations = [
    "pf1-groundfloor",
    "pf1-firstfloor",
    "pf1-secondfloor",
  ];
  return officeLocations.includes(location);
};

//  mark attendance of the user

const markAttendance = async (userId, loginTime, logoutTime, attendanceId) => {
  try {
    const totalMinutes = Math.floor((logoutTime - loginTime) / (1000 * 60));
    const tMinutes = parseFloat(totalMinutes.toFixed(2));
    console.log("totalMinutes" + tMinutes);
    await Attendance.update(
      { totalMinutes: tMinutes, endTime: logoutTime },
      { where: { id: attendanceId } }
    );
    const attendanceData = await Attendance.findAll({
      attributes: [
        [
          Sequelize.fn("SUM", Sequelize.col("totalMinutes")),
          "totalAttendanceMinutes",
        ],
        "location",
      ],
      where: {
        userId: userId,
        createdAt: {
          [Op.gte]: new Date().setHours(0, 0, 0, 0),
          [Op.lte]: new Date().setHours(23, 59, 59, 999),
        },
      },
      group: ["location"],
    });
    //console.log(attendanceData);
    let remoteTotalMinutes = 0;
    let officeTotalMinutes = 0;
    attendanceData.forEach((attendance) => {
      const { totalAttendanceMinutes, location } = attendance.dataValues;
      if (location === "remote") {
        remoteTotalMinutes += parseInt(totalAttendanceMinutes);
      } else if (isOfficeLocation(location)) {
        officeTotalMinutes += parseInt(totalAttendanceMinutes);
      }
    });
    console.log("remote minutes:", remoteTotalMinutes);
    console.log("office minutes:", officeTotalMinutes);
    let totHours = (remoteTotalMinutes + officeTotalMinutes) / 60;
    totHours = parseFloat(totHours.toFixed(2));
    let officeTotalHours = officeTotalMinutes / 60;
    officeTotalHours = parseFloat(officeTotalHours.toFixed(2));

    let attendanceStatus = "absent";

    if (totHours >= 7.5) {
      if (officeTotalHours <= 3) {
        attendanceStatus = "absent";
      } else if (officeTotalHours > 3 && officeTotalHours < 5) {
        attendanceStatus = "halfday";
      } else if (officeTotalHours > 5) {
        attendanceStatus = "present";
      }
    }
    console.log("attendance status:", attendanceStatus);
    console.log("total hours:", totHours);
    const existingAttenStatus = await AttendanceStatus.findOne({
      where: { userId: userId, date: new Date().setHours(0, 0, 0, 0) },
    });
    console.log("existingattendance" + existingAttenStatus);
    if (existingAttenStatus) {
      await AttendanceStatus.update(
        { status: attendanceStatus, WorkingHourPerDay: totHours },
        { where: { id: existingAttenStatus.id } }
      );
    } else {
      await AttendanceStatus.create({
        userId: userId,
        date: new Date().setHours(0, 0, 0, 0),
        day: new Date().toLocaleString("en-US", { weekday: "long" }),
        WorkingHourPerDay: totHours,
        status: attendanceStatus,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
// logged out functionality
const userLogout = async (req, res) => {
  try {
    //console.log(req.session.loggedIn);
    if (!req.session.loggedIn) {
      return res.status(400).json({ message: "User is not logged in" });
    }
    const logoutTime = new Date();
    const loginTime = new Date(req.session.loginTime);
    markAttendance(
      req.session.userId,
      loginTime,
      logoutTime,
      req.session.attendanceId
    );
    req.session.destroy((error) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Error while logging out", error });
      }
      return res.status(200).json({ message: "Successfully logged out" });
    });
  } catch (error) {
    return res.status(500).json({ message: "Error while logging out", error });
  }
};
// fetching the user and his permissions
const fetchingUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ["password", "email"] },
      include: [Permissions],
    });
    if (!user) {
      return res.status(400).send({
        status: false,
        message: "User Does Not Exist",
        user,
      });
    }
    return res.status(200).send({
      status: true,
      message: "Successfully fetched the user",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error in fetching user details",
      error,
    });
  }
};

// deleting user and its permission
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return res.status(400).json({
        status: false,
        message: "User does not exist",
      });
    }
    if (existingUser.superUser) {
      return res.status(400).json({
        status: false,
        message: "SuperUser cannot be deleted",
      });
    }
    await User.destroy({
      where: { id: userId },
      include: [Permissions],
    });
    return res.status(200).json({
      status: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error in deleting user",
      error,
    });
  }
};
//updating the user details and his permissions
const updateUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      firstname,
      lastname,
      email,
      password,
      department,
      role,
      canRead,
      canCreate,
      canDelete,
      canUpdate,
    } = req.body;
    if (!firstname) {
      return res.status(400).json({ message: "firstname cannot be empty" });
    }
    if (!lastname) {
      return res.status(400).json({ message: "lastname cannot be empty" });
    }
    if (!email) {
      return res.status(400).json({ message: "email cannot be empty" });
    }
    if (!password) {
      return res.status(400).json({ message: "password cannot be empty" });
    }
    if (!department) {
      return res.status(400).json({ message: "department cannot be empty" });
    }
    if (!role) {
      return res.status(400).json({ message: "role cannot be empty" });
    }
    if (canRead === undefined) {
      return res.status(400).json({ message: "read access cannot be empty" });
    }
    if (canCreate === undefined) {
      return res.status(400).json({ message: "create access cannot be empty" });
    }
    if (canDelete === undefined) {
      return res.status(400).json({ message: "delete access cannot be empty" });
    }
    if (canUpdate === undefined) {
      return res.status(400).json({ message: "update access cannot be empty" });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "user doesnot exists",
      });
    }
    if (user.superUser) {
      return res.status(400).json({
        status: false,
        message: "super user cannot be update",
      });
    }
    await User.update(
      { firstname, lastname, email, password, department, role },
      { where: { id: userId } }
    );
    await Permissions.update(
      {
        create: canCreate,
        canUpdate: canUpdate,
        delete: canDelete,
        read: canRead,
      },
      { where: { id: userId } }
    );
    return res.status(200).json({
      status: true,
      message: "User and permissions updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error in updating user",
      error,
    });
  }
};

module.exports = {
  createUser,
  fetchingUser,
  deleteUser,
  userLogin,
  updateUserDetails,
  userLogout,
};

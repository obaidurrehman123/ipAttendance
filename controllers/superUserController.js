const { User, Permissions } = require("../models");
const JWT = require("jsonwebtoken");
const config = require("../config");
const {
  hashPassword,
  comparePassword,
} = require("../helpers/encryptDecryptPass");
const superUserCreate = {
  firstname: "obaid",
  lastname: "ur rehman",
  email: config.email,
  department: "Administration",
  role: "superadmin",
  superUser: true,
};
//creating superuser and his permissions
const addSuperUser = async (req, res) => {
  try {
    const existSuperUser = await User.findOne({
      where: { email: superUserCreate.email },
    });
    if (existSuperUser) {
      return res.status(400).json({
        status: false,
        message: "SuperUser cannot be created because it already exists",
      });
    }
    const hashedPassword = await hashPassword(config.password);
    const superUser = await User.create({
      firstname: superUserCreate.firstname,
      lastname: superUserCreate.lastname,
      email: superUserCreate.email,
      password: hashedPassword,
      department: superUserCreate.department,
      role: superUserCreate.role,
      superUser: superUserCreate.superUser,
    });

    const permissions = await Permissions.create({
      create: true,
      canUpdate: true,
      delete: true,
      read: true,
      userId: superUser.id,
    });
    const responseDetail = {
      id: superUser.id,
      firstname: superUser.firstname,
      lastname: superUser.lastname,
      department: superUser.department,
      role: superUser.role,
      superUser: superUser.superUser,
    };
    res.status(200).send({
      status: true,
      responseDetail,
      permissions,
    });
  } catch (error) {
    console.error("Error creating SuperUser:", error);
    res
      .status(500)
      .json({ message: "Error in creating super user", status: false });
  }
};
// fetching the superuser and his permissions
const getSuperUserDetails = async (req, res) => {
  try {
    const details = await User.findOne({
      where: { superUser: true },
      attributes: { exclude: ["password", "email"] },
      include: [Permissions],
    });
    res.status(200).json({
      message: "fetched successfully",
      status: true,
      details,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "error in fetching user",
    });
  }
};
//logged in as a super user
const superUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: "email cannot be empty" });
    }
    if (!password) {
      return res.status(400).json({ message: "password cannot be empty" });
    }
    const checkSuperUser = await User.findOne({ where: { email: email } });
    if (!checkSuperUser) {
      return res.status(400).json({
        status: false,
        message: "super user doesnot exists",
      });
    }
    const compare = await comparePassword(password, checkSuperUser.password);
    if (!compare) {
      return res.status(400).json({
        status: false,
        message: "incorrect password",
      });
    }
    const token = JWT.sign(
      { id: checkSuperUser.id },
      process.env.SECRET_SIGNATURE,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).json({
      status: true,
      message: "successfully logged in as a super user",
      token,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "error in loggin in as a super user",
    });
  }
};
module.exports = { addSuperUser, getSuperUserDetails, superUserLogin };

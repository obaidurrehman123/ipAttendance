const JWT = require("jsonwebtoken");
const { User } = require("../models");
const authenticateUser = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.SECRET_SIGNATURE
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Invalid Token",
    });
  }
};

const checkSupUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user.superUser) {
      res.status(500).json({
        success: false,
        message: "You are not a superuser,Invalid access !!",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Invalid super user",
    });
  }
};
module.exports = { authenticateUser, checkSupUser };

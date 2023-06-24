const { User, Permissions } = require("../models");
// middleware for creation
const productCreationAccess = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      include: Permissions,
    });
    if (user.superUser) {
      next();
    } else {
      const permissions = user.Permissions[0];
      if (permissions && permissions.create) {
        next();
      } else {
        res.status(400).json({
          message:
            "User is not a superuser and doesn't have the necessary access",
          success: false,
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: "Error in checking access",
      success: false,
    });
  }
};
// read access middleware
const productReadAccess = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      include: Permissions,
    });
    if (user.superUser) {
      next();
    } else {
      const permissions = user.Permissions[0];
      if (permissions && permissions.read) {
        next();
      } else {
        res.status(400).json({
          message:
            "User is not a superuser and doesn't have the necessary access",
          success: false,
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: "Error in checking access",
      success: false,
    });
  }
};
//product delete Access
const productDeleteAccess = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      include: Permissions,
    });
    if (user.superUser) {
      next();
    } else {
      const permissions = user.Permissions[0];
      if (permissions && permissions.delete) {
        next();
      } else {
        res.status(400).json({
          message:
            "User is not a superuser and doesn't have the necessary access",
          success: false,
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: "Error in checking access",
      success: false,
    });
  }
};
// update product Access
const productUpdateAccess = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      include: Permissions,
    });
    if (user.superUser) {
      next();
    } else {
      const permissions = user.Permissions[0];
      if (permissions && permissions.canUpdate) {
        console.log(permissions.canUpdate);
        next();
      } else {
        res.status(400).json({
          message:
            "User is not a superuser and doesn't have the necessary access",
          success: false,
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: "Error in checking access",
      success: false,
    });
  }
};
module.exports = {
  productCreationAccess,
  productReadAccess,
  productDeleteAccess,
  productUpdateAccess,
};

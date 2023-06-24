"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsTo(User, { foreignKey: "userId" });
    }
  }
  Permissions.init(
    {
      create: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      canUpdate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      delete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Permissions",
      tableName: "permissions",
    }
  );
  return Permissions;
};

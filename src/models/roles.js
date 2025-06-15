"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relasi dengan Users
      Roles.hasMany(models.Users, {
        foreignKey: "roleId",
        as: "users",
      });
    }
  }
  Roles.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Nama peran tidak boleh kosong",
          },
          len: {
            args: [3, 20],
            msg: "Nama peran harus antara 3 hingga 20 karakter",
          },
          is: {
            args: /^[a-zA-Z0-9]+$/i,
            msg: "Nama peran hanya boleh terdiri dari huruf, angka",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Roles",
      tableName: "roles",
    }
  );
  return Roles;
};

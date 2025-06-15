"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //relasi dengan roles
      Users.belongsTo(models.Roles, {
        foreignKey: "roleId",
        as: "role",
      });
      // Relasi dengan Posts
      Users.hasMany(models.Posts, {
        foreignKey: "userId",
        as: "posts",
      });
    }
  }
  Users.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
        validate: {
          len: {
            args: [3],
            msg: "Username harus antara 3 karakter",
          },

          isAlphanumeric: {
            msg: "Username hanya boleh terdiri dari huruf dan angka",
          },
        },
      },
      email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Format email tidak valid",
          },
        },
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: {
            args: [6],
            msg: "Password minimal 6 karakter",
          },
        },
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "Users",
      tableName: "users", // Nama tabel yang benar dalam DB (huruf kecil)
      hooks: {
        // Menggunakan bcrypt untuk mengenkripsi password sebelum menyimpan ke database
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10); // Gunakan versi async
            user.password = await bcrypt.hash(user.password, salt); // Gunakan versi async
          }

          // Set default role menjadi 'user' jika roleId belum diisi
          if (!user.roleId) {
            try {
              const Roles = sequelize.models.Roles;
              const userRole = await Roles.findOne({ where: { name: "User" } });
              if (userRole) {
                user.roleId = userRole.id;
              }
            } catch (error) {
              console.error("Error setting default role:", error);
            }
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );
  Users.prototype.CorrectPassword = async (reqPassword, userPassword) => {
    return await bcrypt.compare(reqPassword, userPassword);
  };
  return Users;
};

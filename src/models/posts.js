"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relasi dengan User
      Posts.belongsTo(models.Users, {
        foreignKey: "userId",
        as: "user",
      });

      // Relasi dengan Category
      Posts.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });
    }
  }
  Posts.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Judul tidak boleh kosong",
          },
          len: {
            args: [3, 50],
            msg: "Judul harus antara 3-50 karakter",
          },
          // Hindari karakter berbahaya
          is: {
            args: /^[a-zA-Z0-9\s\-_.,!?:;'"()[\]{}]+$/i,
            msg: "Judul hanya boleh berisi huruf, angka, dan tanda baca umum",
          },
        },
      },
      slug: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Konten tidak boleh kosong",
          },
          len: {
            args: [10],
            msg: "Konten harus antara 10 karakter",
          },
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Posts",
      tableName: "posts",
    }
  );
  return Posts;
};

/* eslint-disable no-unused-vars */
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("categories", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    // ✅ Tambahkan index dengan nama sederhana
    await queryInterface.addIndex("categories", ["name"]);
    await queryInterface.addIndex("categories", ["slug"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("categories");
  },
};

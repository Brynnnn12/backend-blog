/* eslint-disable no-unused-vars */
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("roles", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true, // Tambahkan unique constraint
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

    //index untuk kolom name
    await queryInterface.addIndex("roles", ["name"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("roles");
  },
};

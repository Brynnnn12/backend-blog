/* eslint-disable no-unused-vars */
"use strict";
const bcrypt = require("bcrypt");
const { v4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    // Hash password untuk admin
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Buat data admin di tabel Users
    await queryInterface.bulkInsert("Users", [
      {
        id: v4(),
        username: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        roleId: "25389a66-e8e3-4260-8f62-084dbb0eb3e9", // Pastikan roleId ini valid di tabel Roles
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};

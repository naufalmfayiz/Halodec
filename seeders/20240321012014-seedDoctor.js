'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    let doctors = require('../doctor.json').map(perDoc => {
      perDoc.createdAt = perDoc.updatedAt = new Date()
      return perDoc
    })
    // console.log(doctors)
    await queryInterface.bulkInsert('Doctors', doctors)
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Doctors', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Buses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      number_plate: {
        type: Sequelize.STRING,
      },
      manufacturer: {
        type: Sequelize.STRING,
      },
      model: {
        type: Sequelize.STRING,
      },
      year: {
        type: Sequelize.STRING,
      },
      capacity: {
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Buses'),
};
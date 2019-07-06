module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Trips', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      busId: {
        type: Sequelize.INTEGER,
      },
      origin: {
        type: Sequelize.STRING,
      },
      destination: {
        type: Sequelize.STRING,
      },
      trip_date: {
        type: Sequelize.DATE,
      },
      fare: {
        type: Sequelize.FLOAT,
      },
      status: {
        type: Sequelize.FLOAT,
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
  },
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Trips'),
};
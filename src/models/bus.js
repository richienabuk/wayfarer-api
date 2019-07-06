module.exports = (sequelize, DataTypes) => {
  const Bus = sequelize.define('Bus', {
    id: DataTypes.INTEGER,
    number_plate: DataTypes.STRING,
    manufacturer: DataTypes.STRING,
    model: DataTypes.STRING,
    year: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  }, {});
  Bus.associate = (models) => {
    // associations can be defined here
  };
  return Bus;
};

module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define('Trip', {
    id: DataTypes.INTEGER,
    busId: DataTypes.INTEGER,
    origin: DataTypes.STRING,
    destination: DataTypes.STRING,
    trip_date: DataTypes.DATE,
    fare: DataTypes.FLOAT,
    status: DataTypes.FLOAT,
  }, {});
  Trip.associate = (models) => {
    // associations can be defined here
  };
  return Trip;
};

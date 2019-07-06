module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: DataTypes.INTEGER,
    tripId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  }, {});
  Booking.associate = (models) => {
    // associations can be defined here
  };
  return Booking;
};

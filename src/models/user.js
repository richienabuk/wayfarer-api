module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: DataTypes.INTEGER,
    email: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter your email address',
      },
      unique: {
        args: true,
        msg: 'Email already exists',
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'Please enter a valid email address',
        },
      },
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter your first name',
      },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter your first name',
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter a password',
      },
      validate: {
        isNotShort: (value) => {
          if (value.length < 6) {
            throw new Error('Password should be atleast 6 characters')
          }
        },
      },
    },
    isAdmin: DataTypes.BOOLEAN,
  }, {});
  User.associate = (models) => {
    // associations can be defined here
  };
  return User;
};

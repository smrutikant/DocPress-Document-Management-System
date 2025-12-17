const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    provider: {
      type: DataTypes.ENUM('local', 'google', 'facebook'),
      defaultValue: 'local',
      allowNull: false
    },
    providerId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    profilePicture: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'users'
  });

  return User;
};

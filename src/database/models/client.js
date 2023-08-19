'use strict';
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    name: {
      type: DataTypes.TEXT,
    },
    phone: {
        type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Client.associate = function(models) {
    // associations can be defined here
    Client.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'author',
        onDelete: 'CASCADE',
      })
  };
  return Client;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullname: {
      type:DataTypes.STRING,
      allowNull: false
    },
    email: {
      type:DataTypes.STRING,
      unique: true,
      allowNull:false
    },
    password: DataTypes.TEXT,
    role: {
      type:DataTypes.ENUM('admin', 'staff'),
      defaultValue: 'staff'
    },
    branch: DataTypes.TEXT
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Matter, {
      foreignKey: 'userId',
      as: 'matters',
      onDelete: 'CASCADE',
    });

    User.hasMany(models.Task, {
      foreignKey: 'userId',
      as: 'tasks',
      onDelete: 'CASCADE',
    });

    User.hasMany(models.MatterType, {
      foreignKey: 'userId',
      as: 'mattertypes',
      onDelete: 'CASCADE',
    });

    User.hasMany(models.UpdateType, {
      foreignKey: 'userId',
      as: 'updatetypes',
      onDelete: 'CASCADE',
    });

    User.hasMany(models.Event, {
      foreignKey: 'userId',
      as: 'events',
      onDelete: 'CASCADE',
    });
  };
  return User;
};
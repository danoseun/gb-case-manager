'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstname: {
      type:DataTypes.STRING,
    },
    lastname: {
      type:DataTypes.STRING,
    },
    fullname: {
      type: DataTypes.STRING,
    },
    email: {
      type:DataTypes.STRING,
      unique: true
    },
    password: DataTypes.TEXT,
    role: {
      type:DataTypes.ENUM('admin', 'staff'),
      defaultValue: 'staff'
    },
    phone: {
      type:DataTypes.STRING
    },
    profile_picture: {
      type:DataTypes.TEXT
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

    User.hasMany(models.Update, {
      foreignKey: 'userId',
      as: 'updates',
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

    User.hasMany(models.MatterResource, {
      foreignKey: 'userId',
      as: 'matterresources',
      onDelete: 'CASCADE',
    });

    User.hasMany(models.UpdateResource, {
      foreignKey: 'userId',
      as: 'updateresources',
      onDelete: 'CASCADE',
    });
    
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      as: 'comments',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.Client, {
      foreignKey: 'userId',
      as: 'clients',
      onDelete: 'CASCADE',
    });
  };
  return User;
};
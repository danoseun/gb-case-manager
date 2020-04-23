'use strict';
module.exports = (sequelize, DataTypes) => {
  const UpdateType = sequelize.define('UpdateType', {
    name: DataTypes.TEXT,
    userId: {
      allowNull: false,
      type:DataTypes.INTEGER
    }
  }, {});
  UpdateType.associate = function(models) {
    // associations can be defined here
    UpdateType.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
    });

    UpdateType.belongsToMany(models.Matter, {
      foreignKey: 'updatetypeId',
      through: 'MatterUpdateTypes'
    });
  };
  return UpdateType;
};
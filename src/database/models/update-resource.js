'use strict';
module.exports = (sequelize, DataTypes) => {
  const UpdateResource = sequelize.define('UpdateResource', {
    userId: {
        type:DataTypes.INTEGER,
        allowNull: false,
      },
    updateId: {
        type: DataTypes.INTEGER
    },
    attached_resources: {
        type:DataTypes.ARRAY(DataTypes.JSONB),
        allownull: true,
        defaultValue: [] 
    }
  }, {});
  UpdateResource.associate = function(models) {
    // associations can be defined here
    UpdateResource.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
    });

    UpdateResource.belongsTo(models.Update, {
        foreignKey: 'updateId',
        as: 'update',
        onDelete: 'CASCADE',
      });
  };
  return UpdateResource;
};
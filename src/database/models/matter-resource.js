'use strict';
module.exports = (sequelize, DataTypes) => {
  const MatterResource = sequelize.define('MatterResource', {
    userId: {
        type:DataTypes.INTEGER,
        allowNull: false,
      },
    matterId: {
        type:DataTypes.INTEGER,
        allownull: false
    },
    attached_resources: {
        type:DataTypes.ARRAY(DataTypes.JSONB),
        allownull: true,
        defaultValue: [] 
    }
  }, {});
  MatterResource.associate = function(models) {
    // associations can be defined here
    MatterResource.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
    })

    MatterResource.belongsTo(models.Matter, {
        foreignKey: 'matterId',
        as: 'matter',
        onDelete: 'CASCADE',
      })
  };
  return MatterResource;
};
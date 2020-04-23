'use strict';
module.exports = (sequelize, DataTypes) => {
  const MatterType = sequelize.define('MatterType', {
    name: DataTypes.TEXT,
    userId: {
      allowNull: false,
      type:DataTypes.INTEGER
    }
  }, {});
  MatterType.associate = function(models) {
    // associations can be defined here
    MatterType.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
    })

    MatterType.hasMany(models.Matter, {
      foreignKey: 'mattertypeId',
      as: 'matters',
      onDelete: 'CASCADE',
    });
    
  };
  return MatterType;
};
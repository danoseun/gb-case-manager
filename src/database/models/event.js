'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    name: DataTypes.TEXT,
    venue: DataTypes.TEXT,
    date: DataTypes.DATE,
    employees_assigned: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allownull: true,
      defaultValue: [] 
    },
    userId: {
      type:DataTypes.INTEGER,
      allowNull: false,
    }
  }, {});
  Event.associate = function(models) {
    // associations can be defined here
    Event.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
    })
  };
  return Event;
};
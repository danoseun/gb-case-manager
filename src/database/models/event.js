'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    name: DataTypes.TEXT,
    venue: DataTypes.TEXT,
    date: DataTypes.DATE,
    employee_assigned: DataTypes.TEXT,
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
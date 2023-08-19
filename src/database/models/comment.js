'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: {
        type:DataTypes.TEXT
      },
    userId: {
        type:DataTypes.INTEGER,
        allowNull: false,
    },
    updateId: {
        type:DataTypes.INTEGER,
        allowNull: false
    }
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
    })

    Comment.belongsTo(models.Update, {
        foreignKey: 'updateId',
        as: 'update',
        onDelete: 'CASCADE',
      })
  };
  return Comment;
};
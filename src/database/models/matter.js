'use strict';
module.exports = (sequelize, DataTypes) => {
  const Matter = sequelize.define('Matter', {
    title: {
      allowNull:false,
      type:DataTypes.TEXT
    },
    code: {
      allowNull:false,
      type:DataTypes.INTEGER
    },
    contact_person: {
      allowNull:false,
      type:DataTypes.TEXT
    },
    start_date: {
      allowNull:false,
      type:DataTypes.DATE
    },
    end_date: DataTypes.DATE,
    description: {
      allowNull:false,
      type:DataTypes.TEXT
    },
    type: {
      allowNull:false,
      type:DataTypes.TEXT
    },
    assigned_lawyers: {
      allowNull:false,
      type:DataTypes.TEXT
    },
    assignee: {
      allowNull:false,
      type:DataTypes.TEXT
    },
    parties: DataTypes.TEXT,
    resources: DataTypes.TEXT,
    court_date: DataTypes.DATE,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mattertypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  Matter.associate = function(models) {
    // associations can be defined here
    Matter.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
    })

    Matter.belongsTo(models.MatterType, {
      foreignKey: 'mattertypeId',
      as: 'mattertype',
      onDelete: 'CASCADE',
    })

    Matter.hasMany(models.Task, {
      foreignKey: 'matterId',
      as: 'tasks',
      onDelete: 'CASCADE',
    });

    Matter.belongsToMany(models.UpdateType, {
      foreignKey: 'matterId',
      through: 'MatterUpdateTypes'
    });
  };
  return Matter;
};
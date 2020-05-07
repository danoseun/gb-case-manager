'use strict';
module.exports = (sequelize, DataTypes) => {
  const Matter = sequelize.define('Matter', {
    title: {
      type:DataTypes.TEXT
    },
    code: {
      type:DataTypes.TEXT
    },
    client: {
      type:DataTypes.ARRAY(DataTypes.STRING),
      allownull: true,
      defaultValue: [] 
    },
    start_date: {
      type:DataTypes.DATE
    },
    end_date: DataTypes.DATE,
    description: {
      type:DataTypes.TEXT
    },
    matter_type: {
      type:DataTypes.TEXT
    },
    assignees: {
      type:DataTypes.ARRAY(DataTypes.STRING),
      allownull: true,
      defaultValue: [] 
    },
    parties: DataTypes.TEXT,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.STRING,
    }
  }, {});
  Matter.associate = function(models) {
    // associations can be defined here
    Matter.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
    });

    Matter.hasMany(models.Task, {
      foreignKey: 'matterId',
      as: 'tasks',
      onDelete: 'CASCADE',
    });

    Matter.hasMany(models.Update, {
      foreignKey: 'matterId',
      as: 'updates',
      onDelete: 'CASCADE',
    });

    Matter.hasMany(models.MatterResource, {
      foreignKey: 'matterId',
      as: 'matterresources',
      onDelete: 'CASCADE',
    });
  };
  return Matter;
};
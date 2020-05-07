module.exports = (sequelize, DataTypes) => {
    const Update = sequelize.define('Update', {
      title: DataTypes.TEXT,
      description: DataTypes.TEXT,
      updatetype: DataTypes.STRING,
      case: DataTypes.TEXT,
      new_court_date: DataTypes.DATE,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      matterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }, {});
    Update.associate = (models) => {
      // associations
      Update.belongsTo(models.Matter, {
        foreignKey: 'matterId',
        as: 'matter',
        onDelete: 'CASCADE',
      });

      Update.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'author',
        onDelete: 'CASCADE',
      });
  
      Update.hasMany(models.Comment, {
        foreignKey: 'updateId',
        as: 'comments',
        onDelete: 'CASCADE',
      });

      Update.hasMany(models.UpdateResource, {
        foreignKey: 'updateId',
        as: 'updateresources',
        onDelete: 'CASCADE',
      });
    };
    return Update;
  };
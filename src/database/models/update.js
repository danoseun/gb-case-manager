module.exports = (sequelize, DataTypes) => {
    const Update = sequelize.define('Update', {
      title: DataTypes.TITLE,
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

      Update.hasMany(models.Resource, {
        foreignKey: 'updateId',
        as: 'resources',
        onDelete: 'CASCADE',
      });
    };
    return Update;
  };
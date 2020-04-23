module.exports = (sequelize, DataTypes) => {
    const MatterUpdateType = sequelize.define('MatterUpdateType', {
      matterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      updatetypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }, {});
    MatterUpdateType.associate = (models) => {
        MatterUpdateType.belongsTo(models.Matter, {
        foreignKey: 'matterId'
      });
      MatterUpdateType.belongsTo(models.UpdateType, {
        foreignKey: 'updatetypeId'
      });
    };
    return MatterUpdateType;
  };
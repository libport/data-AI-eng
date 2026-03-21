const { DataTypes, Model } = require('sequelize');

class Caption extends Model {}

module.exports = (sequelize) => {
  Caption.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      comment: {
        type: DataTypes.STRING(240),
        allowNull: false,
        validate: {
          len: [1, 240]
        }
      }
    },
    {
      sequelize,
      modelName: 'Caption',
      tableName: 'caption',
      indexes: [
        { fields: ['photo_id'] },
        { fields: ['user_id'] }
      ]
    }
  );

  return Caption;
};

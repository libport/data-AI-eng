const { DataTypes, Model } = require('sequelize');

class Photo extends Model {}

module.exports = (sequelize) => {
  Photo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING(120),
        allowNull: false,
        validate: {
          len: [2, 120]
        }
      },
      image_path: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      source: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      caption_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0
        }
      }
    },
    {
      sequelize,
      modelName: 'Photo',
      tableName: 'photo'
    }
  );

  return Photo;
};

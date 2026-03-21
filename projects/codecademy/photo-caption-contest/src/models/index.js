const sequelize = require('../config/database');

const User = require('./user')(sequelize);
const Photo = require('./photo')(sequelize);
const Caption = require('./caption')(sequelize);

User.hasMany(Caption, { foreignKey: 'user_id', as: 'captions', onDelete: 'CASCADE' });
Caption.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Photo.hasMany(Caption, { foreignKey: 'photo_id', as: 'captions', onDelete: 'CASCADE' });
Caption.belongsTo(Photo, { foreignKey: 'photo_id', as: 'photo' });

module.exports = {
  sequelize,
  User,
  Photo,
  Caption
};

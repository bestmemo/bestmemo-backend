const { Sequelize, Model, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'data', 'database.sqlite'),
});

class Card extends Model {}

Card.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  text: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'card',
});

class Collection extends Model {}

Collection.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'collection',
});

class Review extends Model {}

Review.init({
  time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  rating: {
    type: DataTypes.ENUM('easy', 'good', 'hard', 'again'),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'review',
});

Card.hasMany(Review, { foreignKey: 'master', sourceKey: 'id', onDelete: 'CASCADE' });
Review.belongsTo(Card, { foreignKey: 'master', targetKey: 'id' });

module.exports = {
  sequelize,
  Card,
  Collection,
  Review,
};

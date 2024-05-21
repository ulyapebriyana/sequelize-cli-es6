'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Product extends Model {

    static associate(models) {
      // define association here
      Product.hasMany(models.Transaction, { foreignKey: 'productId' })
    }
  }
  Product.init({
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.BIGINT,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};
'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, { foreignKey: 'userId' })
      Transaction.belongsTo(models.Product, { foreignKey: 'productId' })
    }
  }
  Transaction.init({
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};
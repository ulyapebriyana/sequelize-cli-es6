'use strict';

import { Model } from 'sequelize';
import bcrypt from "bcrypt"

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.Transaction, { foreignKey: 'userId' })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    status: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    last_login_at: DataTypes.DATE,
    last_ip_address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
      }
    }
  });
  return User;
};
import { Op } from 'sequelize';
import model from '../models';
import { errorResponse, successResponse } from '../helpers/statusResponseJson';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"

const { User } = model;

export default {
  async signUp(req, res) {
    const { email, password, name, phone } = req.body;
    try {
      const user = await User.findOne({ where: { [Op.or]: [{ phone }, { email }] } });
      if (user) {
        return errorResponse(res, 409, "User with that email or phone already exists")
      }

      await User.create({
        name,
        email,
        password,
        phone,
      });
      return successResponse(res, 201, "Account created successfully")
    } catch (error) {
      return errorResponse(res, 500, error, error)
    }
  },

  async signIn(req, res) {
    const { email, password } = req.body
    try {
      const user = await User.findOne({
        where: { email }
      })
      if (!user) return errorResponse(res, 404, "User not found")
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) return errorResponse(res, 400, "Password invalid")

      const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })
      const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })

      await user.update({ refreshToken })

      const responseData = {
        id: user.id,
        email: user.email,
        accessToken
      };

      res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      return successResponse(res, 200, "User logged in successfully", responseData)

    } catch (error) {
      return errorResponse(res, 500, error, error)
    }
  },

  async currentUser(req, res) {
    const currentUser = req.currentUser
    try {
      const user = await User.findOne({ where: { id: currentUser.id } })
      return successResponse(res, 200, "ok", user)
    } catch (error) {
      return errorResponse(res, 500, error, error)
    }
  },

  async refreshToken(req, res) {
    const currentUser = req.currentUser
    try {
      const user = await User.findByPk(currentUser.id)
      const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })
      const responseData = {
        id: user.id,
        email: user.email,
        accessToken
      };

      return successResponse(res, 200, "refresh token successfully", responseData)
    } catch (error) {
      return errorResponse(res, 500, error, error)
    }
  },

  async signOut(req, res) {
    const currentUser = req.currentUser
    try {
      const user = await User.findByPk(currentUser.id)
      user.update({ refreshToken: null })
      
      res.clearCookie('refreshToken');
      return successResponse(res, 200, "User logged out successfully")
    } catch (error) {
      return errorResponse(res, 500, error, error)
    }
  }

}
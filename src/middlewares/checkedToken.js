import { errorResponse } from "../helpers/statusResponseJson"
import jwt from "jsonwebtoken"
import model from '../models';

const { User } = model;

export const checkAccesToken = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) return errorResponse(res, 400, "Must be provided the token in cookie")

  try {
    const accessToken = token.split(' ')[1]
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        return errorResponse(res, 400, "Something wrong with token", err)
      }
      req.currentUser = decoded
      next()
    })
  } catch (error) {
    return errorResponse(res, 500, error, error)
  }
}

export const checkRefreshToken = async (req, res, next) => {
  const { refreshToken } = req.cookies
  try {
    if (!refreshToken) return errorResponse(res, 400, "Must be provided the token in cookie")
    const user = await User.findAll({ where: { refreshToken } })
    if (!user[0]) return errorResponse(res, 404, "Token not found!, please sign in again.")
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        return errorResponse(res, 400, "Something wrong with token", err)
      }
      req.currentUser = decoded
      next()
    })
  } catch (error) {
    return errorResponse(res, 500, error, error)
  }
}
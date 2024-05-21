import { Op } from "sequelize"
import { errorResponse, getPaginate, successResponse } from "../helpers/statusResponseJson"
import model from "../models"

const { Transaction, User, Product } = model

let self = {}

self.createTransactionController = async (req, res) => {
  const currentUser = req.currentUser
  try {
    const user = await User.findByPk(currentUser.id)
    const transaction = await user.createTransaction({ ...req.body })
    return successResponse(res, 201, "Transaction created succcessfully", transaction)
  } catch (error) {
    return errorResponse(res, 500, error, error)
  }
}

self.getAllTransactionController = async (req, res) => {
  const page = +req.query.page || 1
  const limit = +req.query.limit || 10
  const offset = (page - 1) * limit

  const currentUser = req.currentUser

  try {
    const { count, rows } = await Transaction.findAndCountAll({
      where: {
        "$User.email$": currentUser.email,
      },
      limit,
      offset,
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: Product }
      ]
    })
    return successResponse(res, 200, "Get all success", getPaginate(count, rows, page, limit))
  } catch (error) {
    return errorResponse(res, 500, error, error)
  }
}

export default self
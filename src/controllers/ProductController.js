import { errorResponse, successResponse } from "../helpers/statusResponseJson"
import model from "../models"

const { Product } = model

let self = {}

self.createProductController = async (req, res) => {
  try {
    const product = await Product.create({ ...req.body })
    return successResponse(res, 201, "Created product successfully", product)
  } catch (error) {
    return errorResponse(res, 500, error, error)
  }
}

export default self
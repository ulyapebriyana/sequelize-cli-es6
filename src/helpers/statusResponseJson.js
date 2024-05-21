export const successResponse = (res, status, message, data) => {
  return res.status(status).json({
    status,
    message,
    data
  })
}

export const errorResponse = (res, status, message, error) => {
  if (status === 500) {
    console.log(error);
    return res.status(status).json({
      status,
      message: 'Internal Server Error',
      error
    })
  } else {
    return res.status(status).json({
      status,
      message,
      error
    })
  }
}

export const getPaginate = (count, rows, page, limit) => {
  return {
    page,
    totalItems: count,
    totalPage: Math.ceil(count / limit),
    result: rows
  }
}
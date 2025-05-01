const getPagination = (requestQuery) => {
    const page = Math.abs(requestQuery.page) || 1
    const limit = Math.abs(requestQuery.limit) || 0 // 0 will get all data
    const skip = (page - 1) * limit

    return {
        skip,
        limit
    }
}

module.exports = { getPagination }
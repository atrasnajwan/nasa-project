interface RequestQuery {
    page?: number
    limit?: number
}

interface Pagination {
    skip: number
    limit: number
}
function getPagination(requestQuery: RequestQuery): Pagination {
    const page = requestQuery.page ? Math.abs(requestQuery.page) : 1
    const limit = requestQuery.limit ? Math.abs(requestQuery.limit) : 0 // 0 will get all data
    const skip = (page - 1) * limit

    return {
        skip,
        limit
    }
}

export { getPagination }
import { Pagination } from "proto/beatroute/common/response";

export abstract class PaginationHelper {
    public static getPagination(page: number, totalCount: number, pageSize: number): Pagination {
        const pageCount = Math.ceil(totalCount / pageSize);
        
        return {
            currentPage: page,
            totalCount: totalCount,
            perPage: pageSize,
            pageCount: pageCount,
        };
    }
}

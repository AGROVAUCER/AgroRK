"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePagination = void 0;
const parsePagination = (query) => {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(query.pageSize, 10) || 20, 1), 100);
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    return { page, pageSize, skip, take };
};
exports.parsePagination = parsePagination;

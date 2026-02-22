export const parsePagination = (query: any) => {
  const page = Math.max(parseInt(query.page as string, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(query.pageSize as string, 10) || 20, 1), 100);
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  return { page, pageSize, skip, take };
};

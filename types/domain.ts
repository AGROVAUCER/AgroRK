export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export type WithOrg<T> = T & { orgId: string };

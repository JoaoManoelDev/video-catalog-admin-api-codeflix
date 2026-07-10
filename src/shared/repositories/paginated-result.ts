export interface IPaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface IPaginatedResult<T> {
  items: T[];
  meta: IPaginationMeta;
}

export function createPaginationMeta(
  page: number,
  perPage: number,
  total: number,
): IPaginationMeta {
  return {
    page,
    perPage,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / perPage),
  };
}

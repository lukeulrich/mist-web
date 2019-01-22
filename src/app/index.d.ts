interface Search<matchType> {
  count?: boolean;
  errorMessage: string;
  isFetching: boolean;
  links: {
    first?: string;
    last?: string;
    next?: string;
    prev?: string;
  },
  matches: matchType[];
  page: number;
  perPage: number;
  query: string;
  totalCount: number;
}

interface Pagination {
  count?: boolean;
  page?: number;
  perPage?: number;
}

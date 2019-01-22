import { assign, map } from 'lodash';

import * as Genomes from './genomes.actions';

export interface State {
  all: {
    [accession: string]: Genome,
  };
  search: GenomesSearch;
}

const initialState: State = {
  all: {},
  search: {
    count: true,
    errorMessage: null,
    isFetching: false,
    links: {},
    matches: [],
    page: null,
    perPage: 30,
    query: null,
    totalCount: null,
  },
};

export const reducer = (state = initialState, action: Genomes.Actions) => {
  switch (action.type) {
    case Genomes.SEARCH:
      return {
        ...state,
        search: {
          ...state.search,
          links: {},
          matches: [],
          page: null,
          query: action.payload,
          totalCount: null,
        },
    };

    case Genomes.LOCAL_MATCHES:
      return {
        ...state,
        search: {
          ...state.search,
          matches: action.payload,
          page: action.payload.length ? 0 : null,
        },
      };

    case Genomes.FETCH:
      const url = action.payload;
      if (url) {
        return {
          ...state,
          search: {
            ...state.search,
            errorMessage: null,
            isFetching: true,
          },
        };
      }
      break;

    case Genomes.FETCH_DONE:
      const { payload } = action;
      const { matches: genomes } = payload;
      return {
        ...state,
        all: assign({}, state.all, genomes.reduce((result, genome) => {
            result[genome.accession] = genome;
            return result;
          }, {})),
        search: {
          ...state.search,
          isFetching: false,
          links: payload.links,
          matches: map(genomes, 'accession'),
          totalCount: payload.totalCount,
        },
      };

    case Genomes.FETCH_ERROR:
      return {
        ...state,
        search: {
          ...state.search,
          errorMessage: action.payload,
          isFetching: false,
        },
      };

    case Genomes.NEXT_PAGE:
      if (!state.search.links.next) {
        break;
      }
      return {
        ...state,
        search: {
          ...state.search,
          page: state.search.page + 1,
        },
      };
  }

  return state;
};

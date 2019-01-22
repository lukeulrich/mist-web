import { createSelector } from '@ngrx/store';
import { some } from 'lodash';

import { State } from '../app.reducers';
import { splitIntoTerms } from '../core/util';
import { State as GenomesState } from './genomes.reducers';

export const selectGenomes = (state: State) =>
  state.genomes;

export const getAllGenomes = createSelector(
  selectGenomes,
  (state) => state.all,
);

export const search = createSelector(
  selectGenomes,
  (state) => state.search,
);

export const getSearchQuery = createSelector(
  search,
  (searchState) => searchState.query,
);

export const getSearchIsFetching = createSelector(
  search,
  (searchState) => searchState.isFetching,
);

export const getSearchErrorMessage = createSelector(
  search,
  (searchState) => searchState.errorMessage,
);

export const getSearchResults = createSelector(
  search,
  getAllGenomes,
  (searchState, all) => searchState.matches.map((accession: Accession) => all[accession]),
);

export const pageUrl = (pageType: 'first' | 'last' | 'prev' | 'next') => {
  return createSelector(
    search,
    (searchState) => searchState.links[pageType],
  );
};

export const getLocalMatches = createSelector(
  getAllGenomes,
  getSearchQuery,
  (all, query) => {
    const searchTerms = splitIntoTerms(query);
    if (!searchTerms.length) {
      return [];
    }

    const searchRegexs = searchTerms.map((searchTerm) => new RegExp(searchTerm, 'i'));
    return Object.keys(all)
      .map((accession: Accession) => all[accession])
      .filter((genome: Genome) => {
        return some(searchRegexs, (searchRegex) => searchRegex.test(genome.name));
      })
      .map((genome: Genome) => genome.accession);
  },
);

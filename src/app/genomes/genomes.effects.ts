import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/withLatestFrom';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { HeaderName } from '../core/header-names';
import { MistApi } from '../core/services/mist-api.service';
import * as genomes from './genomes.actions';
import { getLocalMatches, pageUrl, search } from './genomes.selectors';

@Injectable()
export class GenomesEffects {
  static DEBOUNCE_TIME_MS = 300;

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType<genomes.Search>(genomes.SEARCH)
    .map((action) => action.payload)
    .withLatestFrom(this.store.select(search))
    .map(([query, searchState]) => {
      const url = this.mistApi.searchGenomesUrl(query, searchState);
      return new genomes.Fetch(url);
    });

  @Effect()
  localMatches$: Observable<Action> = this.actions$
    .ofType<genomes.LocalMatches>(genomes.SEARCH)
    .switchMap(() => this.store.select(getLocalMatches).take(1))
    .map((accessions) => new genomes.LocalMatches(accessions));

  @Effect()
  fetch$: Observable<Action> = this.actions$.ofType<genomes.Fetch>(genomes.FETCH)
    .debounceTime(GenomesEffects.DEBOUNCE_TIME_MS)
    .map((action) => action.payload)
    .switchMap((url) => {
      const nextFetch$ = this.actions$.ofType<genomes.Fetch>(genomes.FETCH).skip(1);

      return this.http.get(url)
        .takeUntil(nextFetch$)
        .map((response) => {
          // TODO
          // a) Extract the links, count, page
          // c) Abstract into helper functions
          const matches = response.json();
          return new genomes.FetchDone({
            matches,
            totalCount: parseInt(response.headers.get(HeaderName.TotalCount), 10),
          });
        })
        .catch((error) => of(new genomes.FetchError(error.message)));
    });

  @Effect()
  firstPage$: Observable<Action> = this.actions$.ofType<genomes.FirstPage>(genomes.FIRST_PAGE)
    .switchMap(() => this.store.select(pageUrl('first')))
    .map((url) => new genomes.Fetch(url));

  @Effect()
  lastPage$: Observable<Action> = this.actions$.ofType<genomes.LastPage>(genomes.LAST_PAGE)
    .switchMap(() => this.store.select(pageUrl('last')))
    .map((url) => new genomes.Fetch(url));

  @Effect()
  prevPage$: Observable<Action> = this.actions$.ofType<genomes.PrevPage>(genomes.PREV_PAGE)
    .switchMap(() => this.store.select(pageUrl('prev')))
    .map((url) => new genomes.Fetch(url));

  @Effect()
  nextPage$: Observable<Action> = this.actions$.ofType<genomes.NextPage>(genomes.NEXT_PAGE)
    .switchMap(() => this.store.select(pageUrl('next')))
    .map((url) => new genomes.Fetch(url));

  constructor(
    private http: Http,
    private actions$: Actions,
    private mistApi: MistApi,
    private store: Store<any>,
  ) {}
}

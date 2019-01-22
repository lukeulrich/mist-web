import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';

@Injectable()
export class MistApi {
  static BASE_URL = 'https://api.mistdb.com/v1';
  static GENOMES_ROOT = '/genomes';

  searchGenomesUrl(query: string, pagination?: Pagination): string {
    let url = MistApi.BASE_URL + MistApi.GENOMES_ROOT;
    if (pagination) {
      const parts = [];
      if (pagination.count) {
        parts.push('count');
      }
      if (pagination.page) {
        parts.push(`page=${pagination.page}`);
      }
      if (pagination.perPage) {
        parts.push(`per_page=${pagination.perPage}`);
      }
      if (parts.length) {
        url += '?' + parts.join('&');
      }
    }
    return url;
  }
}

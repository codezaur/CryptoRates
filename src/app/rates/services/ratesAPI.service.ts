import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY, Subject, of, from, BehaviorSubject, Observable } from 'rxjs';

import { APIResponse } from '../interfaces/apiResponse.interface';
// import { bitbayURL, bitfinexURL } from '../constants/markets';
import { bitbayBTCQuery, bitbayETHQuery, bitbayLTCQuery,
         bitfinexBTCQuery, bitfinexETHQuery, bitfinexLTCQuery} from '../constants/queries';


@Injectable({providedIn: 'root'})

export class RatesAPIService {

  public ratesBTCSubject$ = new Subject();
  public ratesETHSubject$ = new Subject();
  public ratesLTCSubject$ = new Subject();
  public ratesSubject$ = new Subject<APIResponse>();

  constructor(private http: HttpClient) {}

  public getRatesWS(market: string, initMsg: string): void {
    console.log('%c[--- getratesWS :]', 'color:lime', market, ', ', initMsg);
    const stream = new WebSocket(market);
    stream.onopen = (e: MessageEvent) => {
      stream.send(initMsg);
      stream.onmessage = (m: MessageEvent) => this.ratesSubject$.next({market, initMsg, WSMsg: of(m)});
  };
}

public getRatesREST(market: string): Promise<object|any> {
  return this.http.get(market).toPromise();
}

}

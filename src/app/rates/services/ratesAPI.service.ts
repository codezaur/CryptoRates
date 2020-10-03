import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY, Subject, BehaviorSubject, Observable } from 'rxjs';

// import { bitbayURL, bitfinexURL } from '../constants/markets';
import { bitbayBTCQuery, bitbayETHQuery, bitbayLTCQuery,
         bitfinexBTCQuery, bitfinexETHQuery, bitfinexLTCQuery} from '../constants/queries';


@Injectable({providedIn: 'root'})

export class RatesAPIService {

  public ratesBTCSubject$ = new Subject();
  public ratesETHSubject$ = new Subject();
  public ratesLTCSubject$ = new Subject();
  public ratesSubject$ = new Subject();

  constructor(private http: HttpClient) {}

  public getRatesWS(market: string, initMsg: string): void {
    // console.log('%c[--- market :]', 'color:lime', market);
    const stream = new WebSocket(market);
    stream.onopen = (e: MessageEvent) => {
      stream.send(initMsg);
      stream.onmessage = (m: MessageEvent) => {
        console.log('%c[--- m :]', 'color:lime', m);
        // console.log('%c[--- m :]', 'color:lime', m.origin);
        const data = JSON.parse(m.data);
        if (data.topic) {
          this.ratesSubject$.next(m);
        }

    };
  };
}

public getRatesREST(market: string): Promise<object|any> {
  return this.http.get(market).toPromise();
}

}

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
    const stream = new WebSocket(market);
    stream.onopen = (e: MessageEvent) => {
      stream.send(initMsg);
      stream.onmessage = (m: MessageEvent) => {
        const data = JSON.parse(m.data);

        if (data.topic) {
          this.ratesSubject$.next(m);
        //   if ((data.topic as string).includes('btc')) {
        //     this.ratesBTCSubject$.next(m);
        // } else if ((data.topic as string).includes('eth')) {
        //     this.ratesETHSubject$.next(m);
        // } else if ((data.topic as string).includes('ltc')) {
        //   this.ratesLTCSubject$.next(m);
        // }
        }

    };
  };
}

public getRatesREST(market: string): Promise<object|any> {
  return this.http.get(market).toPromise();
  // try {
  //   const initTraidingPairs: Promise<any> = this.http.get(market).toPromise() ;
  //   // console.log('---btcInit: ', btcInit);
  //   return initTraidingPairs;
  // } catch (e) {
  //   console.log('---err: ', e);
  // }
}

}

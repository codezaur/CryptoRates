import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY, Subject, BehaviorSubject } from 'rxjs';

import { bitbayURL, bitfinexURL } from '../constants/markets';
import { bitbayBTCQuery, bitbayETHQuery, bitbayLTCQuery,
         bitfinexBTCQuery, bitfinexETHQuery, bitfinexLTCQuery} from '../constants/queries';


@Injectable({providedIn: 'root'})

export class RatesWSService {

  public ratesBTCSubject$ = new Subject();
  public ratesETHSubject$ = new Subject();
  public ratesLTCSubject$ = new Subject();

  public getRatesWS(market: string, initMsg: string): void {
    const stream = new WebSocket(market);
    stream.onopen = (e: MessageEvent) => {
      stream.send(initMsg);
      stream.onmessage = (m: MessageEvent) => {
        const data = JSON.parse(m.data);

        if (data.topic) {
          if ((data.topic as string).includes('btc')) {
            this.ratesBTCSubject$.next(m);
        } else if ((data.topic as string).includes('eth')) {
            this.ratesETHSubject$.next(m);
        } else if ((data.topic as string).includes('ltc')) {
          this.ratesLTCSubject$.next(m);
        }
        }

    };
  };
}

}

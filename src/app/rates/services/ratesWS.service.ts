import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';

import { bitbayURL, bitfinexURL } from '../constants/markets';
import { bitbayBTCQuery, bitbayETHQuery, bitbayLTCQuery,
         bitfinexBTCQuery, bitfinexETHQuery, bitfinexLTCQuery} from '../constants/queries';


@Injectable({providedIn: 'root'})

export class RatesWSService {

  public ratesSubject$ = new Subject();

  public getRatesWS(market: string = bitbayURL, initMsg: string = bitbayBTCQuery): void {
    const stream = new WebSocket(market);
    stream.onopen = (e: MessageEvent) => {
      stream.send(initMsg);
      stream.onmessage = (m: MessageEvent) => this.ratesSubject$.next(m);
    };
  }

}

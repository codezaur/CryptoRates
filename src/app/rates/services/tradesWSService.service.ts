import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll } from 'rxjs/operators';

import { bitbayURL, bitfinexURL } from '../constants/markets';
import { bitbayBTCQuery, bitbayETHQuery, bitbayLTCQuery,
         bitfinexBTCQuery, bitfinexETHQuery, bitfinexLTCQuery} from '../constants/queries';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})

export class TradesWSService {
  private socket$: WebSocketSubject<any>;
  private messagesSubject$ = new Subject();
  private messages$ = this.messagesSubject$.pipe(
    switchAll(),
    catchError((e => { throw e; }))
  );

public establishWSConnection(market: string = bitbayURL): void {


}

public sendRates(rates: string): void {
  this.socket$.next(rates);
}

private getNewWS(marketURL: string): WebSocketSubject<string> {
  return webSocket(marketURL);
}

private closeWS(): void {
  this.socket$.complete();
 }

}

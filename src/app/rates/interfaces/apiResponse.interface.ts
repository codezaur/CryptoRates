import { Observable } from 'rxjs';

export interface APIResponse {
  market: string;
  initMsg: string;
  WSMsg: Observable<MessageEvent>;
}

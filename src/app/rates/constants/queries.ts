/* tslint:disable: quotemark */
/* tslint:disable: object-literal-key-quotes */

export const bitbayBTCQuery: string = JSON.stringify({
                            "action": "subscribe-public",
                            "module": "trading",
                            "path": "orderbook/btc-usd"});

export const bitbayETHQuery: string = JSON.stringify({
                            "action": "subscribe-public",
                            "module": "trading",
                            "path": "orderbook/eth-usd"});

export const bitbayLTCQuery: string = JSON.stringify({
                            "action": "subscribe-public",
                            "module": "trading",
                            "path": "orderbook/ltc-usd"});

export const bitfinexBTCQuery: string = JSON.stringify({
                              event: 'subscribe',
                              channel: 'ticker',
                              symbol: 'tBTCUSD' });

export const bitfinexETHQuery: string = JSON.stringify({
                              event: 'subscribe',
                              channel: 'ticker',
                              symbol: 'tETHUSD' });

export const bitfinexLTCQuery: string = JSON.stringify({
                              event: 'subscribe',
                              channel: 'ticker',
                              symbol: 'tLTCUSD' });

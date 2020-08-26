import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  // https://www.reddit.com/r/BinanceExchange/comments/85xcap/is_websocket_multistream_broken/
  // stream =  new WebSocket('wss://stream.binance.com:9443');
  // stream =  new WebSocket('wss://ws.cex.io/ws/');
  // stream: WebSocket =  new WebSocket('wss://ws.blockchain.info/inv');
  stream: WebSocket =  new WebSocket('wss://api.bitbay.net/websocket/');

  // query: string = JSON.stringify({
  //               "action": "subscribe-public",
  //               "module": "trading",
  //               "path": "ticker/btc-usd"
  //               });
  query: string = JSON.stringify({
                "action": "subscribe-public",
                "module": "trading",
                "path": "orderbook/btc-usd"
                });
  // query: string = JSON.stringify({"op":"unconfirmed_sub"});
  // query: string = JSON.stringify({});
  // query: string = JSON.stringify({"op":"blocks_sub"});

  constructor() { }

  ngOnInit() {
    this.run();
  }

  run() {
    // this.stream.onmessage = (m: MessageEvent) => console.log('message: ', m.data);

    this.stream.onopen = (e: Event) => {
      console.log('ws OPEN: ', e);
      this.stream.send(this.query);
      this.stream.onmessage = (m: MessageEvent) => console.log('message: ', JSON.parse(m.data));
      // setTimeout(() => {
      //   this.stream.close();
      // }, 2000);
    };
    }

  }


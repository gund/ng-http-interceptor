import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { HttpInterceptorService } from 'ng2-http-interceptor';
import 'rxjs/add/operator/do';

@Component({
  // tslint:disable-next-line:component-selector-prefix
  selector: 'my-app',
  template: `
    <div class="loaded-app">
      <h2>Ng2 Http Interceptor Demo</h2>
      <p>
        <input type="text" placeholder="Type URL" #url>
        <button (click)="makeRequest(url.value)">Make request</button>
      </p>
      <p>Requests log:</p>
      <div class="requests">
        <p *ngFor="let request of requests; let i = index;">
          #{{ i + 1 }}: <b>{{ request.method | uppercase }}</b> request to <i>{{ request.url }}</i>
        </p>
      </div>
      <p>Response:</p>
      <p class="error" *ngIf="error">Error: {{ error }}</p>
      <pre><code class="response">{{ res | json }}</code></pre>
    </div>
  `,
})
export class AppComponent implements OnInit {
  requests = [];
  res = null;
  error = null;

  constructor(
    private http: Http,
    private httpInterceptor: HttpInterceptorService
  ) {
    this.httpInterceptor.request().addInterceptor((data, method) => {
      this.error = null;
      this.requests.push({
        method: method,
        url: data[0]
      });

      return data;
    });

    this.httpInterceptor.response().addInterceptor(
      res => res.do(null, e => this.error = e));
  }

  ngOnInit() {
    this.makeRequest();
  }

  makeRequest(url = '/') {
    this.http.get(url).subscribe(r => this.res = r.text());
  }
}

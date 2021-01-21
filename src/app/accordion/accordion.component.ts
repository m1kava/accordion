import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent {
  url ='https://www.lionsbet.com/rest/market/categories';
  items = [];

  constructor(private http: HttpClient) { 
    this.http.get(this.url).toPromise().then(data => {
      console.log(data);

      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          this.items.push(data[key]);
        }
      }
    });
  }
}

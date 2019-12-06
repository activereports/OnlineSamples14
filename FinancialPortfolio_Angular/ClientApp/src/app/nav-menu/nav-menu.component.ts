import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  public stocks: ReportInfo[];
  public selectedTicker: string;
  public selectedCompany: string;

  constructor( private appService: AppComponent, http: HttpClient, router: Router, @Inject('BASE_URL') baseUrl: string) {
    http.get(baseUrl + 'Data/Stocks.xml', { responseType: 'text' }).subscribe(result => {
      const parser = new DOMParser(); // initialize dom parser
      const xmlStocklist = parser.parseFromString(result, 'text/xml'); // convert dom string to dom tree
      const stocklist = [].slice.call(xmlStocklist.getElementsByTagName('Company')) || [] as any;
      this.stocks = stocklist.map(item => ({ name: item.getAttribute('Name'), ticker: item.getAttribute('Ticker') })) as ReportInfo[];
      // set initial state
      this.selectedTicker = this.stocks[0].ticker;
      this.selectedCompany = this.stocks[0].name;
      // navigate to the selected ticket
      router.navigate(['/view', this.selectedTicker]).then(() => {
        appService.setReportName(this.selectedCompany);
      });
    }, error => console.error(error));
  }

  changeSelection = (ticker, company) => {
    this.selectedTicker = ticker;
    this.selectedCompany = company;
    this.appService.setReportName(company);
  }
}

interface ReportInfo {
  name: string;
  ticker: string;
}

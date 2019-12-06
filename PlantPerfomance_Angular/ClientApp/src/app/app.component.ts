import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedTicker = '';
  locations: Locations[] = [];

  constructor(private router: Router) {
    this.locations = [
      { name: 'Atlanta', ticker: 'ATL' },
      { name: 'Chicago', ticker: 'ORD' },
      { name: 'Santa Fe', ticker: 'SAF' },
      { name: 'Portland', ticker: 'PDX' },
      { name: 'Dallas', ticker: 'DFW' },
      { name: 'Memphis', ticker: 'MEM' },
    ];
    // set initial ticker
    this.selectedTicker = this.locations[0].ticker;
    // navigate to default route
    this.router.navigate(['/view', this.selectedTicker]);
  }

  changeLocation = (ticker: string) => {
    this.selectedTicker = ticker;
    // navigate to the selected ticket
    this.router.navigate(['/view', this.selectedTicker]);
  }
}

interface Locations {
  name: string;
  ticker: string;
}

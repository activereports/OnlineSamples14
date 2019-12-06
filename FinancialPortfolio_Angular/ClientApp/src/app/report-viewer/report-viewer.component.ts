import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { AppComponent } from '../app.component';
declare var GrapeCity: any;

@Component({
  selector: 'app-report-viewer',
  templateUrl: './report-viewer.component.html',
  styleUrls: ['./report-viewer.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ReportViewerComponent {
  private viewer: any;

  @Input()
  set tickerId(tickerId: string) {
    const viewerRoot = this.el.nativeElement.querySelector('#viewerPlaceHolder');
    const reportID = 'AnnualStockTicker.rdlx';
    const reportParameters = [
      { name: 'Company', values: [tickerId] },
      { name: 'TradingYear', values: [2015] }
    ];

    if (!this.viewer) {
      this.viewer = GrapeCity.ActiveReports.JSViewer.create({
        element: viewerRoot,
        reportID,
        reportParameters,
        renderMode: 'Galley',
        error: (error) => console.error(error),
        action: (action) => this.handleViewerAction(action),
        reportLoaded: () => {
          this.appService.onLoadDocument();
          this.viewer.toolbar.toggle(this.appService.isDisplayUI.value);
          this.viewer.sidebar.toggle(this.appService.isDisplayUI.value);
        },
      });
    } else {
      this.viewer.openReport(reportID, reportParameters);
    }
  }

  constructor(private appService: AppComponent, private el: ElementRef) {
    appService.isDisplayUI$.subscribe(
      isVisible => {
        if (this.viewer) {
          this.viewer.toolbar.toggle(isVisible);
          this.viewer.sidebar.toggle(isVisible);
        }
      });

    appService.backToParent$.subscribe(
      () => {
        if (this.viewer) {
          this.viewer.backToParent();
        }
      });
  }

  handleViewerAction = (actionType) => {
    if (actionType === 'drillthrough') {
      this.appService.moveToChild();
    }
  }
}

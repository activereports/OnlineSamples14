import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
declare var GrapeCity: any;

@Component({
  selector: 'app-report-viewer',
  templateUrl: './report-viewer.component.html',
  styleUrls: ['./report-viewer.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ReportViewerComponent {
  private viewer: any = null;

  @Input()
  set tickerId(tickerId: string) {
    const viewerRoot = this.el.nativeElement.querySelector('#viewerPlaceHolder');
    const reportID = 'PlantPerformance.rdlx';
    const reportParameters = [{ name: 'Location', values: [tickerId] }];

    if (!this.viewer) {
      this.viewer = GrapeCity.ActiveReports.JSViewer.create({
        reportID,
        reportParameters,
        element: viewerRoot,
        displayMode: 'Continuous',
        renderMode: 'Galley',
        error: (error) => console.error(error),
        reportLoaded: () => this.viewer.toolbar.toggle(false),
      });
    } else {
      this.viewer.openReport(reportID, reportParameters);
    }
  }

  constructor(private el: ElementRef) {
  }
}

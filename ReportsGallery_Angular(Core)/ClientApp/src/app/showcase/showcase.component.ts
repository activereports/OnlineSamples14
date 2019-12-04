declare var GrapeCity: any;
declare var document: any;

import { Component, Inject, ElementRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ShowcaseComponent {
  viewer: any = null;
  reports: Report[] = [];
  tree: TreeSection[] = [];
  selectedSectionItem: TreeSectionItem | null = null;
  selectedDocument: Document | null = null;

  constructor(private el: ElementRef, http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    // get reports list
    http.get(baseUrl + 'data/reports.json').subscribe((reports: Report[]) => {
      if (reports && reports.length) {
        this.reports = reports;
        http.get(baseUrl + 'data/tree.json').subscribe((tree: any[]) => {
          if (tree && tree.length) {
            this.tree = tree[0].children as TreeSection[];
            // get nav tree
            http.get(baseUrl + 'data/thumbs.json').subscribe((thumbs: Thumb[]) => {
              this.tree.forEach(entry => this.processData(entry, thumbs));
            }, error => console.error('thumbs processing error', error));
          }
        }, error => console.error('tree processing error', error));
      }
    }, error => console.error('report processing error', error));
  }

  createViewer(reportID) {
    // find viewer placeholder
    const viewerRoot = this.el.nativeElement.querySelector('#viewerPlaceHolder');
    if (!this.viewer) {
      this.viewer = GrapeCity.ActiveReports.JSViewer.create({
        reportID,
        element: viewerRoot,
        error: (error) => console.error(error),
      });
    } else {
      this.viewer.openReport(reportID);
    }
  }

  assignThumb(treeChild: TreeSection| TreeSectionItem, thumbs: Thumb[], path: string) {
    thumbs.forEach(thumb => {
      if (thumb.id === path + treeChild.label) {
        treeChild.image = !thumb.image
          ? `${this.baseUrl}img/default.jpg`
          : `${this.baseUrl}img/${thumb.image}`;
      }
    });
  }

  processData(treeSection: TreeSection, thumbs: Thumb[]) {
    this.assignThumb(treeSection, thumbs, '');
    if (treeSection.children && treeSection.children.length) {
      treeSection.children.forEach(treeChild => {
        const path = treeSection.label + '|';
        this.assignThumb(treeChild, thumbs, path);
      });
    }
  }

  selectSectionItem(sectionItem: TreeSectionItem) {
    const firstDocument = sectionItem.children[0];
    this.selectedSectionItem = sectionItem;
    this.selectedDocument = firstDocument;
    this.createViewer(firstDocument.loc);
  }

  selectDocument(report: Document) {
    this.selectedDocument = report;
    this.viewer.openReport(report.loc);
  }

  dismissInstance() {
    this.selectedSectionItem = null;
    this.selectedDocument = null;
  }
}

interface Report {
  label: string;
  id: string;
  loc: string;
}

interface Thumb {
  id: string;
  image: string;
}

interface TreeSection {
  id: string;
  label: string;
  children: TreeSectionItem[];
  image?: string;
}

interface TreeSectionItem {
  id: string;
  label: string;
  children: Document[];
  image?: string;
}

interface Document {
  label: string;
  id: string;
  loc: string;
  rptdesc: string;
  rptdeschtml: string;
  children?: Document[];
  image?: string;
}

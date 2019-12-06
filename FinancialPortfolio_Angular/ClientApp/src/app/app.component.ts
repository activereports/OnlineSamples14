import { Component } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isChildrenReport = new BehaviorSubject<boolean>(false);
  backToParent = new BehaviorSubject<boolean>(false);
  isDisplayUI = new BehaviorSubject<boolean>(false);
  hasLoadedDocument = new BehaviorSubject<boolean>(false);
  selectedReportName = new BehaviorSubject<string>('');

  isDisplayUI$ = this.isDisplayUI.asObservable();
  backToParent$ = this.backToParent.asObservable();

  setReportName(name: string) {
    this.selectedReportName.next(name);
  }

  toggleDisplayUI() {
    this.isDisplayUI.next(!this.isDisplayUI.value);
  }

  moveToChild() {
    this.isChildrenReport.next(true);
  }

  returnToParent() {
    this.isChildrenReport.next(false);
    this.backToParent.next(true);
  }

  onLoadDocument() {
    this.hasLoadedDocument.next(true);
  }
}

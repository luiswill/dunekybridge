import { Component, ViewChild } from '@angular/core';
import { NavbarComponent } from 'angular-bootstrap-md';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('navbar') navbar: NavbarComponent
  path: string;
  chapterPath: string;
  taskPath: string;
  title = 'MY App';

  constructor(private router: Router) {

    let path = window.location.pathname;

    this.buildBreadcrumb(path.substr(1));

    router.events.subscribe((val) => {
        // see also 
        if(val instanceof NavigationEnd) {
          this.buildBreadcrumb(val.urlAfterRedirects.substr(1));
        }
      });
  }

  buildBreadcrumb(path: string) {
    if(path.includes('chapters')) {

      let parts = path.split('/');

      this.chapterPath = 'Chapters'.toUpperCase();

      this.taskPath = parts[2].toUpperCase();

    }  else if(path.includes('progress')) {
      this.chapterPath = 'Chapters'.toUpperCase();
    }
  }
}

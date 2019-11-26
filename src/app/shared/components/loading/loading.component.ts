import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  loading$: Observable<boolean>;
  constructor(private router: Router) {}

  ngOnInit() {
    this.loading$ = this.router.events.pipe(
      filter(event =>
        [
          NavigationStart,
          NavigationEnd,
          NavigationCancel,
          NavigationError
        ].some(navigationType => event instanceof navigationType)
      ),
      map(event => {
        // console.log(event.constructor.name);
        return event instanceof NavigationStart;
      })
    );
  }
}
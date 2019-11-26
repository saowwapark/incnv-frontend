import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthenService } from './authen/authen.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'myProject';

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  constructor(private authService: AuthenService) {}

  ngOnInit() {
    this.authService.autoAuthUser();
    this.authListenerSubs = this.authService.isAuthen$.subscribe(
      isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      }
    );
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}

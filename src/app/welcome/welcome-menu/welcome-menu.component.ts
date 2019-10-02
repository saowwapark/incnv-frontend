import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  Output,
  EventEmitter
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-welcome-menu',
  templateUrl: './welcome-menu.component.html',
  styleUrls: ['./welcome-menu.component.scss']
})
export class WelcomeMenuComponent implements OnInit {
  @Output() menuToggle = new EventEmitter();

  // @ViewChild('collapsableArrow', { static: false }) collapsableArrow: MatIcon;
  // @ViewChild('children', { static: false }) children: ElementRef;

  // opened = false;
  constructor(private renderer: Renderer2, private authService: AuthService) {}

  ngOnInit() {}

  onLogout() {
    this.authService.logout();
  }
  onToggleNavigation() {
    console.log('Click Menu Toggle');
  }
  collapseToggle() {
    /*  console.log(this.collapsableArrow);
    console.log(this.children);
    if (this.opened) {

      this.renderer.setStyle(this.collapsableArrow.nativeElement, 'transition', 'transform .3s ease-in-out, opacity .25s ease-in-out .1s');
      this.renderer.setStyle(this.collapsableArrow.nativeElement, 'transform', 'rotate(0)');

      this.renderer.addClass(this.children.nativeElement, 'close');
      this.renderer.removeClass(this.children.nativeElement, 'open');

      this.opened = false;
    } else {
      this.renderer.setStyle(this.collapsableArrow.nativeElement, 'transform', 'rotate(90deg)');
      this.renderer.addClass(this.children.nativeElement, 'open');
      this.renderer.removeClass(this.children.nativeElement, 'close');

      this.opened = true;
    }*/
  }
}

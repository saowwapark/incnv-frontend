import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenService } from 'src/app/authen/authen.service';
import { DatasourceService } from 'src/app/datasource/datasource.service';

@Component({
  selector: 'home-content',
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.scss'],
})
export class HomeContentComponent implements OnInit {
  constructor(private router: Router, private datasourceService: DatasourceService, private autheService: AuthenService) {
    
  }

  ngOnInit(): void {
    this.checkShouldUpdateDatasource();
    
  }

  checkShouldUpdateDatasource() {
    this.datasourceService.shouldUpdateDatasource().subscribe((result: boolean) => {
      this.autheService.isAuthen$.subscribe(isAuthen => {
        if(isAuthen === true && result === true) {
          this.goToInstallPage();
          this.datasourceService.onAllDownloadsCompleted().subscribe(() => {
            this.goToDefaultPage();
          })
        }
      })
    })
  }

  goToInstallPage() {
    this.router.navigate(['app/install']);
  }
  goToDefaultPage() {
    this.router.navigate(['app/upload-cnvs']);
  }
}

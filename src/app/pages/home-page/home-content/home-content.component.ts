import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatasourceService } from 'src/app/datasource/datasource.service';

@Component({
  selector: 'home-content',
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.scss'],
})
export class HomeContentComponent implements OnInit {
  constructor(private router: Router, private datasourceService: DatasourceService) {
    
  }

  ngOnInit(): void {
    this.checkShouldUpdateDatasource();
    
  }

  checkShouldUpdateDatasource() {
    this.datasourceService.shouldUpdateDatasource().subscribe((result: boolean) => {
      if(result === true) {
        this.datasourceService.onAllDownloadsCompleted().subscribe(() => {
          this.goToInstallPage();
        })
      }
    })
  }

  goToInstallPage() {
    this.router.navigate(['/install']);
  }
}

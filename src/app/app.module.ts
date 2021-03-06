/** Import Angular Module **/
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

/** Custom Modules */
import { AppRoutingModule } from './app-routing.module';
import { AuthenModule } from './authen/authen.module';
import { AnalysisModule } from './analysis/analysis.module';
import { SharedModule } from './shared/shared.module';
import { ReformatCnvToolResultModule } from './reformat-cnv-tool-result/reformat-cnv-tool-result.module';
import { MaintenanceModule } from './maintenance/maintenance.module';

import { NavigationModule } from './navigation/navigation.module';

/** Components */
import { AppComponent } from './app.component';

import { HomeComponent } from './home-template/home-template.component';
import { HomeMenuComponent } from './home-template/home-menu/home-menu.component';
import { HomeContentComponent } from './home-template/home-content/home-content.component';

import { WelcomeComponent } from './welcome-template/welcome-template.component';
import { WelcomeMenuComponent } from './welcome-template/welcome-menu/welcome-menu.component';

import { ExportFilesComponent } from './export-files/export-files.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AuthenInterceptor } from './authen/authen-interceptor';

/** Services or Resolvers */
import { ConstantsService } from './services/constants.service';
import { TabFileMappingService } from './tab-file-mapping/tab-file-mapping.service';
import { MyFileModule } from './my-file/my-file.module';
import { SamplesetService } from './sampleset/sampleset.service';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';

/** Entry Components */
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from './shared/components/error-dialog/error-dialog.component';

import { environment } from 'src/environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WelcomeComponent,
    ExportFilesComponent,
    PageNotFoundComponent,
    ConfirmDialogComponent,
    ErrorDialogComponent,
    WelcomeMenuComponent,
    HomeContentComponent,
    HomeMenuComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,

    // custom modules
    AuthenModule,
    SharedModule,
    AnalysisModule,
    NavigationModule,
    MyFileModule,
    ReformatCnvToolResultModule,
    MaintenanceModule,

    // app routing must be last
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    TabFileMappingService,
    ConstantsService,
    SamplesetService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmDialogComponent, ErrorDialogComponent]
})
export class AppModule {}

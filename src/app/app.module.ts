/** Import Angular Module **/
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

/** Custom Modules */
import { AppRoutingModule } from './app-routing.module';
import { AuthenModule } from './authen/authen.module';
import { AnalysisModule } from './analysis/analysis.module';
import { SharedModule } from './shared/shared.module';

import { NavigationModule } from './navigation/navigation.module';

/** Components */
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { HomeMenuComponent } from './home/home-menu/home-menu.component';
import { HomeContentComponent } from './home/home-content/home-content.component';

import { WelcomeComponent } from './welcome/welcome.component';
import { WelcomeMenuComponent } from './welcome/welcome-menu/welcome-menu.component';

import { ExportFilesComponent } from './export-files/export-files.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AuthenInterceptor } from './authen/authen-interceptor';

import { LayoutComponent } from './layout/layout.component';

import { LoadingComponent } from './shared/components/loading/loading.component';

/** Services or Resolvers */
import { ConstantsService } from './constants.service';
import { TabFileMappingService } from './tab-file-mapping/tab-file-mapping.service';
import { UploadHistoryModule } from './upload-history/ีupload-history.module';
import { SamplesetService } from './sampleset/sampleset.service';
import { ErrorInterceptor } from './error.interceptor';

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
    LoadingComponent,

    LayoutComponent,
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
    UploadHistoryModule,

    // app routing must be last
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    TabFileMappingService,
    ConstantsService,
    SamplesetService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmDialogComponent, ErrorDialogComponent]
})
export class AppModule {}

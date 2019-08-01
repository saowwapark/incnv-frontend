import { ConfirmDialogComponent } from './common/confirm-dialog/confirm-dialog.component';
import { AuthInterceptor } from './auth/auth-interceptor';
/** Import Angular Module **/
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomMaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/** Import Utilities **/
import { ShortenPipe } from './common/shorten.pipe';

/** Import Component **/
import { WelcomeMenuComponent } from './menu/welcome-menu/welcome-menu.component';
import { HomeMenuComponent } from './menu/home-menu/home-menu.component';
import { ConfigureCNVtoolsComponent } from './configure-cnv-tools/configure-cnv-tools.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { ChromosomeComponent } from './chromosome/chromosome.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HeaderFieldsComponent } from './configure-cnv-tools/header-fields/header-fields.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { ActivitiesComponent } from './activities/activities.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { ChooseFilesComponent } from './analysis/choose-files/choose-files.component';
import { RecentAnalysisComponent } from './activities/recent-analysis/recent-analysis.component';
import { RecentUploadFilesComponent } from './activities/recent-upload-files/recent-upload-files.component';
import { ExportFilesComponent } from './export-files/export-files.component';
import { SampleSetComponent } from './sampleset/sampleset.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ConfigureHeaderFieldsComponent } from './configure-cnv-tools/configure-header-fields/configure-header-fields.component';
import { UploadListComponent } from './configure-cnv-tools/upload/upload-list/upload-list.component';
import { UploadFormDialogComponent } from './configure-cnv-tools/upload/upload-form/upload-form.component';
import { UploadComponent } from './configure-cnv-tools/upload/upload.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ItemComponent } from './navigation/item/item.component';
import { GroupComponent } from './navigation/group/group.component';
import { CollapsableComponent } from './navigation/collapsable/collapsable.component';
import { MenuComponent } from './menu/menu.component';

/** Import Services */
import { FakeDbService } from './fake-db/fake-db.service';

/** Import Modules */
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { environment } from 'src/environments/environment';
import { UploadsService } from './configure-cnv-tools/upload/uploads.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeMenuComponent,
    LoginComponent,
    ConfigureCNVtoolsComponent,
    ChromosomeComponent,
    SignupComponent,
    HeaderFieldsComponent,
    HomeComponent,
    WelcomeMenuComponent,
    WelcomeComponent,
    ActivitiesComponent,
    AnalysisComponent,
    ChooseFilesComponent,
    RecentAnalysisComponent,
    RecentUploadFilesComponent,
    ExportFilesComponent,
    SampleSetComponent,
    PageNotFoundComponent,
    ConfigureHeaderFieldsComponent,
    ShortenPipe,
    UploadListComponent,
    UploadFormDialogComponent,
    UploadComponent,
    NavigationComponent,
    ItemComponent,
    GroupComponent,
    CollapsableComponent,
    MenuComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    CustomMaterialModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    environment.production
      ? []
      : InMemoryWebApiModule.forRoot(FakeDbService, {
          delay: 0,
          passThruUnknownUrl: true
        })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    UploadsService
  ],
  bootstrap: [AppComponent],
  entryComponents: [UploadFormDialogComponent, ConfirmDialogComponent]
})
export class AppModule {}

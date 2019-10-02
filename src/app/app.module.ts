import { UploadFormResolver } from './upload/upload-configure/upload-form/upload-form.resolver';
import { ConstantsService } from './constants.service';
import { TabFileMappingService } from './cnvtools/tab-file-mapping/tab-file-mapping.service';
import { TabFileMappingComponent } from './cnvtools/tab-file-mapping/tab-file-mapping.component';
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
import { WelcomeToolbarComponent } from './toolbar/welcome-toolbar/welcome-toolbar.component';
import { HomeToolbarComponent } from './toolbar/home-toolbar/home-toolbar.component';
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
import { SamplesetComponent } from './sampleset/sampleset.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ConfigureHeaderFieldsComponent } from './configure-cnv-tools/configure-header-fields/configure-header-fields.component';
import { UploadListComponent } from './upload/upload-history/upload-list/upload-list.component';
import { UploadFormComponent } from './upload/upload-configure/upload-form/upload-form.component';
import { UploadComponent } from './upload/upload.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ItemComponent } from './navigation/item/item.component';
import { GroupComponent } from './navigation/group/group.component';
import { CollapsableComponent } from './navigation/collapsable/collapsable.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { UploadConfigureComponent } from './upload/upload-configure/upload-configure.component';
import { UploadHistoryComponent } from './upload/upload-history/upload-history.component';
import { TabFileMappingCardComponent } from './cnvtools/tab-file-mapping/tab-file-mapping-list/tab-file-mapping-card/tab-file-mapping-card.component';
import { TabFileMappingListComponent } from './cnvtools/tab-file-mapping/tab-file-mapping-list/tab-file-mapping-list.component';
import { ConfirmDialogComponent } from './common/confirm-dialog/confirm-dialog.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { TabFileMappingFormDialogComponent } from './cnvtools/tab-file-mapping/tab-file-mapping-form/tab-file-mapping-form.component';
import { SamplesetFormDialogComponent } from './sampleset/sampleset-form-dialog/sampleset-form-dialog.component';

/** Import Services */
import { FakeDbService } from './fake-db/fake-db.service';
import { UploadService } from './upload/upload.service';

/** Import Modules */
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { environment } from 'src/environments/environment';
import { SamplesetService } from './sampleset/sampleset.service';
import { SamplesetListComponent } from './sampleset/sampleset-list/sampleset-list.component';
import { FileListComponent } from './analysis/choose-files/file-list/file-list.component';
import { UploadReformatComponent } from './upload/upload-configure/upload-reformat/upload-reformat.component';
import { SelectedBarComponent } from './sampleset/selected-bar/selected-bar.component';
import { LayoutComponent } from './layout/layout.component';
import { MenuComponent } from './menu/menu.component';
import { HomeMenuComponent } from './menu/home-menu/home-menu.component';
import { WelcomeMenuComponent } from './welcome/welcome-menu/welcome-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeToolbarComponent,
    LoginComponent,
    ConfigureCNVtoolsComponent,
    ChromosomeComponent,
    SignupComponent,
    HeaderFieldsComponent,
    HomeComponent,
    WelcomeToolbarComponent,
    WelcomeComponent,
    ActivitiesComponent,
    AnalysisComponent,
    ChooseFilesComponent,
    RecentAnalysisComponent,
    RecentUploadFilesComponent,
    ExportFilesComponent,
    SamplesetComponent,
    PageNotFoundComponent,
    ConfigureHeaderFieldsComponent,
    ShortenPipe,
    UploadListComponent,
    UploadFormComponent,
    UploadComponent,
    NavigationComponent,
    ItemComponent,
    GroupComponent,
    CollapsableComponent,
    ToolbarComponent,
    ConfirmDialogComponent,
    UploadConfigureComponent,
    UploadHistoryComponent,
    TabFileMappingCardComponent,
    TabFileMappingListComponent,
    TabFileMappingFormDialogComponent,
    TabFileMappingComponent,
    SamplesetFormDialogComponent,
    SamplesetListComponent,
    FileListComponent,
    UploadReformatComponent,
    SelectedBarComponent,
    LayoutComponent,
    MenuComponent,
    HomeMenuComponent,
    WelcomeMenuComponent
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
    TabFileMappingService,
    SamplesetService,
    UploadService,
    ConstantsService,
    UploadFormResolver
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    TabFileMappingFormDialogComponent,
    ConfirmDialogComponent,
    SamplesetFormDialogComponent,
    UploadFormComponent
  ]
})
export class AppModule {}

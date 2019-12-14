import { SamplesetResolver } from './sampleset/sampleset.resolver';
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
import { ShortenPipe } from './utils/shorten.pipe';

/** Import Component **/
// import { ConfigureCNVtoolsComponent } from './configure-cnv-tools/configure-cnv-tools.component';
// import { ConfigureHeaderFieldsComponent } from './configure-cnv-tools/configure-header-fields/configure-header-fields.component';
// import { HeaderFieldsComponent } from './configure-cnv-tools/header-fields/header-fields.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './authen/login/login.component';
import { SignupComponent } from './authen/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { ActivitiesComponent } from './activities/activities.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { RecentAnalysisComponent } from './activities/recent-analysis/recent-analysis.component';
import { RecentUploadFilesComponent } from './activities/recent-upload-files/recent-upload-files.component';
import { ExportFilesComponent } from './export-files/export-files.component';
import { SamplesetComponent } from './sampleset/sampleset.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { UploadHistoryUploadCnvToolResultListComponent } from './upload/upload-history/upload-history-uploadcnvtoolresult/upload-history-uploadcnvtoolresult-list/upload-history-uploadcnvtoolresult-list.component';
import { UploadFormComponent } from './upload/upload-configure/upload-form/upload-form.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ItemComponent } from './navigation/item/item.component';
import { GroupComponent } from './navigation/group/group.component';
import { CollapsableComponent } from './navigation/collapsable/collapsable.component';
import { UploadConfigureComponent } from './upload/upload-configure/upload-configure.component';
import { UploadHistoryComponent } from './upload/upload-history/upload-history.component';
import { TabFileMappingCardComponent } from './cnvtools/tab-file-mapping/tab-file-mapping-list/tab-file-mapping-card/tab-file-mapping-card.component';
import { TabFileMappingListComponent } from './cnvtools/tab-file-mapping/tab-file-mapping-list/tab-file-mapping-list.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { AuthenInterceptor } from './authen/authen-interceptor';
import { TabFileMappingFormDialogComponent } from './cnvtools/tab-file-mapping/tab-file-mapping-form-dialog/tab-file-mapping-form-dialog.component';
import { SamplesetFormDialogComponent } from './sampleset/sampleset-form-dialog/sampleset-form-dialog.component';
import { HomeMenuComponent } from './home/home-menu/home-menu.component';
import { ErrorInterceptor } from './error.interceptor';

/** Import Services */

/** Import Modules */
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { environment } from 'src/environments/environment';
import { SamplesetService } from './sampleset/sampleset.service';
import { SamplesetListComponent } from './sampleset/sampleset-list/sampleset-list.component';
import { UploadReformatComponent } from './upload/upload-configure/upload-reformat/upload-reformat.component';
import { SelectedBarComponent } from './shared/components/selected-bar/selected-bar.component';
import { LayoutComponent } from './layout/layout.component';
import { WelcomeMenuComponent } from './welcome/welcome-menu/welcome-menu.component';
import { HomeContentComponent } from './home/home-content/home-content.component';
import { IgvComponent } from './igv/igv.component';
import { ErrorDialogComponent } from './shared/components/error-dialog/error-dialog.component';
import { UploadHistoryUploadcnvtoolresultComponent } from './upload/upload-history/upload-history-uploadcnvtoolresult/upload-history-uploadcnvtoolresult.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { FilteredSelectComponent } from './shared/components/filtered-select/filtered-select.component';
import { ChooseSamplesetComponent } from './analysis/choose-sampleset/choose-sampleset.component';
import { ChooseSamplesetResolver } from './analysis/choose-sampleset/choose-sampleset.resolver';
import { ChooseSampleComponent } from './analysis/choose-sample/choose-sample.component';
import { ChooseFileComponent } from './analysis/choose-file/choose-file.component';
import { CompareResultComponent } from './analysis/compare-result/compare-result.component';
import { ResultBarComponent } from './analysis/result-bar/result-bar.component';
import { UploadReformatListComponent } from './upload/upload-configure/upload-reformat/upload-reformat-list/upload-reformat-list.component';
import { UploadHistoryReformatconvtoolresultComponent } from './upload/upload-history/upload-history-reformatconvtoolresult/upload-history-reformatconvtoolresult.component';
import { UploadReformatDialogComponent } from './upload/upload-configure/upload-reformat/upload-reformat-dialog/upload-reformat-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    // ConfigureCNVtoolsComponent,
    // ConfigureHeaderFieldsComponent,
    // HeaderFieldsComponent,
    SignupComponent,
    HomeComponent,
    WelcomeComponent,
    ActivitiesComponent,
    AnalysisComponent,
    RecentAnalysisComponent,
    RecentUploadFilesComponent,
    ExportFilesComponent,
    SamplesetComponent,
    PageNotFoundComponent,

    ShortenPipe,
    UploadHistoryUploadCnvToolResultListComponent,
    UploadFormComponent,
    NavigationComponent,
    ItemComponent,
    GroupComponent,
    CollapsableComponent,
    ConfirmDialogComponent,
    UploadConfigureComponent,
    UploadHistoryComponent,
    TabFileMappingCardComponent,
    TabFileMappingListComponent,
    TabFileMappingFormDialogComponent,
    TabFileMappingComponent,
    SamplesetFormDialogComponent,
    SamplesetListComponent,
    UploadReformatComponent,
    SelectedBarComponent,
    LayoutComponent,
    WelcomeMenuComponent,
    HomeContentComponent,
    HomeMenuComponent,
    IgvComponent,
    ErrorDialogComponent,
    UploadHistoryUploadcnvtoolresultComponent,
    UploadHistoryUploadcnvtoolresultComponent,
    LoadingComponent,
    FilteredSelectComponent,
    ChooseSamplesetComponent,
    ChooseSampleComponent,
    ChooseFileComponent,
    CompareResultComponent,
    ResultBarComponent,
    UploadReformatListComponent,
    UploadHistoryReformatconvtoolresultComponent,
    UploadReformatDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    CustomMaterialModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    TabFileMappingService,
    SamplesetService,
    ConstantsService,
    SamplesetResolver,
    ChooseSamplesetResolver
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    TabFileMappingFormDialogComponent,
    ConfirmDialogComponent,
    ErrorDialogComponent,
    SamplesetFormDialogComponent,
    UploadFormComponent,
    UploadReformatDialogComponent
  ]
})
export class AppModule {}

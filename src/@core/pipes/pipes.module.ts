import { NgModule } from '@angular/core';

import { FilterPipe } from '@core/pipes/filter.pipe';

import { InitialsPipe } from '@core/pipes/initials.pipe';

import { SafePipe } from '@core/pipes/safe.pipe';
import { StripHtmlPipe } from '@core/pipes/stripHtml.pipe';
import { ShowStatusPipe } from '@core/pipes/show-status.pipe';
import { FormatDatePipe } from './formatDate.pipe';
import { StatusFile } from './statusFile.pipe';
import { ShowStatusLoanPipe } from './show-status-loan.pipe';
import { ShowIconMnoPipe } from './show-icon-mno.pipe';
import { ShowStatusTelecomPipe } from './show-status-telecom.pipe';
import { NumberToTextPipe } from './numberToText.pipe';
import { ShowStatusMsisdnPipe } from './show-status-msisdn.pipe';

@NgModule({
  declarations: [InitialsPipe, FilterPipe, StripHtmlPipe, 
    SafePipe, ShowStatusPipe, FormatDatePipe, StatusFile, ShowStatusLoanPipe, 
    NumberToTextPipe,
    ShowStatusMsisdnPipe,
    ShowIconMnoPipe,ShowStatusTelecomPipe],
  imports: [],
  exports: [InitialsPipe, FilterPipe, StripHtmlPipe, SafePipe, 
    ShowStatusPipe, FormatDatePipe, StatusFile, ShowStatusLoanPipe, 
    NumberToTextPipe,
    ShowStatusMsisdnPipe,
    ShowIconMnoPipe,ShowStatusTelecomPipe]
})
export class CorePipesModule {}

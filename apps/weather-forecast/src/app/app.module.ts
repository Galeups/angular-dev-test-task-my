import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { WeatherForecastServicesModule } from '@bp/weather-forecast/services';
import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { TableComponent } from './components/table/table.component';
import { ChangeModeComponent } from './components/change-mode/change-mode.component';

@NgModule({
	declarations: [AppComponent, SearchComponent, TableComponent, ChangeModeComponent],
	imports: [BrowserModule, WeatherForecastServicesModule, ReactiveFormsModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}

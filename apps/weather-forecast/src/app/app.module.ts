import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { WeatherForecastServicesModule } from '@bp/weather-forecast/services';
import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { TableComponent } from './components/table/table.component';
import { ChangeModeComponent } from './components/change-mode/change-mode.component';
import { Routes } from './routes';
import { MainComponent } from './pages/main/main.component';
import { NotificationComponent } from './components/notification/notification.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './interceptors/api.interceptor';

@NgModule({
	declarations: [
		AppComponent,
		SearchComponent,
		TableComponent,
		ChangeModeComponent,
		MainComponent,
		NotificationComponent,
	],
	imports: [BrowserModule, WeatherForecastServicesModule, ReactiveFormsModule, RouterModule.forRoot(Routes)],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ApiInterceptor,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}

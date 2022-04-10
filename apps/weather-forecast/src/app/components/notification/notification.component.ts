import { Component } from '@angular/core';
import { WeatherForecastApiService } from '@bp/weather-forecast/services';

@Component({
	selector: 'bp-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
	readonly errors$ = this._weatherForecastApi.errors$;
	constructor(private readonly _weatherForecastApi: WeatherForecastApiService) {}

	onClose() {
		this._weatherForecastApi.onCloseError();
	}
}

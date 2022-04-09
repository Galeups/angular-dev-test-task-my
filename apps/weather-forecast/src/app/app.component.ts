import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';

import { WeatherForecastApiService } from '@bp/weather-forecast/services';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { StateTableService } from './services/state-table.service';
import { Mode, State } from './interfaces';
import { StateService } from './services/state.service';

@Component({
	selector: 'bp-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy {
	title = 'weather-forecast';
	private readonly _header = {
		daily: ['City Name', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
		hourly: ['City Name', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'],
	};
	readonly errors$ = this._weatherForecastApi.errors$;
	isLoading = false;
	private _mode: Mode = 'daily';
	private readonly _destroy$ = new Subject<boolean>();

	constructor(
		private readonly _cdr: ChangeDetectorRef,
		private readonly _weatherForecastApi: WeatherForecastApiService,
		private readonly _stateTable: StateTableService,
		private readonly _state: StateService
	) {}

	onErrorClose() {
		this._weatherForecastApi.onClearError();
	}

	onSearch(city: string) {
		this._getWeather(city);
	}

	private _getWeather(city: string) {
		this.isLoading = true;
		forkJoin({
			daily: this._weatherForecastApi.getWeather(city, 'daily'),
			hourly: this._weatherForecastApi.getWeather(city, 'hourly'),
		})
			.pipe(takeUntil(this._destroy$))
			.subscribe(weather => {
				const newState: State = {
					city: weather.daily.name,
					daily: weather.daily,
					hourly: weather.hourly,
				};

				this._state.setState(newState);
				this._stateTable.setState(this._header[this._mode], weather[this._mode]);
				this.isLoading = false;
				this._cdr.markForCheck();
			});
	}

	ngOnDestroy() {
		this._destroy$.next(true);
		this._destroy$.complete();
	}
}

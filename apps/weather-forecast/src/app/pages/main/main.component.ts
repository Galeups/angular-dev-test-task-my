import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { concatMap, forkJoin, Subject, takeUntil } from 'rxjs';

import { Mode, State } from '../../interfaces';
import { WeatherForecastApiService } from '@bp/weather-forecast/services';
import { RouterService, StateService, StateTableService } from '../../services';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'bp-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit, OnDestroy {
	title = 'weather-forecast';
	isLoading = false;
	mode: Mode = 'daily';

	private readonly _destroy$ = new Subject<boolean>();
	private readonly _env = environment;

	constructor(
		private readonly _cdr: ChangeDetectorRef,
		private readonly _weatherForecastApi: WeatherForecastApiService,
		private readonly _stateTable: StateTableService,
		private readonly _state: StateService,
		private readonly _router: RouterService
	) {}

	ngOnInit() {
		if (this._router.params.mode) {
			this._stateTable.setState(this._router.params.mode);
		}

		if (this._router.params.city) {
			this._router.params.city.split(',').map((city: string) => this._getWeather(city));
		}

		this._stateTable.state$.pipe(takeUntil(this._destroy$)).subscribe(state => {
			this.mode = state.mode;
			const cities = state.cities.map(city => city.name);
			this._router.setParams(state.mode, cities);
		});
	}

	onSearch(city: string) {
		this._getWeather(city);
	}

	onChangeMode(mode: Mode) {
		this._stateTable.setState(mode);
	}

	private _getWeather(cityName: string) {
		if (!cityName) {
			return;
		}

		this.isLoading = true;

		this._weatherForecastApi
			.getCity(cityName, this._env.apiCityUrl)
			.pipe(
				takeUntil(this._destroy$),
				concatMap(city => {
					return forkJoin({
						daily: this._weatherForecastApi.getDailyWeather(city, this._env.apiWeatherUrl),
						hourly: this._weatherForecastApi.getHourlyWeather(city, this._env.apiWeatherUrl),
					});
				})
			)
			.subscribe(weather => {
				if (!this._isCityValid(weather.daily.name)) {
					this._weatherForecastApi.setError(`City ${weather.daily.name} was added!`);
					return;
				}

				const newState: State = {
					city: weather.daily.name,
					daily: weather.daily,
					hourly: weather.hourly,
				};

				this._state.setState(newState);
				this._stateTable.setState(this.mode, weather[this.mode]);
				this.isLoading = false;
				this._cdr.markForCheck();
			});
	}

	private _isCityValid(name: string | null): boolean {
		return !this._state.state.some(city => city.city === name);
	}

	ngOnDestroy() {
		this._destroy$.next(true);
		this._destroy$.complete();
	}
}

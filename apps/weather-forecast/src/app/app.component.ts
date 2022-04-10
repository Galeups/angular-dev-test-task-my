import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject, takeUntil } from 'rxjs';

import { WeatherForecastApiService } from '@bp/weather-forecast/services';
import { RouterService, StateService, StateTableService } from './services';
import { Mode, State } from './interfaces';

@Component({
	selector: 'bp-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
	title = 'weather-forecast';
	readonly errors$ = this._weatherForecastApi.errors$;
	isLoading = false;

	private _mode: Mode = 'daily';
	private readonly _destroy$ = new Subject<boolean>();

	constructor(
		private readonly _cdr: ChangeDetectorRef,
		private readonly _weatherForecastApi: WeatherForecastApiService,
		private readonly _stateTable: StateTableService,
		private readonly _state: StateService,
		private readonly _router: RouterService
	) {}

	ngOnInit() {
		this._router.navigate$.subscribe(params => {
			console.log(params);
			if (params.mode) {
				this._stateTable.setState(params.mode);
			}
		});
		this._stateTable.state$.pipe(takeUntil(this._destroy$)).subscribe(state => {
			this._mode = state.mode;
			this._router.setParams(state.mode);
		});
	}

	onErrorClose() {
		this._weatherForecastApi.onClearError();
	}

	onSearch(city: string) {
		this._getWeather(city);
	}

	onChangeMode(mode: Mode) {
		this._stateTable.setState(mode);
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
				this._stateTable.setState(this._mode, weather[this._mode]);
				this.isLoading = false;
				this._cdr.markForCheck();
			});
	}

	ngOnDestroy() {
		this._destroy$.next(true);
		this._destroy$.complete();
	}
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY, map, Observable, pluck, switchMap } from 'rxjs';

import { CityDto, DailyWeatherDto, HourlyWeatherDto } from './interfaces';
import { City, Mode } from '../../../../../apps/weather-forecast/src/app/interfaces';

@Injectable({ providedIn: 'root' })
export class WeatherForecastApiService {
	get errors$() {
		return this._errors$.asObservable();
	}

	private readonly _apiKey = '010721642521f31b0fbc8c3831d45951';
	private readonly _apiCityUrl = 'https://api.openweathermap.org/geo/1.0/direct';
	private readonly _apiWeatherUrl = 'https://api.openweathermap.org/data/2.5/onecall';
	private readonly _errors$ = new BehaviorSubject<string | null>(null);

	constructor(private readonly _http: HttpClient) {}

	getWeather(cityName: string, mode: Mode): Observable<City> {
		return this._getCity(cityName).pipe(
			switchMap(city => {
				if (!city) {
					return EMPTY;
				}
				return mode === 'daily' ? this._getDailyWeather(city) : this._getHourlyWeather(city);
			})
		);
	}

	onCloseError() {
		this._errors$.next(null);
	}

	private _getDailyWeather(city: CityDto): Observable<City> {
		const options = {
			lat: city.lat.toString(),
			lon: city.lon.toString(),
			appid: this._apiKey,
			exclude: 'current,minutely,hourly,alerts',
			units: 'metric',
		};

		const params = this._setHttpParams(options);
		return this._http.get<DailyWeatherDto>(this._apiWeatherUrl, { params }).pipe(
			pluck('daily'),
			map(days => {
				return {
					name: city.name,
					temp: days.slice(0, 7).map(t => Math.round(t.temp.day)),
				};
			})
		);
	}

	private _getHourlyWeather(city: CityDto): Observable<City> {
		const options = {
			lat: city.lat.toString(),
			lon: city.lon.toString(),
			appid: this._apiKey,
			exclude: 'current,minutely,daily,alerts',
			units: 'metric',
		};

		const params = this._setHttpParams(options);
		return this._http.get<HourlyWeatherDto>(this._apiWeatherUrl, { params }).pipe(
			pluck('hourly'),
			map(temp => {
				const hours = [];
				for (let i = 3; i <= 24; i += 3) {
					hours.push(temp[i]);
				}

				return {
					name: city.name,
					temp: hours.map(t => Math.round(t.temp)),
				};
			})
		);
	}

	private _getCity(name: string): Observable<CityDto> {
		this.onCloseError();
		const options = {
			q: name,
			limit: '1',
			appid: this._apiKey,
		};

		const params = this._setHttpParams(options);
		return this._http.get<CityDto[]>(this._apiCityUrl, { params }).pipe(
			catchError(() => {
				this._onHandleError('Oops, error!');
				return EMPTY;
			}),
			map(cities => {
				if (!cities.length) {
					this._onHandleError(`City ${name} was not found!`);
				}
				return cities[0];
			})
		);
	}

	private _setHttpParams(options: Record<string, string>): HttpParams {
		let params = new HttpParams();

		Object.keys(options).forEach((option: string) => {
			params = params.append(option, options[option]);
		});

		return params;
	}

	private _onHandleError(message: string) {
		this._errors$.next(message);
	}
}

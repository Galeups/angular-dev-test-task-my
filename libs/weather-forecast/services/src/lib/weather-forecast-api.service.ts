import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY, map, Observable, pluck } from 'rxjs';

import { CityDto, DailyWeatherDto, HourlyWeatherDto } from './interfaces';
import { City } from '../../../../../apps/weather-forecast/src/app/interfaces';

@Injectable({ providedIn: 'root' })
export class WeatherForecastApiService {
	get errors$() {
		return this._errors$.asObservable();
	}

	private readonly _errors$ = new BehaviorSubject<string | null>(null);
	constructor(private readonly _http: HttpClient) {}

	setError(message: string) {
		if (message) {
			this._errors$.next(message);
		}
	}

	onCloseError() {
		this._errors$.next(null);
	}

	getDailyWeather(city: CityDto, url: string): Observable<City> {
		const options = {
			lat: city.lat.toString(),
			lon: city.lon.toString(),
			exclude: 'current,minutely,hourly,alerts',
			units: 'metric',
		};

		const params = this._setHttpParams(options);
		return this._http.get<DailyWeatherDto>(url, { params }).pipe(
			pluck('daily'),
			map(days => {
				return {
					name: city.name,
					temp: days.slice(0, 7).map(t => Math.round(t.temp.day)),
				};
			})
		);
	}

	getHourlyWeather(city: CityDto, url: string): Observable<City> {
		const options = {
			lat: city.lat.toString(),
			lon: city.lon.toString(),
			exclude: 'current,minutely,daily,alerts',
			units: 'metric',
		};

		const params = this._setHttpParams(options);
		return this._http.get<HourlyWeatherDto>(url, { params }).pipe(
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

	getCity(name: string, url: string): Observable<CityDto> {
		this.onCloseError();
		const options = {
			q: name,
			limit: '1',
		};

		const params = this._setHttpParams(options);
		return this._http.get<CityDto[]>(url, { params }).pipe(
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

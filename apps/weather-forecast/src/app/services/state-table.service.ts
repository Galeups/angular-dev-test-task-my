import { Injectable } from '@angular/core';
import { City, Mode, StateTable } from '../interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { StateService } from './state.service';

@Injectable({
	providedIn: 'root',
})
export class StateTableService {
	private readonly initState: StateTable = {
		mode: null,
		cities: [],
	};
	private readonly _stateTable = new BehaviorSubject<StateTable>(this.initState);

	constructor(private readonly _state: StateService) {}

	setState(mode: Mode, city?: City) {
		if (city) {
			const state: StateTable = this._stateTable.getValue();
			const newState: StateTable = { ...state, mode, cities: [...state.cities, city] };
			this._stateTable.next(newState);
		} else {
			const newState: StateTable = {
				mode,
				cities: this._state.getModeWeather().map(city => ({ name: city.city, temp: city[mode].temp })),
			};

			this._stateTable.next(newState);
		}
	}

	get state$(): Observable<StateTable> {
		return this._stateTable.asObservable();
	}

	clearState() {
		this._stateTable.next(this.initState);
	}
}

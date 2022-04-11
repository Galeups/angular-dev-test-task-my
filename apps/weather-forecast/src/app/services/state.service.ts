import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { State } from '../interfaces';

@Injectable({
	providedIn: 'root',
})
export class StateService {
	private readonly _state$ = new BehaviorSubject<State[]>([]);

	setState(newStateEl: State) {
		const newState = [...this._state$.getValue(), newStateEl];
		this._state$.next(newState);
	}

	get state(): State[] {
		return this._state$.getValue();
	}

	clearState() {
		this._state$.next([]);
	}

	getModeWeather(): State[] {
		return this._state$.getValue();
	}
}

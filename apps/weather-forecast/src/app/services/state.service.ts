import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

	get state$(): Observable<State[]> {
		return this._state$.asObservable();
	}

	clearState() {
		this._state$.next([]);
	}
}

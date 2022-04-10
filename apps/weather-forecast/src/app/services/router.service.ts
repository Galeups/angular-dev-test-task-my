import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Mode } from '../interfaces';

@Injectable({
	providedIn: 'root',
})
export class RouterService {
	constructor(private readonly _router: Router, private readonly _route: ActivatedRoute) {}

	setParams(mode: Mode, city: (string | null)[]) {
		const queryParams = {
			mode,
			city: city.length ? city.join(',') : null,
		};

		this._router.navigate([], {
			queryParams,
		});
	}

	get params(): Params {
		return this._route.snapshot.queryParams;
	}
}

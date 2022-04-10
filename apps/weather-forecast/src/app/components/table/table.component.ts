import { ChangeDetectionStrategy, Component } from '@angular/core';
import { tap } from 'rxjs';

import { StateTableService } from '../../services';

@Component({
	selector: 'bp-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
	isShow = false;
	readonly state$ = this._stateTable.state$.pipe(
		tap(state => {
			this.isShow = !!state.cities.length;
		})
	);
	readonly header = {
		daily: ['City Name', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
		hourly: ['City Name', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'],
	};
	constructor(private readonly _stateTable: StateTableService) {}
}

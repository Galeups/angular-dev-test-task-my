import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StateTableService } from '../../services/state-table.service';

@Component({
	selector: 'bp-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit {
	// private readonly _header = {
	// 	daily: ['City Name', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
	// 	hourly: ['City Name', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'],
	// };
	constructor(private readonly _cdr: ChangeDetectorRef, private readonly _stateTable: StateTableService) {}

	ngOnInit() {
		this._stateTable.state$.subscribe(state => {
			console.log(state);
			this._cdr.markForCheck();
		});
	}
}

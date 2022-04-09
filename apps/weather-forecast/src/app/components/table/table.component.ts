import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { StateTableService } from '../../services/state-table.service';
import { Mode } from '../../interfaces';

@Component({
	selector: 'bp-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit {
	header: string[] | null = null;

	@Input() readonly mode: Mode = 'daily';

	constructor(private readonly _cdr: ChangeDetectorRef, private readonly _stateTable: StateTableService) {}

	ngOnInit() {
		this._stateTable.state$.subscribe(state => {
			// console.log(state);
			this._cdr.markForCheck();
		});
	}
}

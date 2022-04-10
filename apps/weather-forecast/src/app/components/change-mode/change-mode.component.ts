import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Mode } from '../../interfaces';
import { Subject } from 'rxjs';

@Component({
	selector: 'bp-change-mode',
	templateUrl: './change-mode.component.html',
	styleUrls: ['./change-mode.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeModeComponent implements OnInit, OnChanges, OnDestroy {
	readonly changeMode = new FormControl();
	@Input() value: Mode = 'daily';
	@Output() mode = new EventEmitter<Mode>();

	private readonly _destroy$ = new Subject<boolean>();

	ngOnInit() {
		this.changeMode.valueChanges.subscribe(mode => {
			this.mode.emit(mode);
		});
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.value && changes.value.currentValue) {
			this.changeMode.setValue(this.value);
		}
	}

	ngOnDestroy() {
		this._destroy$.next(true);
		this._destroy$.complete();
	}
}

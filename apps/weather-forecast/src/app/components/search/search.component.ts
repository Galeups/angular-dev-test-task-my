import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'bp-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnChanges {
	readonly form = new FormGroup({
		search: new FormControl(null, [Validators.required, Validators.minLength(2)]),
	});

	@Input() isLoading = false;
	@Output() city = new EventEmitter<string>();

	ngOnChanges(changes: SimpleChanges): void {
		console.log('isLoading: ', changes.isLoading.currentValue);
	}

	onSearch() {
		if (this.form.valid) {
			this.city.emit(this.form.controls.search.value);
			this.form.reset();
		}
	}
}

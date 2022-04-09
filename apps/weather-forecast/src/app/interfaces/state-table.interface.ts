import { Mode } from './mode.type';

export interface StateTable {
	mode: Mode | null;
	cities: City[];
}

export interface City {
	name: string | null;
	temp: number[];
}

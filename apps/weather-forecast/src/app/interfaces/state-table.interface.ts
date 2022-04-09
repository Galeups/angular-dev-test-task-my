export interface StateTable {
	header: string[];
	cities: City[];
}

export interface City {
	name: string | null;
	temp: number[];
}

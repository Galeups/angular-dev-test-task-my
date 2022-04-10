export interface State {
	city: string | null;
	daily: {
		temp: number[];
	};
	hourly: {
		temp: number[];
	};
}

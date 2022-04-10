import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';

export const Routes = [
	{
		path: '',
		component: AppComponent,
		redirectTo: '/main',
		pathMatch: 'full',
	},
	{
		path: 'main',
		component: MainComponent,
	},
	{ path: '**', redirectTo: '/main' },
];

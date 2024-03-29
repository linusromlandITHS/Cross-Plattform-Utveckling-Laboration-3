//External dependencies
import { Appearance } from 'react-native';
import { useState } from 'react';

//Internal dependencies
import Router from './Router';
import { i18nInitialize } from './i18n';
import ColorSchemeContext from './contexts/ColorSchemeContext';
const { getColorScheme } = Appearance;

function App() {
	const [colorScheme] = useState(getColorScheme());

	console.log('Color scheme is set to', colorScheme);

	i18nInitialize();

	return (
		<ColorSchemeContext.Provider value={colorScheme as any}>
			<Router />
		</ColorSchemeContext.Provider>
	);
}

export default App;

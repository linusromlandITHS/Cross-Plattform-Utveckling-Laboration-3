//External dependencies
import { Appearance } from 'react-native';
import { useState } from 'react';

//Internal dependencies
import Router from './Router';
import ColorSchemeContext from './contexts/ColorSchemeContext';
const { getColorScheme, addChangeListener } = Appearance;

function App() {
	const [colorScheme, setColorScheme] = useState(getColorScheme());

	addChangeListener(({ colorScheme }) => {
		setColorScheme(colorScheme);
	});

	return (
		<ColorSchemeContext.Provider value={colorScheme ? colorScheme : 'light'}>
			<Router />
		</ColorSchemeContext.Provider>
	);
}

export default App;

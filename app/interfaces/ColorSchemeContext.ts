export default interface ColorSchemeContext {
	colorScheme: 'light' | 'dark';
	setColorScheme: (colorScheme: 'light' | 'dark') => void;
}

const lightMode = {
	colorString: '#000000',
	background: '#f5f5f5',
	altBackground: '#ffffff',
	text: '#1a1a1a',
	invertedText: '#000000',
	accentBackground: '#8caac2'
};

const darkMode = {
	colorString: '#ffffff',
	background: '#2e2e2e',
	altBackground: '#3d3d3d',
	text: '#fafafa',
	invertedText: '#000000',
	accentBackground: '#325d7d'
};

function getColorScheme(theme: string) {
	return theme === 'dark' ? darkMode : lightMode;
}

export { getColorScheme };

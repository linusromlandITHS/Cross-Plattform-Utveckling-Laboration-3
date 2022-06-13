//External dependencies
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

//Locale import
import en from './en.json';
import sv from './sv.json';

//i18n Initialize
const i18nInitialize = () => {
	// Set the key-value pairs for the different languages you want to support.
	i18n.translations = {
		en,
		sv
	};
	console.log(Localization.locale.split('-')[0]);

	// Set the locale once at the beginning of your app.
	i18n.locale = Localization.locale.split('-')[0];

	// Set the fallback locale to 'en' if the user locale is not supported.
	i18n.fallbacks = true;
};

export { i18nInitialize };

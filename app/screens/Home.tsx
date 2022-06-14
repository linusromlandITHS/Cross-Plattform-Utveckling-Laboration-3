//External dependencies
import { View, Text, InputAccessoryView, TextInput, Button, SectionList, Platform, Pressable } from 'react-native';
import { useEffect, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { t } from 'i18n-js';

//Internal dependencies
import AboutModal from '../components/AboutModal';
import WelcomeModal from '../components/WelcomeModal';
import ColorSchemeContext from '../contexts/ColorSchemeContext';
import { getColorScheme } from '../utils/appearance';

export default () => {
	// AsyncStorage.removeItem('hasSeenWelcome');

	//Initialize useNavigation
	const navigation = useNavigation();

	//Initialize useContext
	const colorScheme = useContext(ColorSchemeContext);
	const [colorSchemeState] = useState(getColorScheme(colorScheme as string));

	//Initialize AccessoryID for InputAccessoryView
	const inputAccessoryViewID = 'searchFieldClearButton';

	//Initialize data variables
	const [WelcomeModalVisible, setWelcomeModalVisible] = useState(false);
	const [AboutModalVisible, setAboutModalVisible] = useState(false);
	const [routes, setRoutes] = useState([]);
	const [search, setSearch] = useState('');

	useEffect(() => {
		getRoutes();

		//Event listener for when the user enters the screen
		const unsubscribe = navigation.addListener('focus', () => {
			(async () => {
				//Check if the user has seen the welcome modal, show the welcome modal if not
				const welcome = await AsyncStorage.getItem('hasSeenWelcome');
				if (welcome !== 'true') {
					setWelcomeModalVisible(true);
					return;
				}

				//Check if the user has set a route, if set it will navigate to the route
				const route = await AsyncStorage.getItem('route');
				if (route) {
					navigation.dispatch(
						CommonActions.navigate({
							name: 'Route'
						})
					);
					return;
				}

				getRoutes();
			})();
		});

		//Remove event listener on leave
		return unsubscribe;
	}, [navigation]);

	/**
	 * @name getRoutes
	 * @description Get all routes from the API
	 * @returns {void}
	 */
	async function getRoutes() {
		const request = await fetch('https://api.ferrydepartures.com/api/routes');
		const response = await request.json();
		const data = response.routes;
		setRoutes(data);
	}

	/**
	 * @name handleRouteSelection
	 * @description Handles the selection of a route
	 * @param route The route to search navigate to
	 *
	 */
	async function handleRouteSelection(route: any) {
		await AsyncStorage.setItem('route', JSON.stringify(route));
		navigation.dispatch(
			CommonActions.navigate({
				name: 'Route'
			})
		);
	}

	return (
		<View style={{ flex: 1, alignItems: 'center', paddingBottom: 110, height: '100%', backgroundColor: colorSchemeState.background }}>
			<View
				style={{
					width: '100%',
					alignItems: 'center'
				}}>
				<View style={{ width: '100%', alignItems: 'center', backgroundColor: colorSchemeState.accentBackground, padding: 10, paddingTop: 40 }}>
					<View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
						<Text
							style={{
								fontSize: 35,
								textAlign: 'left',
								marginLeft: 15,
								marginBottom: 5,
								marginTop: 10,
								color: colorSchemeState.text
							}}>
							<Text>{t('routes.selectRoute')}</Text>
						</Text>
						<Pressable onPress={() => setAboutModalVisible(true)} style={{ marginRight: 15 }}>
							<AntDesign name='infocirlce' size={24} color={colorSchemeState.colorString} />
						</Pressable>
					</View>
					<TextInput
						style={{
							width: '95%',
							borderColor: 'gray',
							borderWidth: 1,
							padding: 10,
							borderRadius: 15,
							backgroundColor: '#fff'
						}}
						inputAccessoryViewID={inputAccessoryViewID}
						onChangeText={setSearch}
						value={search}
						placeholder={t('routes.search')}
						autoComplete={'off'}
						autoCorrect={false}
						returnKeyType={'search'}
					/>
				</View>
			</View>
			<View
				style={{
					width: '95%',
					marginBottom: 15
				}}>
				<SectionList
					sections={
						routes.length > 0
							? [
									{
										data: routes.filter((route: any) => route.Name.toLowerCase().includes(search.toLowerCase()))
									}
							  ]
							: []
					}
					renderItem={({ item }) => (
						<Pressable onPress={() => handleRouteSelection(item)}>
							<View
								style={{
									width: '100%',
									flexDirection: 'row',
									justifyContent: 'space-between',
									borderBottomColor: colorSchemeState.accentBackground,
									borderBottomWidth: 1
								}}>
								<Text style={{ padding: 10, fontSize: 18, height: 44, color: colorSchemeState.text }}>{item['Name']}</Text>
								<Text style={{ padding: 10, fontSize: 14, height: 44, color: colorSchemeState.text }}>{'>'}</Text>
							</View>
						</Pressable>
					)}
				/>
				{/* Only shows the InputAccessoryView on Apple IOS */}
				{Platform.OS === 'ios' && (
					<InputAccessoryView nativeID={inputAccessoryViewID}>
						<View
							style={{
								backgroundColor: '#fff'
							}}>
							<Button onPress={() => setSearch('')} title={t('routes.clear')} />
						</View>
					</InputAccessoryView>
				)}

				<WelcomeModal modalVisible={WelcomeModalVisible} setModalVisible={setWelcomeModalVisible} />
				<AboutModal modalVisible={AboutModalVisible} setModalVisible={setAboutModalVisible} />
			</View>
		</View>
	);
};

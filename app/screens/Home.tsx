//External dependencies
import { View, Text, InputAccessoryView, TextInput, Button, ScrollView, Platform, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

//Internal dependencies
import AboutModal from '../components/AboutModal';
import WelcomeModal from '../components/WelcomeModal';

export default () => {
	// AsyncStorage.removeItem('hasSeenWelcome');

	//Initialize useNavigation
	const navigation = useNavigation();

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
		<View style={{ flex: 1, alignItems: 'center', marginTop: 40, marginBottom: 110 }}>
			<View
				style={{
					width: '100%',
					alignItems: 'center',
					padding: 10
				}}>
				<View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
					<Text
						style={{
							fontSize: 35,
							textAlign: 'left',
							marginLeft: 15,
							marginBottom: 5
						}}>
						Select route
					</Text>
					<Pressable onPress={() => setAboutModalVisible(true)} style={{ marginRight: 15 }}>
						<AntDesign name='infocirlce' size={24} color='black' />
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
					placeholder='Search'
					autoComplete={'off'}
					autoCorrect={false}
					returnKeyType={'search'}
				/>
			</View>
			<View
				style={{
					width: '100%',
					marginTop: 20
				}}>
				<ScrollView
					style={{
						width: '100%'
					}}>
					{routes
						.filter((route: any) => {
							return route.Name.toLowerCase().includes(search.toLowerCase());
						})
						.map((route) => (
							<View
								key={route['Id']}
								style={{
									marginLeft: 20,
									marginRight: 20,
									marginBottom: 10
								}}>
								<Button
									title={route['Name']}
									color={Platform.OS === 'android' ? '#8caac2' : ''}
									onPress={() => {
										handleRouteSelection(route);
									}}
								/>
							</View>
						))}
				</ScrollView>

				{/* Only shows the InputAccessoryView on Apple IOS */}
				{Platform.OS === 'ios' && (
					<InputAccessoryView nativeID={inputAccessoryViewID}>
						<View
							style={{
								backgroundColor: '#fff'
							}}>
							<Button onPress={() => setSearch('')} title='Clear' />
						</View>
					</InputAccessoryView>
				)}

				<WelcomeModal modalVisible={WelcomeModalVisible} setModalVisible={setWelcomeModalVisible} />
				<AboutModal modalVisible={AboutModalVisible} setModalVisible={setAboutModalVisible} />
			</View>
		</View>
	);
};

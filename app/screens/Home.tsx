//External dependencies
import { View, Text, InputAccessoryView, TextInput, Button, ScrollView, Platform, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';
import { AntDesign } from '@expo/vector-icons';

//Internal dependencies
import AboutModal from '../components/AboutModal';
import WelcomeModal from '../components/WelcomeModal';

export default () => {
	//Keep splash screen from auto-hiding
	preventAutoHideAsync();

	// AsyncStorage.removeItem('hasSeenWelcome');

	const navigation = useNavigation();
	const inputAccessoryViewID = 'searchFieldClearButton';

	const [WelcomeModalVisible, setWelcomeModalVisible] = useState(false);
	const [AboutModalVisible, setAboutModalVisible] = useState(false);
	const [routes, setRoutes] = useState([]);
	const [search, setSearch] = useState('');

	useEffect(() => {
		getRoutes();

		const unsubscribe = navigation.addListener('focus', () => {
			(async () => {
				const welcome = await AsyncStorage.getItem('hasSeenWelcome');
				if (welcome !== 'true') {
					setWelcomeModalVisible(true);
					return;
				}

				const route = await AsyncStorage.getItem('route');
				if (route) {
					navigation.navigate('Route');
					return;
				}

				getRoutes();
			})();
		});

		return unsubscribe;
	}, [navigation]);

	async function getRoutes() {
		const request = await fetch('https://api.ferrydepartures.com/api/routes');
		const response = await request.json();
		const data = response.routes;
		setRoutes(data);

		//Hide splash screen
		hideAsync();
	}

	async function handleRouteSelection(route: any) {
		await AsyncStorage.setItem('route', JSON.stringify(route));
		navigation.navigate('Route');
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
									onPress={() => {
										handleRouteSelection(route);
									}}
								/>
							</View>
						))}
				</ScrollView>
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

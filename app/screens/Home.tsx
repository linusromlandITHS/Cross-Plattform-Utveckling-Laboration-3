import { View, Text, InputAccessoryView, TextInput, Button, ScrollView, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default () => {
	const navigation = useNavigation();
	const inputAccessoryViewID = 'searchFieldClearButton';

	const [routes, setRoutes] = useState([]);
	const [search, setSearch] = useState('');

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			(async () => {
				const welcome = await AsyncStorage.getItem('welcome');
				if (welcome !== 'true') {
					navigation.navigate('Welcome');
					return;
				}

				const route = await AsyncStorage.getItem('route');
				if (route) {
					navigation.navigate('Route');
					return;
				}

				const data = await getRoutes();
				setRoutes(data);
			})();
		});

		return unsubscribe;
	}, [navigation]);

	async function getRoutes() {
		const request = await fetch('https://api.ferrydepartures.com/api/routes');
		const response = await request.json();
		return response.routes;
	}

	async function handleRouteSelection(route: any) {
		await AsyncStorage.setItem('route', JSON.stringify(route));
		navigation.navigate('Route');
	}

	return (
		<View style={{ flex: 1, alignItems: 'center', marginTop: 60, marginBottom: 95 }}>
			<Text
				style={{
					fontSize: 35,
					width: '95%',
					textAlign: 'left',
					marginLeft: 15,
					marginBottom: 5
				}}>
				Select route:
			</Text>
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
			</View>
		</View>
	);
};

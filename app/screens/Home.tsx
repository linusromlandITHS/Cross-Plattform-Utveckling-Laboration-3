import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

async function getRoutes() {
	const request = await fetch('https://api.ferrydepartures.com/api/routes');
	const response = await request.json();
	return response.routes;
}

export default () => {
	const navigation = useNavigation();

	const [routes, setRoutes] = useState([]);
	const [search, setSearch] = useState('');

	useEffect(() => {
		(async () => {
			const welcome = await AsyncStorage.getItem('welcome');
			if (welcome !== 'true') {
				navigation.navigate('Welcome');
				return;
			}

			const data = await getRoutes();
			setRoutes(data);
		})();
	}, []);

	return (
		<View style={{ flex: 1, alignItems: 'center', marginTop: 85, marginBottom: 95 }}>
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
								<Button title={route['Name']} onPress={() => navigation.navigate('Route', { route })} />
							</View>
						))}
				</ScrollView>
			</View>
		</View>
	);
};

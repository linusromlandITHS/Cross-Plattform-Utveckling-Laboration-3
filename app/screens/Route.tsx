import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default () => {
	const navigation = useNavigation();

	const [routeName, setRouteName] = useState('');
	const [departures, setDepartures] = useState([]);

	useEffect(() => {
		(async () => {
			const welcome = await AsyncStorage.getItem('welcome');
			if (welcome !== 'true') {
				navigation.navigate('Welcome');
				return;
			}

			getRoute();
		})();
	}, []);

	async function getRoute() {
		const route = JSON.parse((await AsyncStorage.getItem('route')) as string) as any;
		if (route === null) {
			navigation.navigate('Home');
			return;
		}

		setRouteName(route['Name']);

		const request = await fetch(`https://api.ferrydepartures.com/api/route/${route['Id']}`);
		const response = await request.json();
		setDepartures(response.departures);
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
				{routeName}
			</Text>
		</View>
	);
};

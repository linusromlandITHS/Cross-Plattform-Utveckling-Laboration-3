import { Image, Button, Text, View } from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default () => {
	const navigation = useNavigation();

	useEffect(() => {
		AsyncStorage.setItem('welcome', 'true');
	}, []);

	return (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: '#fff',
				padding: 20
			}}>
			<Image
				source={require('../assets/background.jpg')}
				style={{
					height: 100,
					width: 250,
					borderRadius: 10,
					alignItems: 'center',
					justifyContent: 'center',
					marginBottom: 20
				}}
			/>
			<Text
				style={{
					fontSize: 25,
					fontWeight: '500'
				}}>
				Welcome to Ferry Departures
			</Text>
			<Text
				style={{
					fontSize: 15,
					marginBottom: 20
				}}>
				This is a app to show the upcoming departures of ferries operated by the Swedish Färjerederiet (Trafikverket).
			</Text>
			<Button title='Show departures' onPress={() => navigation.navigate('Home')} />
		</View>
	);
};

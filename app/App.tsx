//External dependencies
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Internal dependencies
import { HomeScreen, RouteScreen } from './screens';

const Stack = createNativeStackNavigator();

function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false
				}}>
				<Stack.Screen name='Home' component={HomeScreen} />
				<Stack.Screen name='Route' component={RouteScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;

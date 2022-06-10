//External dependencies
import { Modal, Text, View, Button, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default (props: any) => {
	const { modalVisible, setModalVisible } = props;

	function handleClose() {
		AsyncStorage.setItem('hasSeenWelcome', 'true');
		setModalVisible(false);
	}

	return (
		<Modal animationType='slide' transparent={true} visible={modalVisible} onRequestClose={handleClose}>
			<View
				style={{
					flex: 1,
					justifyContent: 'flex-end',
					alignItems: 'center',
					backgroundColor: 'rgba(0,0,0,0.5)'
				}}>
				<View
					style={{
						width: '100%',
						height: '100%',
						backgroundColor: 'white',
						borderRadius: 10,
						justifyContent: 'center',
						alignItems: 'center'
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
					<Button title='Show departures' onPress={handleClose} />
				</View>
			</View>
		</Modal>
	);
};

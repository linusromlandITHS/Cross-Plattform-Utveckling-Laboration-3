//External dependencies
import { Modal, Text, View, Button, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from 'i18n-js';

export default (props: any) => {
	//Initialize data variables
	const { modalVisible, setModalVisible } = props;

	/**
	 * @name handleClose
	 * @description Close the modal and sets the welcome modal as seen in storage.
	 * @returns {void}
	 */
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
						{t('welcome.title')}
					</Text>
					<Text
						style={{
							fontSize: 15,
							marginBottom: 20
						}}>
						{t('welcome.description')}
					</Text>
					<Button title={t('welcome.buttonText')} onPress={handleClose} />
				</View>
			</View>
		</Modal>
	);
};

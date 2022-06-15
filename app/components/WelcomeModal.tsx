//External dependencies
import { Modal, Text, View, Button, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from 'i18n-js';
import { useState, useContext } from 'react';

//Internal dependencies
import ColorSchemeContext from '../contexts/ColorSchemeContext';
import { getColorScheme } from '../utils/appearance';

export default (props: any) => {
	//Initialize data variables
	const { modalVisible, setModalVisible } = props;

	//Initialize useContext
	const colorScheme = useContext(ColorSchemeContext);
	const [colorSchemeState] = useState(getColorScheme(colorScheme as any));

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
						backgroundColor: colorSchemeState.background,
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
							fontWeight: '500',
							color: colorSchemeState.text
						}}>
						{t('welcome.title')}
					</Text>
					<Text
						style={{
							fontSize: 15,
							marginBottom: 20,
							color: colorSchemeState.text
						}}>
						{t('welcome.description')}
					</Text>
					<Button title={t('welcome.buttonText')} onPress={handleClose} />
				</View>
			</View>
		</Modal>
	);
};

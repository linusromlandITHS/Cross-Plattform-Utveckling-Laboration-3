//External dependencies
import { Modal, Text, View, Button } from 'react-native';
import { t } from 'i18n-js';

export default (props: any) => {
	//Initialize data variables
	const { modalVisible, setModalVisible } = props;

	// Default styling for text
	const defaultTextStyle = {
		fontSize: 15,
		marginBottom: 20
	};

	return (
		<Modal
			animationType='slide'
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
				setModalVisible(false);
			}}>
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
						height: '40%',
						backgroundColor: 'white',
						borderRadius: 10,
						margin: 25,
						padding: 25
					}}>
					<Text
						style={{
							fontSize: 25,
							fontWeight: '500',
							marginBottom: 20,
							textAlign: 'center'
						}}>
						{t('about.ferryDepartures')}
					</Text>
					<Text style={defaultTextStyle}>{t('about.description')}</Text>
					<Text style={defaultTextStyle}>{t('about.libility')}</Text>
					<Text style={defaultTextStyle}>{t('about.contact')}</Text>
					<Button
						title={t('about.close')}
						onPress={() => {
							setModalVisible(false);
						}}
					/>
				</View>
			</View>
		</Modal>
	);
};

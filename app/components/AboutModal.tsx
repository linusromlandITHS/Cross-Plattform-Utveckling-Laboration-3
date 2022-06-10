//External dependencies
import { Modal, Text, View, Button } from 'react-native';

export default (props: any) => {
	const { modalVisible, setModalVisible } = props;

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
						height: '80%',
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
						Ferry Departures
					</Text>
					<Text style={defaultTextStyle}>This is a app to show the upcoming departures of ferries operated by the Swedish Färjerederiet (Trafikverket).</Text>
					<Text style={defaultTextStyle}>It's is not a official app of the Swedish Färjerederiet.</Text>
					<Text style={defaultTextStyle}>The data is fetched from Trafikverket's API.</Text>
					<Button
						title='Close'
						onPress={() => {
							setModalVisible(false);
						}}
					/>
				</View>
			</View>
		</Modal>
	);
};

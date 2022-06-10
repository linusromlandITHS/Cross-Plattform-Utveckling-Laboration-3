//External dependencies
import { Modal, Text, View, Button } from 'react-native';

export default (props: any) => {
	const { modalVisible, setModalVisible } = props;

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
						justifyContent: 'center',
						alignItems: 'center'
					}}>
					<Text>Hello World!</Text>
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

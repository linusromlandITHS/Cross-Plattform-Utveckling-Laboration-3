//External dependencies
import { Modal, Text, View, Button } from 'react-native';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

export default (props: any) => {
	//Initialize data variables
	const { modalVisible, setModalVisible, routeName, departureInfo } = props;

	//Initialize state variables
	const [departureDate, setDepartureDate] = useState(dayjs().format('YYYY-MM-DD'));
	const [departureTime, setDepartureTime] = useState('');
	const [departureHarbour, setDepartureHarbour] = useState('');
	const [arrivalHarbour, setArrivalHarbour] = useState('');
	const [departureInformation, setDepartureInformation] = useState(['']);

	//Initialize useEffect
	useEffect(() => {
		if (departureInfo) {
			//Update the departure date and time
			setDepartureDate(dayjs(departureInfo.DepartureTime).format('YYYY-MM-DD'));
			setDepartureTime(dayjs(departureInfo.DepartureTime).format('HH:mm'));
			if (departureInfo['FromHarbor']) setDepartureHarbour(departureInfo['FromHarbor']['Name']);
			if (departureInfo['ToHarbor']) setArrivalHarbour(departureInfo['ToHarbor']['Name']);

			//Update the departure information
			const depInfo = [];
			if (departureInfo['Route'] && departureInfo['Route']['Type'] && departureInfo['Route']['Type']['Id'] == 1) depInfo.push('Returning trip');
			if (departureInfo['Info'] && departureInfo['Info'].length > 0) departureInfo['Info'].forEach((info: any) => depInfo.push(info));
			setDepartureInformation(depInfo);
		}
	}, [departureInfo]);

	/**
	 * @name handleClose
	 * @description Close the modal.
	 * @returns {void}
	 */
	function handleClose() {
		setModalVisible(false);
	}

	const textStyle = {
		fontSize: 20,
		marginBottom: 20
	};

	return (
		<Modal animationType='slide' transparent={true} visible={modalVisible} onRequestClose={handleClose}>
			<View
				style={{
					flex: 1,
					justifyContent: 'flex-end',
					height: '100%',
					alignItems: 'center',
					backgroundColor: 'rgba(0,0,0,0.5)'
				}}>
				<View
					style={{
						width: '100%',
						height: '55%',
						backgroundColor: 'white',
						borderRadius: 10,
						alignItems: 'center'
					}}>
					<View
						style={{
							width: '90%'
						}}>
						{departureInfo && (
							<>
								<Text
									style={{
										fontSize: 30,
										fontWeight: '500',
										marginTop: 25,
										marginBottom: 10
									}}>
									{routeName}
								</Text>

								<Text style={textStyle}>Departures date: {departureDate}</Text>
								<Text style={textStyle}>Departures time: {departureTime}</Text>
								<Text style={textStyle}>Departure Harbor: {departureHarbour}</Text>
								<Text style={textStyle}>Arrival Harbor: {arrivalHarbour}</Text>
								<Text
									style={{
										fontSize: 25,
										fontWeight: '500',
										marginBottom: 10
									}}>
									Departure information:
								</Text>

								{departureInformation.map((info, index) => {
									return (
										<Text
											key={index}
											style={{
												fontSize: 20,
												width: '100%',
												textAlign: 'left',
												marginBottom: 10
											}}>
											{info}
										</Text>
									);
								})}

								{departureInformation.length == 0 && (
									<Text
										style={{
											fontSize: 15,
											width: '100%',
											textAlign: 'left',
											marginBottom: 10
										}}>
										No information available
									</Text>
								)}
							</>
						)}
						<Button title='Close' onPress={handleClose} />
					</View>
				</View>
			</View>
		</Modal>
	);
};

//External dependencies
import { View, Text, FlatList, Button, SafeAreaView, Platform, RefreshControl, Pressable } from 'react-native';
import { useEffect, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import dayjs from 'dayjs';
import { t } from 'i18n-js';
import { AntDesign } from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-status-bar-height';

//Internal dependencies
import RouteInformationModal from '../components/RouteInformationModal';
import ColorSchemeContext from '../contexts/ColorSchemeContext';
import { getColorScheme } from '../utils/appearance';

export default () => {
	//Initialize useNavigation
	const navigation = useNavigation();

	//Initialize data variables
	const [routeName, setRouteName] = useState('');
	const [departures, setDepartures] = useState([]);
	const [routeTimeout, setRouteTimeout] = useState();
	const [refreshing, setRefreshing] = useState(false);
	const [showRouteInformationModal, setShowRouteInformationModal] = useState(false);
	const [departureInfo, setDepartureInfo] = useState({});

	//Initialize useContext
	const colorScheme = useContext(ColorSchemeContext);
	const [colorSchemeState] = useState(getColorScheme(colorScheme as string));

	useEffect(() => {
		//Get the route name and departures
		getRoute();

		//Run on leave
		navigation.addListener('blur', () => {
			//Clear the route name and departures when users leaves the screen
			AsyncStorage.removeItem('route');
		});
	}, []);

	/**
	 * @name getRoute
	 * @description Get the route name and departures
	 * @returns {void}
	 **/
	async function getRoute() {
		//Retrieve the route from storage
		const route = JSON.parse((await AsyncStorage.getItem('route')) as string) as any;

		//If invalid route, navigate to home
		if (route === null) {
			navigation.dispatch(
				CommonActions.navigate({
					name: 'Home'
				})
			);
			return;
		}

		// Updates the route name
		setRouteName(route['Name']);

		// Retrieve the departures from API
		const request = await fetch(`https://api.ferrydepartures.com/api/route/${route['Id']}`);
		const response = await request.json();
		setDepartures(response.departures);

		const tmp = response.departures;

		//Run function again when next departure is scheduled
		const nextDeparture = dayjs(response.departures[0]['DepartureTime']);
		const now = dayjs();
		const diff = nextDeparture.diff(now, 'ms');
		clearTimeout(routeTimeout);
		setRouteTimeout(setTimeout(getRoute, diff + 60000) as any);
	}

	/**
	 * @name onRefresh
	 * @description Refresh the departures
	 * @returns {void}
	 **/
	async function onRefresh() {
		await getRoute();
		setRefreshing(false);
	}

	/**
	 * @name handleChangeRoute
	 * @description Navigate to the home screen
	 * @returns {void}
	 **/
	async function handleChangeRoute() {
		await AsyncStorage.removeItem('route');
		navigation.dispatch(
			CommonActions.navigate({
				name: 'Home'
			})
		);
	}

	/**
	 * @name handleShowRouteInformationModal
	 * @description Show the route information modal
	 * @returns {void}
	 */
	function handleShowRouteInformationModal(departure: Object) {
		setDepartureInfo(departure);
		setShowRouteInformationModal(true);
	}

	/**
	 * @name isToday
	 * @description Check if the input date is today
	 * @param {Date} date
	 * @returns {boolean}
	 **/
	function isToday(date: Date) {
		const now = new Date();
		date = new Date(date);
		return date.setHours(0, 0, 0, 0) === now.setHours(0, 0, 0, 0);
	}

	return (
		<SafeAreaView style={{ flex: 1, paddingBottom: Platform.OS == 'android' ? 20 : 0, paddingTop: getStatusBarHeight(), backgroundColor: colorSchemeState.background }}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginRight: 10,
					marginLeft: 10
				}}>
				<Text
					style={{
						fontSize: 30,
						width: '60%',
						textAlign: 'left',
						marginBottom: 5,
						color: colorSchemeState.text
					}}
					numberOfLines={1}>
					{routeName}
				</Text>
				<Button title={t('route.changeRoute')} onPress={handleChangeRoute}></Button>
			</View>
			<Text
				style={{
					fontSize: 20,
					width: '100%',
					textAlign: 'left',
					backgroundColor: colorSchemeState.accentBackground,
					color: colorSchemeState.text,
					padding: 10
				}}>
				{t('route.nextDepartureFrom')} {departures[0] ? departures[0]['FromHarbor']['Name'] : '...'}
			</Text>
			<Pressable onPress={() => handleShowRouteInformationModal(departures[0])}>
				<Text
					style={{
						fontSize: 20,
						width: '100%',
						textAlign: 'left',
						marginBottom: 5,
						marginTop: 10,
						paddingLeft: 10,
						color: colorSchemeState.text
					}}>
					{departures.length > 0 && departures[0]['Info'] && (departures[0]['Info'] as Array<String>).length > 0 && <AntDesign name='infocirlce' size={18} color={colorSchemeState.colorString} />} {departures.length > 0 && !isToday(departures[0]['DepartureTime']) && t('route.tomorrowAt')}
					{departures.length > 0 ? dayjs(departures[0]['DepartureTime']).format('HH:mm') : t('route.noDepartures')}
				</Text>
			</Pressable>
			{departures.length > 0 && (
				<>
					<Text
						style={{
							fontSize: 20,
							paddingLeft: 10,
							width: '100%',
							textAlign: 'left',
							marginBottom: 10,
							color: colorSchemeState.text
						}}>
						{departures[0]['FromHarbor']['Name']} → {departures[0]['ToHarbor']['Name']}
						{departures[0]['Route']['Type']['Id'] == 1 && <Text> ({t('misc.returningTrip')})</Text>}
					</Text>

					<Text
						style={{
							fontSize: 20,
							width: '100%',
							textAlign: 'left',
							marginBottom: 5,
							backgroundColor: colorSchemeState.accentBackground,
							color: colorSchemeState.text,
							padding: 10
						}}>
						{t('route.moreDepartures')}:
					</Text>
					<FlatList
						style={{
							width: '100%'
						}}
						refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
						data={departures.slice(1)}
						renderItem={({ item, index }) => (
							<Pressable onPress={() => handleShowRouteInformationModal(item)}>
								<View
									key={item}
									style={{
										width: '100%',
										backgroundColor: index % 2 == 0 ? colorSchemeState.background : colorSchemeState.altBackground,
										paddingBottom: 10,
										paddingTop: 10,
										paddingLeft: 10
									}}>
									<View>
										<Text
											style={{
												fontSize: 20,
												textAlign: 'left',
												marginBottom: 5,
												color: colorSchemeState.text
											}}>
											{item && item['Info'] && (item['Info'] as Array<String>).length > 0 && <AntDesign name='infocirlce' size={18} color={colorSchemeState.colorString} />} {!isToday(item['DepartureTime']) && t('route.tomorrowAt')}
											{dayjs(item['DepartureTime']).format('HH:mm')}
										</Text>
									</View>

									<Text
										style={{
											fontSize: 17,
											textAlign: 'left',
											marginBottom: 5,
											color: colorSchemeState.text
										}}>
										{item['FromHarbor']['Name']} → {item['ToHarbor']['Name']}
										{item['Route']['Type']['Id'] == 1 && <Text> ({t('misc.returningTrip')})</Text>}
									</Text>
								</View>
							</Pressable>
						)}
						keyExtractor={(departure) => departure['Id']}
					/>
				</>
			)}
			<RouteInformationModal modalVisible={showRouteInformationModal} setModalVisible={setShowRouteInformationModal} routeName={routeName} departureInfo={departureInfo} />
		</SafeAreaView>
	);
};

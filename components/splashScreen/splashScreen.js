import React, { useEffect, useContext } from 'react';
import { ImageBackground, StyleSheet, View, ActivityIndicator } from 'react-native';
import { IMAGE_PATH } from '../../utils/constants';
import { LoginContext } from '../../context/context';
import { API } from '../../services/apiService';
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen(props) {
    const { setDerivativesData, setHighlights, setdollarvalue, setMarketData, setPastEvents, setExchangesData, setEventData, setUserLogin, setUserSigninId, setUserDetails } = useContext(LoginContext)
    useEffect(() => {
        (async () => {
            let params = {
                date_from: moment().format('YYYY-MM-DD'),
                page_num: 1
            }
            let pasteventsparams = {
                date_to: moment().subtract(1, 'days').format('YYYY-MM-DD'),
                page_num: 1
            }
            const eventsResponse = await API.request('eventsFilter', undefined, 'POST', null, null, null, null, params);
            const pasteventsResponse = await API.request('eventsFilter', undefined, 'POST', null, null, null, null, pasteventsparams);
            const derivativesResult = await API.request('derivatives', undefined, 'GET', null, 1)
            const btcToUsdResponse = await API.request('btcToUsd', undefined, 'GET', null)
            const marketsResult = await API.request('marketDataSort', undefined, 'GET', null, 1, 'market_cap', -1)
            const exchangesResult = await API.request('exchanges', undefined, 'GET', null, 1)
            const highlightsResult = await API.request('highlights', undefined, 'GET', null, null, null, null)
            const categoryData = await API.request('fetchCategories', undefined, 'GET', null, null, null, null)
            await AsyncStorage.setItem('categoryData', JSON.stringify(categoryData))
            setdollarvalue(btcToUsdResponse.rates)
            setDerivativesData(derivativesResult)
            setMarketData(marketsResult)
            setExchangesData(exchangesResult)
            setEventData(eventsResponse)
            setPastEvents(pasteventsResponse)
            setHighlights(highlightsResult)
            props.navigation.replace('home');
            const user = await AsyncStorage.getItem('UserLogin')
            if (user && user.length > 0) {
                setUserLogin(true)
                let data = await AsyncStorage.getItem('UserLogin')
                data = await JSON.parse(data)
                setUserSigninId(data[0].id)
                let userData = {}
                userData['id'] = data[0].id
                userData['name'] = data[0].name
                userData['type'] = data[0].type
                userData['current_date_time'] = data[0].current_date_time
                if (data[0].type == 'google') {
                    userData['image'] = data[0].photoUrl
                    userData['email'] = data[0].email
                    setUserDetails(userData)
                }
                if (data[0].type == 'facebook') {
                    setUserDetails(userData)
                }
            }
        })()
    }, [])
    return (
        <View style={style.container}>
            <ImageBackground style={style.splashScreen} source={IMAGE_PATH.logo}>
            </ImageBackground>
            <ActivityIndicator style={style.activityIndicator} size="large" color="#0000ff" />
        </View>
    );
}
const style = StyleSheet.create({
    splashScreen: {
        height: 66,
        width: 250,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    activityIndicator: {
        paddingTop: 20
    }
});
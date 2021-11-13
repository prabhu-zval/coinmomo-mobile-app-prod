import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, Image, ActivityIndicator, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { LoginContext } from '../../context/context';
import { API } from '../../services/apiService'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Derivatives() {
    const { derivativesData, dollarvalue, setDerivativesData, setScreenLoading } = useContext(LoginContext)
    const [ascendingOpenInterest, setAscendingOpenInterest] = useState(1)
    const [ascending24HVolume, setAscending24HVolume] = useState(1)
    const [noData, setNoData] = useState(false)
    const [activityIndicator, setActivityIndicator] = useState(false)
    const [isListEnd, setIsListEnd] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sortPage, setSortPage] = useState(2)
    const [sortLoading, setSortLoading] = useState(false)
    const [sortIcon, setSortIcon] = useState(false)
    const [currentColName, setCurrentColName] = useState("open_interest_btc")

    useEffect(() => {
        (async () => {
            if (!derivativesData) {
                setActivityIndicator(true)
                const derivativesResult = await API.request('derivatives', undefined, 'GET', null, 1)
                if (!derivativesResult) {
                    setNoData(true)
                } else {
                    setDerivativesData(derivativesResult)
                }
                setActivityIndicator(false)
            }
        })()
    })
    useEffect(() => {
        (async () => {
            onSort(currentColName)
        })()
    }, [currentColName, ascending24HVolume, ascendingOpenInterest])
    const onSort = async (colName) => {
        let order = 1
        switch (colName) {
            case 'open_interest_btc':
                order = ascendingOpenInterest
                break
            case 'trade_volume_24h_btc':
                order = ascending24HVolume
                break
            default: order = 1
        }
        setSortLoading(true)
        setScreenLoading(true)
        const sort = await API.request('derivativesDataSort', undefined, 'GET', null, 1, colName, order)
        setDerivativesData(sort)
        setSortLoading(false)
        setScreenLoading(false)
        setSortPage(2)
    }
    const Loading = async () => {
        let order = 1
        switch (currentColName) {
            case 'open_interest_btc':
                order = ascendingOpenInterest
                break
            case 'trade_volume_24h_btc':
                order = ascending24HVolume
                break
            default: order = 1
        }
        if (!loading && !isListEnd) {
            setLoading(true)
            const sort = await API.request('derivativesDataSort', undefined, 'GET', null, sortPage, currentColName, order)
            if (sort.length > 0) {
                setSortPage(sortPage + 1);
                setDerivativesData(derivativesData.concat(sort));
                setLoading(false);
            } else {
                setIsListEnd(true);
                setLoading(false);
            }
        }
    };
    const renderFooter = () => {
        return (
            <View style={style.footer}>
                {loading ?
                    <ActivityIndicator color="black" style={style.activityIndicator} /> : null
                }
            </View>
        );
    };
    let noDataView =
        <View>
            <Text style={style.error}>Data down time, please try again later... </Text>
        </View>

    let activityIndicatorView =
        <View>
            <ActivityIndicator style={style.loading} size='large' color='#0000ff' ></ActivityIndicator>
        </View>
    const usdValue = dollarvalue && dollarvalue.usd ? dollarvalue.usd.value : null;
    return (
        <View>
            <View style={style.Heading}>
                <Text style={style.exchangesHeading}>Exchanges</Text>
                <View style={style.openInterestContainer}>
                    <TouchableOpacity onPress={() => { setAscendingOpenInterest(ascendingOpenInterest == -1 ? 1 : -1); setCurrentColName("open_interest_btc"); setSortIcon(!sortIcon) }}>
                        <Text style={style.openInterestTitle}>Open Interest </Text>
                        <Text style={style.openInterestIcon}>
                            <AntDesign name={!sortIcon ? 'caretdown' : 'caretup'} size={10} color='white' />
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={style.volume24HContainer}>
                    <TouchableOpacity onPress={() => { setAscending24HVolume(ascending24HVolume == -1 ? 1 : -1); setCurrentColName("trade_volume_24h_btc"); setSortIcon(!sortIcon) }}>
                        <Text style={style.volume24HTitle}>24H Volume </Text>
                        <Text style={style.volume24HIcon}>
                            <AntDesign name={!sortIcon ? 'caretdown' : 'caretup'} size={10} color='white' /></Text>
                    </TouchableOpacity>
                </View>
            </View>
            {
                noData ? noDataView : activityIndicator ? activityIndicatorView : (
                    <View style={style.details}>
                        {sortLoading ? <View style={style.sortLoading}><ActivityIndicator color='blue' size={30} /></View> : null}
                        {derivativesData && <FlatList
                            data={derivativesData.length > 0 && derivativesData}
                            keyExtractor={(item, index) => index.toString()}
                            onEndReached={Loading}
                            ListFooterComponent={renderFooter}
                            onEndReachedThreshold={0.5}
                            renderItem={({ item, index }) => {
                                const openInterestInDollar = item.open_interest_btc ? String((item.open_interest_btc * usdValue).toFixed(0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                                const volume24HInDollar = String((item.trade_volume_24h_btc * usdValue).toFixed(0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                return (
                                    <View key={index} style={style.derivatives}>
                                        <View style={style.iconAndText}>
                                            <Image style={style.derivativeImage} source={{ uri: item.image }} />
                                            <Text style={style.name}>{item.name}</Text>
                                        </View>
                                        {openInterestInDollar ? <Text numberOfLines={1} style={style.openInterest}>{'$' + openInterestInDollar}</Text> : <Text style={style.openInterestNoData}>--</Text>}
                                        <Text numberOfLines={1} style={style.volume24H}>${volume24HInDollar}</Text>
                                    </View>)
                            }} />}
                    </View>
                )
            }
        </View>
    );
}
const style = StyleSheet.create({
    activityIndicator: {
        margin: 15
    },
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    error: {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: '50%'
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: '50%'
    },
    sortLoading: {
        position: 'absolute',
        marginTop: '2%',
        alignSelf: 'center'
    },
    details: {
        paddingBottom: 240
    },
    derivatives: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '3%',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
        paddingBottom: 5
    },
    name: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#525252'
    },
    iconAndText: {
        width: '25%',
        marginLeft: '3%'
    },
    openInterest: {
        justifyContent: 'center',
        width: '37%',
        paddingTop: '1%',
        paddingLeft: '6%',
        fontWeight: 'bold',
        color: 'black'
    },
    openInterestNoData: {
        width: '32%',
        paddingTop: '1%',
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black'
    },
    volume24H: {
        textAlign: 'center',
        paddingTop: '1%',
        paddingLeft: '2%',
        fontWeight: 'bold',
        color: 'black'
    },
    volume24HTitle: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold'
    },
    volume24HContainer: {
        display: 'flex',
        height: 50,
        paddingTop: 15,
        paddingLeft: '5%',
        alignItems: 'center'
    },
    volume24HIcon: {
        width: '95%',
        textAlign: 'center'
    },
    derivativeImage: {
        width: 20,
        height: 20,
        alignSelf: 'center'
    },
    Heading: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#F75626',
        paddingRight: '2%'
    },
    exchangesHeading: {
        fontSize: 15,
        display: 'flex',
        height: 50,
        paddingTop: 15,
        color: 'white',
        fontWeight: 'bold',
        width: '33%',
        textAlign: 'center'
    },
    openInterestTitle: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold'
    },
    openInterestContainer: {
        display: 'flex',
        height: 50,
        paddingTop: 15,
        width: '33%',
        alignItems: 'center'
    },
    openInterestIcon: {
        textAlign: 'center'
    },
});
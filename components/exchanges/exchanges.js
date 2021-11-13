import React, { useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, ActivityIndicator, FlatList } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { LoginContext } from '../../context/context';
import { API } from '../../services/apiService';

export default function Exchanges() {
    const [noData, setNoData] = useState(false)
    const [activityIndicator, setActivityIndicator] = useState(false)
    const { exchangesData, dollarvalue, setExchangesData } = useContext(LoginContext)
    const [page, setPage] = useState(2)
    const [isListEnd, setIsListEnd] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            if (!exchangesData) {
                setActivityIndicator(true)
                const exchangesResult = await API.request('exchanges', undefined, 'GET', null)
                if (!exchangesResult) {
                    setNoData(true)
                } else {
                    setExchangesData(exchangesResult)
                }
                setActivityIndicator(false)
            }
        })()
    })
    const Loading = async () => {
        if (page <= 25 && !loading && !isListEnd) {
            setLoading(true);
            const exchangesResult = await API.request('exchanges', undefined, 'GET', null, page)
            if (exchangesResult.length > 0) {
                setPage(page + 1);
                setExchangesData(exchangesData.concat(exchangesResult));
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
                {loading ? (
                    <ActivityIndicator color="black" style={style.activityIndicator} />
                ) : null}
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
    let exchangesDataJsx = ({ item, index }) => {
        const volume24HInDollardollar = String((item.trade_volume_24h_btc * usdValue).toFixed(0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return (
            <View key={index} style={style.exchanges}>
                <Text style={style.exchangesRank}>{item.trust_score_rank}</Text>
                <View style={style.iconAndText}>
                    <View style={style.symbolAndName}>
                        <Image style={style.exchangesImage} source={{ uri: item.image }} />
                        <View style={style.textArrangement}>
                            <Text style={style.name}>{item.name}</Text>
                            <View style={style.trustScore}>
                                <Octicons style={style.trustIcon} name='heart' size={15} color='green' />
                                <Text style={style.trustScoreNumber}>{item.trust_score}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <Text style={style.volume24H}>${volume24HInDollardollar}</Text>
            </View>)
    }
    return (
        <View>
            {
                noData ? noDataView : activityIndicator ? activityIndicatorView : (
                    <View style={style.details}>
                        <FlatList
                            data={exchangesData.length > 0 && exchangesData}
                            onEndReached={Loading}
                            ListFooterComponent={renderFooter}
                            onEndReachedThreshold={0.5}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={exchangesDataJsx}
                        />
                    </View>
                )
            }
        </View>
    );
}
const style = StyleSheet.create({
    textArrangement: {
        marginLeft: '4%'
    },
    activityIndicator: {
        margin: 15
    },
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
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
    details: {
        height: '100%',
        paddingBottom: 140
    },
    exchanges: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '3%',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
        paddingBottom: 5
    },
    exchangesRank: {
        width: '11%',
        textAlign: 'center',
        paddingTop: '1%',
        fontWeight: 'bold',
        color: '#525252'
    },
    name: {
        fontWeight: 'bold',
        color: '#525252'
    },
    symbolAndName: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%'
    },
    iconAndText: {
        width: '50%',
        textAlign: 'center',
        paddingLeft: '7%'
    },
    trustIcon: {
        marginTop: 1,
        color: 'red'
    },
    trustScore: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
    trustScoreNumber: {
        fontSize: 11,
        marginLeft: '2%',
        fontWeight: 'bold',
        color: '#525252'
    },
    volume24H: {
        paddingLeft: '7%',
        paddingTop: '1%',
        fontWeight: 'bold'
    },
    exchangesImage: {
        width: 25,
        height: 25,
        borderColor: 'black',
        borderWidth: 1
    }
});
import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, ScrollView } from 'react-native';
import { LoginContext } from '../../../context/context'
import moment from 'moment';

export default function Details(props) {
    const { marketData } = useContext(LoginContext)
    const [coinDetails, setCoinDetails] = useState(null)

    useEffect(() => {
        let data = marketData.filter((data) => data.id == props.propName.props.route.params.id)
        setCoinDetails(data)
    }, [])
    return (
        <View style={style.coinDetailsContainer}>
            {coinDetails && coinDetails.length > 0 ?
                <FlatList
                    data={coinDetails}
                    numColumns={2}
                    renderItem={({ item, index }) => {
                        const regEx = /\B(?=(\d{3})+(?!\d))/g
                        const marketCap = String(item.market_cap).toString().replace(regEx, ',')
                        const fullyDilutedValuation = item.fully_diluted_valuation ? String(item.fully_diluted_valuation).toString().replace(regEx, ',') : 0
                        const totalVolume = String(item.total_volume).toString().replace(regEx, ',')
                        const high24h = String(item.high_24h).toString().replace(regEx, ',')
                        const low24h = String(item.low_24h).toString().replace(regEx, ',')
                        const avilable_supply = String(item.circulating_supply).toString().replace(regEx, ',')
                        const total_supply = String(item.total_supply ? item.total_supply : 0).toString().replace(regEx, ',')
                        const ath = String(item.ath).toString().replace(regEx, ',')
                        const atl = String(item.atl).toString().replace(regEx, ',')
                        const athColor = String(item.ath).toString().replace(regEx, ',') < 0 ? 'red' : 'green'
                        const atlColor = String(item.atl).toString().replace(regEx, ',') < 0 ? 'red' : 'green'
                        return (
                            <View key={index} style={style.detailsContainer}>
                                <ScrollView>
                                    <View style={style.marketDetailsContainer}>
                                        <View style={style.Marketdetails}>
                                            <Text style={style.marketText}>MARKET CAP RANK</Text>
                                            <Text style={style.marketValue}>{item.market_cap_rank}</Text>
                                        </View>
                                    </View>
                                    <View style={[style.marketDetailsContainer, { backgroundColor: '#e6e6e6' }]}>
                                        <View style={style.Marketdetails}>
                                            <Text style={style.marketText}>MARKET CAP</Text>
                                            <Text style={style.marketValue}>${marketCap}</Text>
                                        </View>
                                    </View>
                                    <View style={style.marketDetailsContainer}>
                                        <View style={style.Marketdetails}>
                                            <Text style={style.marketText}>FULLY DILUTED VALUATION</Text>
                                            <Text style={style.marketValue}>${fullyDilutedValuation}</Text>
                                        </View>
                                    </View>
                                    <View style={[style.marketDetailsContainer, { backgroundColor: '#e6e6e6' }]}>
                                        <View style={style.Marketdetails}>
                                            <Text style={style.marketText}>TRADING VOLUME</Text>
                                            <Text style={style.marketValue}>${totalVolume}</Text>
                                        </View>
                                    </View>
                                    <View style={style.marketDetailsContainer}>
                                        <View style={style.Marketdetails}>
                                            <Text style={style.marketText}>24H HIGH</Text>
                                            <Text style={style.marketValue}>${high24h}</Text>
                                        </View>
                                    </View>
                                    <View style={[style.marketDetailsContainer, { backgroundColor: '#e6e6e6' }]}>
                                        <View style={style.Marketdetails}>
                                            <Text style={style.marketText}>24H LOW</Text>
                                            <Text style={style.marketValue}>${low24h}</Text>
                                        </View>
                                    </View>
                                    <View style={style.marketDetailsContainer}>
                                        <View style={style.Marketdetails}>
                                            <Text style={style.marketText}>AVAILABLE SUPPLY</Text>
                                            <Text style={style.marketValue}>${avilable_supply}</Text>
                                        </View>
                                    </View>
                                    <View style={[style.marketDetailsContainer, { backgroundColor: '#e6e6e6' }]}>
                                        <View style={style.Marketdetails}>
                                            <Text style={style.marketText}>TOTAL SUPPLY</Text>
                                            <Text style={style.marketValue}>${total_supply}</Text>
                                        </View>
                                    </View>
                                    <View style={style.marketDetailsContainer}>
                                        <View style={style.Marketdetails}>
                                            <Text style={style.marketText}>ALL-TIME HIGH</Text>
                                            <Text style={[style.marketValue, { color: athColor }]}>${ath}</Text>
                                        </View>
                                    </View>
                                    <View style={[style.marketDetailsContainer, { backgroundColor: '#e6e6e6' }]}>
                                        <View style={style.Marketdetails}>
                                            <Text style={style.marketText}>SINCE ALL-TIME HIGH</Text>
                                            <Text style={style.marketValue}>{item.ath_change_percentage}%</Text>
                                        </View>
                                    </View>
                                    <View style={style.marketDetailsContainer}>
                                        <View style={style.Marketdetails}>
                                            <Text style={style.marketText}>ALL-TIME HIGH DATE</Text>
                                            <Text style={style.marketValue}>{moment(`${item.ath_date}`).format('DD MMMM YYYY')}</Text>
                                        </View>
                                    </View>
                                    <View style={[style.marketDetailsContainer, { backgroundColor: '#e6e6e6' }]}>
                                        <View style={style.Marketdetails}>
                                            <Text style={style.marketText}>ALL-TIME LOW</Text>
                                            <Text style={[style.marketValue, { color: atlColor }]}>${atl}</Text>
                                        </View>
                                    </View>
                                    <View style={style.marketDetailsContainer}>
                                        <View style={style.Marketdetails}>
                                            <Text style={style.marketText}>SINCE ALL-TIME LOW</Text>
                                            <Text style={style.marketValue}>{item.atl_change_percentage}%</Text>
                                        </View>
                                    </View>
                                    <View style={[style.marketDetailsContainer, { backgroundColor: '#e6e6e6' }]}>
                                        <View style={style.Marketdetails}>
                                            <Text style={style.marketText}>ALL-TIME LOW DATE</Text>
                                            <Text style={style.marketValue}>{moment(`${item.atl_date}`).format('DD MMMM YYYY')}</Text>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        )
                    }}
                /> : <View style={style.detailsView}>
                    <Text style={style.details}>Currently no detail available for this coin!</Text>
                </View>}
        </View>
    )
}
const style = StyleSheet.create({
    details: {
        marginTop: '50%',
        fontSize: 17
    },
    detailsView: {
        alignSelf: 'center',
        justifyContent: 'center'
    },
    coinDetailsContainer: {
        height: '100%'
    },
    detailsContainer: {
        display: 'flex',
        flex: 1,
        backgroundColor: 'white'
    },
    marketDetailsScreen: {
        paddingBottom: 10,
        marginTop: 10
    },
    marketDetailsContainer: {
        width: '100%',
        alignSelf: 'center',
        backgroundColor: 'white',
    },
    Marketdetails: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 15,
        paddingHorizontal: 15
    },
    marketText: {
        color: '#3F51B5',
        fontWeight: 'bold'
    },
    marketValue: {
        color: '#60636e',
        fontWeight: 'bold'
    }
})
import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { LoginContext } from '../../context/context';
import { API } from '../../services/apiService';
import { set } from 'lodash';

export default function Cryptocurrency(props) {
    const { marketData, setMarketData, setScreenLoading, sortBy, conversionPrice, conversionValue, setConversionValue, setConversionPrice, setMarketCapFilter, marketCapFilter, setMarketCapFilterValue, marketCapFilterValue } = useContext(LoginContext)
    const [ascendingRank, setAscendingRank] = useState(1)
    const [ascendingPrice, setAscendingPrice] = useState(1)
    const [ascending24H, setAscending24H] = useState(1)
    const [ascendingMarketCap, setAscendingMarketCap] = useState(-1)
    const [noData, setNoData] = useState(false)
    const [activityIndicator, setActivityIndicator] = useState(false)
    const [currentColName, setCurrentColName] = useState("market_cap")
    const [isListEnd, setIsListEnd] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sortPage, setSortPage] = useState(2)
    const [sortIcon, setSortIcon] = useState(false)
    const [sortLoading, setSortLoading] = useState(false)

    useEffect(() => {
        (async () => {
            if (!marketData) {
                setActivityIndicator(true)
                const marketsResult = await API.request('markets', undefined, 'GET', null, 1)
                if (!marketsResult) {
                    setNoData(true)
                } else {
                    setMarketData(marketsResult)
                }
                setActivityIndicator(false)
            }
            if (sortBy) {
                let params = {
                    sort_by: sortBy,
                    page_num: 1
                }
                const sortbymarketresult = await API.request("sortByMarket", undefined, 'POST', null, null, null, null, null, params)
                setMarketData(sortbymarketresult)
            }
        })()
    }, [sortBy])
    useEffect(() => {
        (async () => {
            onSort(currentColName)
        })()
    }, [currentColName, ascendingMarketCap, ascendingPrice, ascendingRank, ascending24H])
    useEffect(() => {
        setMarketCapFilterValue('MARKET CAP')
        setConversionValue("BTC")
        setConversionPrice(1)
    }, [])
    const onSort = async (colName) => {
        let order = 1
        switch (colName) {
            case 'market_cap_rank':
                order = ascendingRank
                break
            case 'current_price':
                order = ascendingPrice
                break
            case 'price_change_percentage_24h':
                order = ascending24H
                break
            case 'market_cap':
                order = ascendingMarketCap
                break
            default: order = 1
        }
        setSortLoading(true)
        setScreenLoading(true)
        const sort = await API.request('marketDataSort', undefined, 'GET', null, 1, colName, order)
        setMarketData(sort)
        setSortLoading(false)
        setScreenLoading(false)
        setSortPage(2)
    }
    const Loading = async () => {
        if (!sortBy) {
            let order = 1
            switch (currentColName) {
                case 'market_cap_rank':
                    order = ascendingRank
                    break
                case 'current_price':
                    order = ascendingPrice
                    break
                case 'price_change_percentage_24h':
                    order = ascending24H
                    break
                case 'market_cap':
                    order = ascendingMarketCap
                    break
                default: order = 1
            }
            if (!loading && !isListEnd) {
                setLoading(true)
                const sort = await API.request('marketDataSort', undefined, 'GET', null, sortPage, currentColName, order)
                if (sort.length > 0) {
                    setSortPage(sortPage + 1);
                    setMarketData(marketData.concat(sort));
                    setLoading(false);
                } else {
                    setIsListEnd(true);
                    setLoading(false);
                }
            }
        }
        else {
            let params = {
                sort_by: sortBy,
                page_num: sortPage
            }
            if (!loading && !isListEnd) {
                setLoading(true)
                const sortbymarketresult = await API.request("sortByMarket", undefined, 'POST', null, null, null, null, null, params)
                if (sortbymarketresult.length > 0) {
                    setSortPage(sortPage + 1);
                    setMarketData(marketData.concat(sortbymarketresult));
                    setLoading(false);
                } else {
                    setIsListEnd(true);
                    setLoading(false);
                }
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
    let marketDataJsx = ({ item, index }) => {
        const regEx = /\B(?=(\d{3})+(?!\d))/g
        let price24HColor = item.price_change_percentage_24h < 0 ? 'red' : 'green'
        const marketPriceInDollar = String((parseFloat(item.current_price.toString().replace(/,/g, '')) * conversionPrice).toFixed(2)).toString().replace(regEx, ',')
        const marketCapInDollar = String(item.market_cap).toString().replace(regEx, ',')
        return (
            <TouchableOpacity key={index} onPress={() => props.navigation.navigate('coinDetailsPage', { id: item.id, name: item.name, symbol: item.symbol })}>
                <View key={index} style={style.market}>
                    {item.market_cap_rank ? <Text style={style.marketCapRank}>{item.market_cap_rank}</Text> : <Text style={style.marketCapRank}>--</Text>}
                    <View style={style.iconAndText}>
                        <TouchableOpacity>
                            <Image style={style.marketImage} source={{ uri: item.image }} />
                            <View style={style.symbolView}><Text style={style.symbolText}>{item.symbol.toUpperCase()}</Text></View></TouchableOpacity>
                    </View>
                    {item.current_price ? <View style={style.marketPrice}><Text numberOfLines={1} style={style.priceText}>${marketPriceInDollar}</Text></View> : <View style={style.noMarketPrice}><Text style={style.priceText}>--</Text></View>}
                    {item.price_change_percentage_24h ? <View style={style.volumeAlignment}><Text numberOfLines={1} style={[style.price24H, { color: price24HColor }]}>{item.price_change_percentage_24h.toFixed(2)}%</Text></View> : <View style={style.volumeAlignment}><Text style={style.noPrice24H}>--</Text></View>}
                    {item.market_cap ? <View style={style.marketcapAlignment}><Text numberOfLines={1} style={style.marketCap}>${marketCapInDollar}</Text></View> : <View style={style.marketcapAlignment}><Text style={style.noMarketCap}>--</Text></View>}
                </View>
            </TouchableOpacity>
        );
    }
    return (
        <View>
            <View style={style.filtersContainer}>
                <TouchableOpacity activeOpacity={.9} onPress={() => props.navigation.navigate('btcToUsdFilter')} >
                    <View style={style.btcFilters}>
                        <Text style={style.hourFilter}>{conversionValue}</Text>
                        <AntDesign style={style.filterIcon} name='caretdown' size={13} color='white' />
                    </View>
                </TouchableOpacity>
                {/* <TouchableOpacity activeOpacity={.9} onPress={() => props.navigation.navigate('hourFilter')}>
          <View style={style.filters}>
            <Text style={style.hourFilter}>1H</Text>
            <AntDesign style={style.filterIcon} name='caretdown' size={13} color='white' />
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={.9} onPress={() => props.navigation.navigate('allFilter')} >
          <View style={style.filters}>
            <Text style={style.hourFilter}>ALL</Text>
            <AntDesign style={style.filterIcon} name='caretdown' size={13} color='white' />
          </View>
        </TouchableOpacity> */}
                <TouchableOpacity activeOpacity={.9} onPress={() => props.navigation.navigate('priceFilter')}>
                    <View style={style.priceFilters}>
                        <Text style={style.hourFilter}>{marketCapFilterValue}</Text>
                        <AntDesign style={style.filterIcon} name='caretdown' size={13} color='white' />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={style.Heading}>
                <View style={style.rankContainer}>
                    <TouchableOpacity onPress={() => { setAscendingRank(ascendingRank == -1 ? 1 : -1); setCurrentColName("market_cap_rank"); setSortIcon(!sortIcon); props.sortLoading }}>
                        <Text style={style.rankHeading}># </Text>
                        <Text style={style.rankIcon}>
                            <AntDesign name={!sortIcon ? 'caretdown' : 'caretup'} size={10} color='white' /></Text>
                    </TouchableOpacity>
                </View>
                <Text style={style.coinHeading}>COIN</Text>
                <View style={style.priceContainer}>
                    <TouchableOpacity onPress={() => { setAscendingPrice(ascendingPrice == -1 ? 1 : -1); setCurrentColName("current_price"); setSortIcon(!sortIcon) }}>
                        <Text style={style.priceHeading}>PRICE</Text>
                        <Text style={style.priceIcon}>
                            <AntDesign name={!sortIcon ? 'caretdown' : 'caretup'} size={10} color='white' /></Text>
                    </TouchableOpacity>
                </View>
                <View style={style.heading24HContainer}>
                    <TouchableOpacity onPress={() => { setAscending24H(ascending24H == -1 ? 1 : -1); setCurrentColName("price_change_percentage_24h"); setSortIcon(!sortIcon) }}>
                        <Text style={style.heading24H}>24H</Text>
                        <Text style={style.Icon24H}>
                            <AntDesign name={!sortIcon ? 'caretdown' : 'caretup'} size={10} color='white' /></Text>
                    </TouchableOpacity>
                </View>
                <View style={style.marketCapContainer}>
                    <TouchableOpacity onPress={() => { setAscendingMarketCap(ascendingMarketCap == -1 ? 1 : -1); setCurrentColName("market_cap"); setSortIcon(!sortIcon) }}>
                        <Text style={style.marketCapTitle}>MARKET CAP</Text>
                        <Text style={style.marketCapIcon}>
                            <AntDesign name={!sortIcon ? 'caretdown' : 'caretup'} size={10} color='white' /></Text>
                    </TouchableOpacity>
                </View>
            </View>
            {
                noData ? noDataView : activityIndicator ? activityIndicatorView : (
                    <View style={style.details}>
                        {sortLoading ? <View style={style.sortLoading}><ActivityIndicator color='blue' size={30} /></View> : null}
                        <FlatList
                            data={marketData.length > 0 && marketData}
                            onEndReached={Loading}
                            ListFooterComponent={renderFooter}
                            onEndReachedThreshold={0.5}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={marketDataJsx}
                        />
                    </View>
                )
            }
        </View >
    );
}
const style = StyleSheet.create({
    marketcapAlignment: {
        width: '32%',
        alignItems: 'center',
        paddingLeft: '2%'
    },
    volumeAlignment: {
        width: '13%',
        alignItems: 'center'
    },
    priceText: {
        fontWeight: 'bold',
        color: 'black'
    },
    activityIndicator: {
        margin: 15
    },
    filtersContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    filters: {
        display: 'flex',
        flexDirection: 'row',
        width: 70,
        height: 30,
        marginBottom: 5,
        marginLeft: 10,
        marginTop: 10,
        justifyContent: 'space-around',
        backgroundColor: '#3F51B5',
        borderRadius: 2
    },
    priceFilters: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 5,
        marginLeft: 10,
        marginTop: 10,
        padding: 5,
        justifyContent: 'space-around',
        backgroundColor: '#3F51B5',
        borderRadius: 2,
    },
    btcFilters: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 5,
        marginLeft: 10,
        marginTop: 10,
        padding: 5,
        justifyContent: 'space-around',
        backgroundColor: '#3F51B5',
        borderRadius: 2,
    },
    hourFilter: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    filterIcon: {
        marginTop: 3,
        marginLeft: 5
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
        marginTop: '50%',
        alignSelf: 'center',
    },
    details: {
        height: '100%',
        paddingBottom: 330
    },
    market: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '3%',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 0.7,
        paddingBottom: 5
    },
    marketCapRank: {
        width: '10%',
        textAlign: 'center',
        paddingTop: '1%',
        fontWeight: 'bold',
        color: '#525252'
    },
    iconAndText: {
        width: '15%',
        display: 'flex',
        alignItems: 'center'
    },
    symbolText: {
        fontWeight: 'bold',
        color: '#525252'
    },
    symbolView: {
        width: '80%',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    price24H: {
        paddingTop: '7%',
        fontWeight: 'bold',
    },
    noPrice24H: {
        paddingTop: '7%',
        fontWeight: 'bold',
    },
    marketPrice: {
        width: '22%',
        paddingTop: '1%',
        alignItems: 'center'
    },
    noMarketPrice: {
        width: '25%',
        paddingTop: '1%',
    },
    marketCap: {
        paddingTop: '2%',
        fontWeight: 'bold',
        color: 'black'
    },
    noMarketCap: {
        paddingTop: '2%',
        fontWeight: 'bold',
        color: 'black'
    },
    marketCapTitle: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold'
    },
    marketCapContainer: {
        display: 'flex',
        height: 50,
        paddingTop: 15,
        marginRight: '5%',
        marginLeft: '6%'
    },
    marketCapIcon: {
        textAlign: 'center'
    },
    marketImage: {
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
    coinHeading: {
        fontSize: 15,
        display: 'flex',
        height: 50,
        paddingTop: 15,
        color: 'white',
        fontWeight: 'bold',
        width: '15%',
        textAlign: 'center'
    },
    priceHeading: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold'
    },
    priceContainer: {
        display: 'flex',
        height: 50,
        paddingTop: 15,
        width: '22%',
        alignItems: 'center'
    },
    priceIcon: {
        alignSelf: 'center',
        width: '40%'
    },
    heading24H: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold'
    },
    heading24HContainer: {
        display: 'flex',
        height: 50,
        paddingTop: 15,
        width: '15%',
        paddingLeft: '1%',
        alignItems: 'center'
    },
    Icon24H: {
        width: '40%',
        alignSelf: 'center'
    },
    rankContainer: {
        backgroundColor: '#F75626',
        height: 50,
        paddingTop: 15,
        width: '10%',
        alignItems: 'center'
    },
    rankHeading: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        paddingLeft: 4
    },
    rankIcon: {
        textAlign: 'center'
    },
});
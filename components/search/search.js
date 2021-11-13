import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput, Keyboard, ActivityIndicator, Pressable, Image, FlatList } from "react-native";
import { API } from '../../services/apiService';
import { IMAGE_PATH } from '../../utils/constants';

const Search = (props) => {
    const [titleLabel, setTitleLabel] = useState(false)
    const [coinInputValue, setCoinInputValue] = useState(null)
    const [coinImage, setCoinImage] = useState(null)
    const [coinDataloading, setCoinDataLoading] = useState(false)
    const [coinRenderData, setCoinRenderData] = useState([])
    const [noCoinData, setNoCoinData] = useState(false)
    const [page, setPage] = useState(2)
    const [loading, setLoading] = useState(false)
    const [enteredValue, setEnteredValue] = useState(null)

    useEffect(() => {
        (async () => {
            setNoCoinData(false)
            setCoinDataLoading(true)
            const params = {
                page_size: 15,
                page_num: 1
            }
            const coinItems = await API.request('fetchCoins', undefined, 'GET', null, null, null, null, params)
            const suggestions = coinItems.map((item, index) => ({
                price: item.current_price,
                id: item.id,
                name: item.name,
                title: item.name + ` (${item.symbol.toUpperCase()})`,
                image: item.image,
                symbol: item.symbol
            }))
            setCoinRenderData(suggestions)
            setCoinDataLoading(false)
        })();
    }, []);
    const onChangeCoinTextFunction = async (q) => {
        setEnteredValue(q)
        setCoinRenderData(null)
        setCoinDataLoading(true)
        setNoCoinData(false)
        if (q) {
            const params = {
                q: q,
                page_num: 1
            }
            API.request('fetchCoins', undefined, 'GET', null, null, null, null, params)
                .then((result) => {
                    let data = result && result.map((item, index) => ({
                        price: item.current_price,
                        id: item.id,
                        name: item.name,
                        title: item.name + ` (${item.symbol.toUpperCase()})`,
                        image: item.image,
                        symbol: item.symbol
                    }));
                    setCoinRenderData(data)
                    setCoinDataLoading(false)
                    if (data.length == 0) {
                        setNoCoinData(true)
                    }
                }
                )
        }
        else {
            setNoCoinData(false)
            setCoinRenderData(null)
            setCoinDataLoading(true)
            const params = {
                page_num: 1
            }
            const coinItems = await API.request('fetchCoins', undefined, 'GET', null, null, null, null, params)
            const suggestions = coinItems && coinItems.map((item, index) => ({
                price: item.current_price,
                id: item.id,
                name: item.name,
                title: item.name + ` (${item.symbol.toUpperCase()})`,
                image: item.image,
                symbol: item.symbol
            }))
            setCoinRenderData(suggestions)
            setCoinDataLoading(false)
        }
    }
    const coinData = async (enteredValue) => {
        setNoCoinData(false)
        setLoading(true)
        let params = {}
        enteredValue ? params["q"] = enteredValue : delete params["q"]
        params["page_num"] = page
        API.request('fetchCoins', undefined, 'GET', null, null, null, null, params)
            .then((result) => {
                let data = result && result.map((item, index) => ({
                    price: item.current_price,
                    id: item.id,
                    name: item.name,
                    title: item.name + ` (${item.symbol.toUpperCase()})`,
                    image: item.image,
                    symbol: item.symbol
                }));
                setPage(page + 1)
                setCoinRenderData(coinRenderData.concat(data))
            }
            )
        setLoading(false)
    }
    const renderFooter = () => {
        return (
            <View style={style.footer}>
                {loading ? <ActivityIndicator color="blue" size="small" style={style.activityIndicator} /> : null}
            </View>
        );
    };
    return (
        <View style={style.portfolios}>
            <View style={style.threadIconAndText}>
                <View style={style.threadView}>
                    <Image style={style.coimmomoLogo} source={IMAGE_PATH.logo} />
                </View>
            </View>
            <View style={style.content}>
                <View style={style.titleAndTextInput}>
                    {titleLabel ? <View style={style.addTitleView}>
                        <Text style={style.label}>Search Coin</Text>
                    </View> : <View style={style.noTitle}></View>}
                    <View style={style.textInputs}>
                        <TextInput maxLength={150} value={coinInputValue} onChangeText={(text) => onChangeCoinTextFunction(text)} style={titleLabel ? style.titleInputBox : style.titleTextInput} placeholder={titleLabel ? '' : 'Search Coin...'} onFocus={() => { setTitleLabel(true); setCoinImage(null); setCoinInputValue(null) }} autoCorrect={false} />
                        <View style={titleLabel ? style.titleStarInputBox : style.titleStarTextInput}><Text style={style.starInput}></Text></View>
                    </View>
                </View>
                {coinDataloading ? <View style={style.loadingView}><Text style={style.loadingText}>Loading...</Text><ActivityIndicator size={23} color='blue' /></View> : null}
                {coinRenderData ? <View style={style.suggestionsContainer}>
                    {noCoinData ? <View style={style.noDataView}><Text style={style.noDataAvailable} >NO DATA AVAILABLE</Text></View> : <View></View>}
                    <FlatList
                        data={coinRenderData.length > 0 && coinRenderData}
                        keyboardShouldPersistTaps={'handled'}
                        onEndReached={() => coinData(enteredValue)}
                        ListFooterComponent={renderFooter}
                        onEndReachedThreshold={0.5}
                        renderItem={({ item, index }) => {
                            return (
                                <View key={index}>
                                    <Pressable onPress={() => { setCoinInputValue(item.title); setCoinRenderData(null); setCoinImage(item.image); Keyboard.dismiss(); props.navigation.navigate('coinDetailsPage', { id: item.id, name: item.name, symbol: item.symbol }) }}>
                                        <View style={[style.coinSuggestionsView, { backgroundColor: index % 2 == 0 ? 'white' : '#e6e6e6' }]}>
                                            <Image style={style.coinSuggestionsImage} source={{ uri: item.image }} />
                                            <Text style={style.coinSuggestionsText} >{item.title}</Text>
                                        </View>
                                    </Pressable>
                                </View>
                            )
                        }}
                    />
                </View> : null}
            </View>
        </View>
    );
}
const style = StyleSheet.create({
    footer: {
        height: '5%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    loadingText: {
        marginTop: 5,
        fontWeight: 'bold'
    },
    highlightsText: {
        fontWeight: "bold",
        fontSize: 18,
        alignSelf: 'center',
        color: "white",
    },
    headingIcon: {
        width: 40,
        paddingLeft: 10
    },
    highlights: {
        display: "flex",
        justifyContent: 'center',
        paddingVertical: 15,
        backgroundColor: "#F75626",
    },
    portfolios: {
        height: "100%",
        width: "100%",
    },
    threadIconAndText: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: "3%",
        paddingRight: "3%",
        paddingBottom: 5,
        height: 70,
        backgroundColor: "white",
        paddingTop: 25,
        borderBottomWidth: 0.5,
        borderBottomColor: "red",
    },
    threadView: {
        zIndex: -1,
        position: "absolute",
        width: "100%",
        height: 70,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
    },
    coimmomoLogo: {
        width: 150,
        height: 40,
    },
    coinSuggestionsText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
        marginLeft: 15,
        marginTop: 16
    },
    coinSuggestionsImage: {
        height: 35,
        width: 35,
        marginLeft: 15,
        marginTop: 10
    },
    coinSuggestionsView: {
        height: 58,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 0.6,
        borderColor: 'lightgrey',
        elevation: 10,
    },
    noDataView: {
        width: '100%',
        display: 'flex',
        backgroundColor: 'white',
        height: 40,
        textAlign: 'center',
        justifyContent: 'center',
        borderWidth: 0.4
    },
    noDataAvailable: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
    suggestionsContainer: {
        position: 'absolute',
        height: '79%',
        width: '100%',
        marginTop: '20%',
        alignSelf: 'center',
        zIndex: 1
    },
    loadingView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        alignSelf: 'center',
        marginTop: '20.5%',
        backgroundColor: 'white',
        height: 40,
        paddingTop: 4,
        borderWidth: 0.5
    },
    starInput: {
        fontSize: 20,
        color: 'red'
    },
    titleStarTextInput: {
        width: '1%',
        height: 40,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: '#eff2f5',
        paddingLeft: '5%'
    },
    titleStarInputBox: {
        width: '1%',
        height: 40,
        borderWidth: 1.5,
        borderColor: '#F75626',
        borderRadius: 5,
        borderLeftWidth: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        backgroundColor: '#eff2f5',
        paddingLeft: '5%'
    },
    titleTextInput: {
        width: '92%',
        height: 40,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        paddingLeft: '5%',
        backgroundColor: '#eff2f5',
        paddingRight: '1%'
    },
    titleInputBox: {
        width: '92%',
        height: 40,
        borderWidth: 1.5,
        backgroundColor: '#eff2f5',
        borderColor: '#F75626',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRightWidth: 0,
        borderRadius: 5,
        paddingLeft: '5%'
    },
    textInputs: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    noTitle: {
        display: 'flex',
        flexDirection: 'row',
    },
    label: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: '1%',
        marginLeft: '4%'
    },
    addTitleView: {
        display: 'flex',
        flexDirection: 'row',
    },
    titleAndTextInput: {
        backgroundColor: '#F75626',
        width: '100%',
        height: 85,
        justifyContent: 'center'
    },
    searchHeader: {
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 25,
        backgroundColor: 'white',
        paddingTop: 20,
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#dcdcdc'
    },
    searchView: {
        position: 'relative',
        height: '100%'
    },
    searchText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3F51B5'
    },
    content: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white'
    },
});
export default Search
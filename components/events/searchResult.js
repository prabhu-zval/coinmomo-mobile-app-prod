import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableHighlight, ActivityIndicator, FlatList, LogBox } from "react-native";
import { API } from '../../services/apiService';
import moment from 'moment';
import { IMAGE_PATH } from '../../utils/constants';

export default function SearchResult(props) {
    const [loading, setLoading] = useState(false)
    const [isListEnd, setIsListEnd] = useState(false)
    const [eventsdata, setEventsdata] = useState([])
    const [page, setPage] = useState(2)
    const [screenLoading, setScreenLoading] = useState(false)
    useEffect(() => {
        (async () => {
            setScreenLoading(true)
            if (props.route.params) {
                let finalStartDate = props.route.params.advanceSearchObj.startDate ? moment(props.route.params.advanceSearchObj.startDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
                let finalEndDate = props.route.params.advanceSearchObj.endDate ? moment(props.route.params.advanceSearchObj.endDate).format('YYYY-MM-DD') : null
                let coindata = props.route.params.advanceSearchObj.coinData ? props.route.params.advanceSearchObj.coinData : null;
                let categorydata = props.route.params.advanceSearchObj.categoryData ? props.route.params.advanceSearchObj.categoryData : null;
                let params = {}
                coindata ? params["coin_symbol_arr"] = coindata : delete params["coin_symbol_arr"]
                categorydata ? params["category_id_arr"] = categorydata : delete params["category_id_arr"]
                finalEndDate ? params["date_to"] = finalEndDate : delete params["date_to"]
                params["date_from"] = finalStartDate
                params["page_num"] = 1
                let filterdata = await API.request('eventsFilter', undefined, 'POST', null, null, null, null, null, params);
                let totalData = filterdata.length > 0 && filterdata.map((val) => {
                    return (
                        {
                            title: val.title,
                            date_event: val.date_event,
                            description: {
                                en: val.description && val.description.en,
                            },
                            vote_count: val.vote_count,
                            view_count: val.view_count,
                            created_date: val.created_date,
                            source: val.source,
                            categories: val.categories,
                            coins: val.coins
                        }
                    )
                })
                setEventsdata(totalData)
            }
            setScreenLoading(false)
        })()
        LogBox.ignoreLogs([
            'Non-serializable values were found in the navigation state',
        ]);
    }, []);
    const Loading = async () => {
        if (!loading && !isListEnd) {
            setLoading(true)
            if (props.route.params) {
                let finalStartDate = props.route.params.advanceSearchObj.startDate ? moment(props.route.params.advanceSearchObj.startDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
                let finalEndDate = props.route.params.advanceSearchObj.endDate ? moment(props.route.params.advanceSearchObj.endDate).format('YYYY-MM-DD') : null
                let coindata = props.route.params.advanceSearchObj.coinData ? props.route.params.advanceSearchObj.coinData : null;
                let categorydata = props.route.params.advanceSearchObj.categoryData ? props.route.params.advanceSearchObj.categoryData : null;
                let params = {}
                coindata ? params["coin_symbol_arr"] = coindata : delete params["coin_symbol_arr"]
                categorydata ? params["category_id_arr"] = categorydata : delete params["category_id_arr"]
                finalEndDate ? params["date_to"] = finalEndDate : delete params["date_to"]
                params["date_from"] = finalStartDate
                params["page_num"] = page
                if (params.coin_symbol_arr || params.category_id_arr || params.date_from || params.date_to) {
                    let filterdata = await API.request('eventsFilter', undefined, 'POST', null, null, null, null, params);
                    let totalData = filterdata.length > 0 && filterdata.map((val) => {
                        return (
                            {
                                title: val.title,
                                date_event: val.date_event,
                                description: {
                                    en: val.description && val.description.en
                                },
                                vote_count: val.vote_count,
                                view_count: val.view_count,
                                created_date: val.created_date,
                                original_source: val.original_source,
                                source: val.source,
                                categories: val.categories,
                                coins: val.coins
                            }
                        )
                    })
                    if (totalData.length > 0) {
                        setPage(page + 1),
                            setEventsdata(eventsdata.concat(totalData))
                    } else {
                        setIsListEnd(true)
                    }
                }
                else {
                    let params = {
                        date_from: moment().format('YYYY-MM-DD'),
                        page_num: page
                    }
                    const eventsResult = await API.request('eventsFilter', undefined, 'POST', null, null, null, null, params);
                    if (eventsResult.length > 0) {
                        setPage(page + 1),
                            setEventsdata(eventsdata.concat(eventsResult))
                    } else {
                        setIsListEnd(true)
                    }
                }
            }
            setLoading(false)
        }
    }
    const renderFooter = () => {
        return (
            <View style={style.footer}>
                {loading ? (
                    <ActivityIndicator color="black" style={{ margin: 15 }} />
                ) : null}
            </View>
        );
    }
    const emptyData = () => {
        return (
            <View style={style.noFiltersData}>
                {screenLoading ? null : <Text style={style.noFilterDataText}>No Events Available</Text>}
            </View>
        )
    }
    return (
        <View style={style.cointainerView}>
            <View style={style.headerView}>
                <View style={style.header}>
                    <Image style={style.coimmomoLogo} source={IMAGE_PATH.logo} />
                </View>
            </View>
            <View style={style.titleView}>
                <Text style={style.title}>Advance Search Result</Text>
            </View>
            <View style={style.content}>
                {screenLoading ? <View>
                    <ActivityIndicator color="blue" size={30} style={{ margin: '20%' }} />
                </View> : null}
                <View style={style.eventsDataList}>
                    <FlatList
                        data={eventsdata.length > 0 && eventsdata}
                        numColumns={2}
                        keyboardShouldPersistTap="always"
                        onEndReached={() => Loading()}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={renderFooter}
                        onEndReachedThreshold={0.5}
                        ListEmptyComponent={emptyData}
                        renderItem={({ item, index }) => {
                            return (
                                <View key={index} style={style.dataContainer}>
                                    <View style={style.eventsList}>
                                        <View style={style.imageAndSymbol}>
                                            <Image style={style.imageById} source={{ uri: IMAGE_PATH.imageurl + `${item.coins[0].id}_normal.png` }} />
                                            <Text ellipsizeMode='tail' numberOfLines={1} style={style.titleText}>{item.coins[0].name} ({item.coins[0].symbol})</Text>
                                        </View>
                                        <Text style={style.eventDate}>{moment(`${item.date_event}`).format('DD MMMM YYYY')}</Text>
                                        {item.description ? <Text numberOfLines={2} style={style.descriptionText}>{item.description.en}</Text> : null}
                                        <TouchableHighlight style={style.source} onPress={() => { Linking.openURL(`${item.original_source}`) }} underlayColor='lightblue'><Text style={style.sourceText}>Read more</Text></TouchableHighlight>
                                        <View style={style.viewsAndVotes}>
                                            <View style={style.viewsAndVotesRow}>
                                                <Text style={style.votes}>Votes: </Text>
                                                <Text style={style.viewsAndVotesValue}>{item.vote_count}</Text>
                                            </View>
                                            <View style={style.viewsAndVotesRow}>
                                                <Text style={style.views}>Views: </Text>
                                                <Text style={style.viewsAndVotesValue}>{item.view_count}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Text style={style.eventCreatedDate}>Added on - {moment(`${item.created_date}`).format('DD MMMM YYYY')}</Text>
                                </View>
                            )
                        }}
                    />
                </View>
            </View>
        </View>
    );
}
const style = StyleSheet.create({
    noFiltersData: {
        display: 'flex',
        marginTop: '60%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    noFilterDataText: {
        alignSelf: 'center',
        fontSize: 20
    },
    titleView: {
        display: "flex",
        paddingVertical: 15,
        backgroundColor: "#F75626",
    },
    title: {
        fontWeight: "bold",
        fontSize: 18,
        alignSelf: 'center',
        color: "white",
    },
    footer: {
        height: 50,
        width: '100%',
        backgroundColor: 'white'
    },
    eventDate: {
        fontSize: 11,
        fontWeight: 'bold',
        color: 'green',
        marginTop: 4,
        textAlign: 'center'
    },
    eventCreatedDate: {
        height: 27,
        fontWeight: 'bold',
        padding: 4,
        textAlign: 'center',
        width: '100%',
        fontSize: 12,
        alignSelf: 'center',
        color: 'white',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: '#3F51B5',
    },
    viewsAndVotesValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'green'
    },
    viewsAndVotesRow: {
        flexDirection: 'row'
    },
    views: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#8c8c8c'
    },
    votes: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#8c8c8c'
    },
    viewsAndVotes: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
        paddingLeft: 10,
        paddingRight: 10
    },
    titleText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 2,
        marginTop: 4
    },
    descriptionText: {
        fontSize: 12,
        color: '#525252',
        fontWeight: 'bold',
        paddingLeft: 10,
        marginTop: 7,
        paddingRight: 10
    },
    source: {
        height: 20,
        width: '50%',
        textAlign: 'center',
        marginTop: 8,
        fontSize: 10,
        alignSelf: 'center',
        color: 'white',
        borderRadius: 50,
        backgroundColor: '#3F51B5',
    },
    sourceText: {
        marginTop: '1%',
        color: 'white',
        textAlign: 'center',
        fontSize: 12.5,
        fontWeight: 'bold'
    },
    imageAndSymbol: {
        width: '80%',
        display: 'flex',
        flexDirection: 'row',
        marginTop: 8,
        marginLeft: '5%',
        justifyContent: 'center',
    },
    imageById: {
        marginLeft: '10%',
        width: 25,
        height: 25,
        borderRadius: 12,
        marginRight: 2
    },
    eventsList: {
        height: 143
    },
    dataContainer: {
        borderRadius: 10,
        paddingBottom: 0,
        fontWeight: "bold",
        height: 170,
        backgroundColor: 'white',
        elevation: 5,
        width: '49%',
        marginBottom: '2%',
        marginRight: '1.3%',
    },
    eventsDataList: {
        paddingTop: '1%',
        height: '100%',
        width: '97%',
        marginLeft: '2%',
        paddingBottom: 150
    },
    cointainerView: {
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: "white"
    },
    headerView: {
        display: "flex",
        justifyContent: "center",
        marginTop: 25,
        height: 70,
        backgroundColor: "white",
        borderBottomWidth: 0.5,
        borderBottomColor: "grey",
    },
    header: {
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
    content: {
        height: '100%',
        width: '100%',
    },
})
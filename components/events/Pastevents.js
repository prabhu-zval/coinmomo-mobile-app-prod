import React, { useContext, useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ActivityIndicator, Linking } from 'react-native';
import { IMAGE_PATH } from '../../utils/constants';
import moment from 'moment';
import { API } from '../../services/apiService';

export default function Pastevents(props) {
    const [PastEvents, setpastEvents] = useState([])
    const [page, setPage] = useState(2)
    const [isListEnd, setIsListEnd] = useState(false)
    const [loading, setLoading] = useState(false)
    const [activityLoading, setActivityLoading] = useState(false)


    useEffect(() => {
        (async () => {
            setActivityLoading(true)
            const pasteventsparams = {
                date_to: moment().format('YYYY-MM-DD'),
                page_num: 1
            }
            const pasteventsResponse = await API.request('eventsFilter', undefined, 'POST', null, null, null, null, pasteventsparams);
            setpastEvents(pasteventsResponse)
            setActivityLoading(false)
        })()
    }, [])
    const emptyData = () => {
        return (
            <View style={style.noFiltersData}>
                {activityLoading ? null : <Text style={style.error}>No Pastevents Data Available</Text>}
            </View>
        )
    }
    const Loading = async () => {
        if (!loading && !isListEnd) {
            setLoading(true);
            const pasteventsparams = {
                date_to: moment().format('YYYY-MM-DD'),
                page_num: page
            }
            const pasteventsResponse = await API.request('eventsFilter', undefined, 'POST', null, null, null, null, pasteventsparams);
            if (pasteventsResponse.length > 0) {
                setPage(page + 1);
                setpastEvents(PastEvents.concat(pasteventsResponse));
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
                    <ActivityIndicator color="black" style={{ margin: 15 }} />
                ) : null}
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
            <View style={style.highlights}>
                <Text style={style.highlightsText}>Past Events</Text>
            </View>
            <View style={style.eventsDataList}>
                {activityLoading ? <View style={style.indicator}><ActivityIndicator color="blue" size={30} /></View> : null}
                <FlatList
                    data={PastEvents.length > 0 && PastEvents}
                    numColumns={2}
                    ListEmptyComponent={emptyData}
                    ListFooterComponent={renderFooter}
                    onEndReached={Loading}
                    onEndReachedThreshold={0.5}
                    keyExtractor={(item, index) => index.toString()}
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
                                    <TouchableOpacity style={style.source} onPress={() => { Linking.openURL(`${item.original_source}`) }} underlayColor='lightblue'><Text style={style.sourceText} >Read more</Text></TouchableOpacity>
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
    );
}
const style = StyleSheet.create({
    indicator: {
        marginTop: '15%',
        marginBottom: '5%',
        alignSelf: 'center'
    },
    highlightsText: {
        fontWeight: "bold",
        fontSize: 18,
        alignSelf: "center",
        color: "white",
    },
    highlights: {
        display: "flex",
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
    sourceText: {
        marginTop: '1%',
        color: 'white',
        textAlign: 'center',
        fontSize: 12.5,
        fontWeight: 'bold'
    },
    viewsAndVotesRow: {
        flexDirection: 'row'
    },
    viewsAndVotesValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'green'
    },
    hightlightsText: {
        fontSize: 20,
        color: '#3F51B5',
        fontWeight: 'bold',
        zIndex: -1,
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    headingIcon: {
        width: 40,
        paddingLeft: 10
    },
    headingIconAndText: {
        marginTop: 25,
        height: 60,
        paddingTop: 20,
        display: 'flex',
        borderBottomWidth: 0.5,
        borderBottomColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white'
    },
    eventDate: {
        fontSize: 11,
        fontWeight: 'bold',
        color: 'green',
        marginTop: 4,
        textAlign: 'center'
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
    eventCreatedDate: {
        height: 24,
        fontWeight: 'bold',
        padding: 4,
        textAlign: 'center',
        width: '100%',
        fontSize: 12,
        alignSelf: 'center',
        color: 'white',
        borderBottomStartRadius: 2,
        borderBottomEndRadius: 2,
        backgroundColor: '#3F51B5',
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
        width: 25,
        height: 25,
        borderRadius: 12,
        marginRight: 2,
        marginLeft: '10%'
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
    eventsList: {
        height: 145
    },
    dataContainer: {
        borderRadius: 5,
        paddingBottom: 0,
        fontWeight: "bold",
        height: 170,
        backgroundColor: 'white',
        elevation: 5,
        borderColor: 'black',
        borderWidth: 0.6,
        width: '49%',
        marginBottom: '2%',
        marginRight: '1.3%',
    },
    eventsDataList: {
        paddingTop: '3%',
        height: '100%',
        width: '97%',
        marginLeft: '2%',
        backgroundColor: 'white',
        paddingBottom: 140
    },
    noFiltersData: {
        flex: 1,
        height: 700,
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, FlatList, Linking } from 'react-native';
import { API } from '../../../services/apiService';
import { IMAGE_PATH } from '../../../utils/constants';
import moment from 'moment';

export default function CoinEvents(props) {
    const [coinEvents, setCoinEvents] = useState([])
    useEffect(() => {
        (async () => {
            let params = {
                'coin_id': props.propName.props.route.params.id,
                'page_size': 100
            };
            const coinEventResult = await API.request('coinEvents', undefined, 'POST', null, null, null, null, params)
            setCoinEvents(coinEventResult)
        })()
    }, [])

    if (coinEvents.length > 0) {
        return (
            <View style={style.eventsContainer}>
                <View style={style.eventsDataList}>
                    <FlatList
                        data={coinEvents.length > 0 && coinEvents}
                        numColumns={2}
                        renderItem={({ item, index }) => {
                            return (
                                <View key={index} style={style.dataContainer}>
                                    <View style={style.eventsList}>
                                        <View style={style.imageAndSymbol}>
                                            <Image style={style.imageById} source={{ uri: IMAGE_PATH.imageurl + `${item.coins[0].id}_normal.png` }} />
                                            <Text style={style.titleText}>{item.coins[0].name} ({item.coins[0].symbol})</Text>
                                        </View>
                                        <Text style={style.eventDate}>{moment(`${item.date_event}`).format('DD MMMM YYYY')}</Text>
                                        <Text numberOfLines={2} style={style.descriptionText}>{item.description.en}</Text>
                                        <TouchableOpacity onPress={() => { Linking.openURL(`${item.original_source}`) }}><Text style={style.source}>Read more</Text></TouchableOpacity>
                                        <View style={style.viewsAndVotes}>
                                            <View style={style.viewsAndVotesRow}>
                                                <Text style={style.votes}>Votes: </Text>
                                                <Text style={style.values}>{item.vote_count}</Text>
                                            </View>
                                            <View style={style.viewsAndVotesRow}>
                                                <Text style={style.views}>Views: </Text>
                                                <Text style={style.values}>{item.view_count}</Text>
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
        )
    } else {
        return (
            <Text style={style.noCoinData}>There are no events for this coin currently!</Text>)
    }
}
const style = StyleSheet.create({
    viewsAndVotesRow: {
        flexDirection: 'row'
    },
    values: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'green'
    },
    noCoinData: {
        marginTop: '50%',
        textAlign: 'center',
        fontSize: 18
    },
    eventsContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: '1%',
        marginBottom: 10,
        marginTop: 10,
    },
    eventsList: {
        height: 145
    },
    imageAndSymbol: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
    },
    eventsDataList: {
        marginTop: '2%',
        width: '97%',
        marginLeft: '2%',
    },
    dataContainer: {
        borderRadius: 10,
        paddingBottom: 0,
        height: 180,
        backgroundColor: 'white',
        elevation: 5,
        borderColor: 'grey',
        width: '49%',
        marginBottom: '1.5%',
        marginRight: '1%'
    },
    imageById: {
        width: 25,
        height: 25,
        borderRadius: 12,
        marginRight: 2
    },
    titleText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 2,
        marginTop: 4
    },
    descriptionText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#525252',
        paddingLeft: 10,
        marginTop: 7,
        paddingRight: 10
    },
    source: {
        height: 22,
        width: '45%',
        borderRadius: 50,
        textAlign: 'center',
        backgroundColor: '#3F51B5',
        marginTop: 10,
        color: 'white',
        paddingTop: 2,
        paddingBottom: 5,
        fontSize: 12.3,
        fontWeight: 'bold',
        alignSelf: 'center'
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
        marginTop: 8,
        paddingLeft: 10,
        paddingRight: 10
    },
    eventCreatedDate: {
        height: 26,
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: '#3F51B5',
        paddingTop: 4,
        marginTop: 8,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    }
})
import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, TouchableHighlight } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LoginContext } from '../../context/context';
import { IMAGE_PATH } from '../../utils/constants';
import moment from 'moment';

export default function PopularIndexes(props) {
    const { highlights } = useContext(LoginContext)
    const totalHotIndex = highlights[0].hot.map((val, index) => {
        return (
            <View key={index} style={style.highlightsData}>
                <View style={style.iconAndCoinName}>
                    <Image style={style.image} source={{ uri: IMAGE_PATH.imageurl + `${val.coins[0].id}_normal.png` }} />
                    <Text style={style.coinName}>{val.coins[0].name} ({val.coins[0].symbol})</Text>
                </View>
                <View style={style.eventNameAndDate}>
                    <Text style={style.eventDate}>{moment(val.date_event).format('DD MMMM YYYY')}</Text>
                    <Text style={style.eventname}>{val.title.en}</Text>
                </View>
                <View style={style.viewsAndVotes}>
                    <View>
                        <Text style={style.votes}>+{val.vote_count}</Text>
                        <Text style={style.title}>Votes (24Hours)</Text>
                    </View>
                    <View>
                        <Text style={style.views}>+{val.view_count}</Text>
                        <Text style={style.title}>Views (24Hours)</Text>
                    </View>
                </View>
                <TouchableHighlight onPress={() => Linking.openURL(`${val.original_source}`)} style={style.source} underlayColor='lightblue' >
                    <Text style={style.sourceText}>Read more</Text>
                </TouchableHighlight>
            </View>
        )

    })
    const totalSignificantIndex = highlights[0].significant.map((val, index) => {
        return (
            <View key={index} style={style.highlightsData}>
                <View style={style.iconAndCoinName}>
                    <Image style={style.image} source={{ uri: IMAGE_PATH.imageurl + `${val.coins[0].id}_normal.png` }} />
                    <Text style={style.coinName}>{val.coins[0].name} ({val.coins[0].symbol})</Text>
                </View>
                <View style={style.eventNameAndDate}>
                    <Text style={style.eventDate}>{moment(val.date_event).format('DD MMMM YYYY')}</Text>
                    <Text style={style.eventname}>{val.title.en}</Text>
                </View>
                <View style={style.viewsAndVotes}>
                    <View>
                        <Text style={style.votes}>+{val.vote_count}</Text>
                        <Text style={style.title}>Votes (24Hours)</Text>
                    </View>
                    <View>
                        <Text style={style.views}>+{val.view_count}</Text>
                        <Text style={style.title}>Views (24Hours)</Text>
                    </View>
                </View>
                <TouchableHighlight onPress={() => Linking.openURL(`${val.original_source}`)} style={style.source} underlayColor='lightblue' >
                    <Text style={style.sourceText}>Read more</Text>
                </TouchableHighlight>
            </View>
        )

    })
    const totalTrendingIndex = highlights[0].trending.map((val, index) => {
        return (
            <View key={index} style={style.highlightsData}>
                <View style={style.iconAndCoinName}>
                    <Image style={style.image} source={{ uri: IMAGE_PATH.imageurl + `${val.coins[0].id}_normal.png` }} />
                    <Text style={style.coinName}>{val.coins[0].name} ({val.coins[0].symbol})</Text>
                </View>
                <View style={style.eventNameAndDate}>
                    <Text style={style.eventDate}>{moment(val.date_event).format('DD MMMM YYYY')}</Text>
                    <Text style={style.eventname}>{val.title.en}</Text>
                </View>
                <View style={style.viewsAndVotes}>
                    <View>
                        <Text style={style.votes}>+{val.vote_count}</Text>
                        <Text style={style.title}>Votes (24Hours)</Text>
                    </View>
                    <View>
                        <Text style={style.views}>+{val.view_count}</Text>
                        <Text style={style.title}>Views (24Hours)</Text>
                    </View>
                </View>
                <TouchableHighlight onPress={() => Linking.openURL(`${val.original_source}`)} style={style.source} underlayColor='lightblue' >
                    <Text style={style.sourceText}>Read more</Text>
                </TouchableHighlight>
            </View>
        )

    })
    if (props.route.params.name === 'hot') {
        return (
            <View style={style.portfolios}>
                <View style={style.threadIconAndText}>
                    <View style={style.threadView}>
                        <Image style={style.coimmomoLogo} source={IMAGE_PATH.logo} />
                    </View>
                </View>
                <View style={style.hotIndexIconAndText}>
                    <FontAwesome5 name="hotjar" size={24} color="white" />
                    <Text style={style.hotIndexText}>HOT INDEX</Text>
                </View>
                <ScrollView >
                    <View style={style.hotIndexDataContainer}>
                        {totalHotIndex}
                    </View>
                </ScrollView >
            </View >
        )
    } else if (props.route.params.name === 'significant') {
        return (
            <View style={style.portfolios}>
                <View style={style.threadIconAndText}>
                    <View style={style.threadView}>
                        <Image style={style.coimmomoLogo} source={IMAGE_PATH.logo} />
                    </View>
                </View>
                <View style={style.significantIndexIconAndText}>
                    <MaterialIcons name="trending-up" size={24} color="white" />
                    <Text style={style.significantIndexText}>SIGNIFICANT INDEX</Text>
                </View>
                <ScrollView >
                    <View style={style.significantIndexDataContainer}>
                        {totalSignificantIndex}
                    </View>
                </ScrollView >
            </View >
        )
    } else if (props.route.params.name === 'trending') {
        return (
            <View style={style.portfolios}>
                <View style={style.threadIconAndText}>
                    <View style={style.threadView}>
                        <Image style={style.coimmomoLogo} source={IMAGE_PATH.logo} />
                    </View>
                </View>
                <View style={style.trendingIndexIconAndText}>
                    <FontAwesome5 name="crown" size={24} color="white" />
                    <Text style={style.trendingIndexText}>TRENDING INDEX</Text>
                </View>
                <ScrollView >
                    <View style={style.trendingIndexDataContainer}>
                        {totalTrendingIndex}
                    </View>
                </ScrollView >
            </View >
        )
    }
}
const style = StyleSheet.create({
    highlightsText: {
        fontWeight: "bold",
        fontSize: 18,
        alignSelf: 'center',
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
    title: {
        color: '#8c8c8c',
        fontWeight: 'bold'
    },
    votes: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: '#645cb5'
    },
    views: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: '#645cb5'
    },
    eventname: {
        marginTop: '1%',
        fontWeight: 'bold',
        color: '#525252'
    },
    highlightsDataContainer: {
        marginTop: '1%',
        width: "98%",
        height: 240,
        backgroundColor: 'lightblue',
        borderWidth: 0.5,
        marginLeft: '1%',
        marginBottom: '2%',
        elevation: 7
    },
    highlightsContainer: {
        marginTop: 5,
        height: '100%',
        paddingBottom: 90,
        backgroundColor: 'white'
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
    highlightsData: {
        height: 180,
        marginLeft: '2%',
        marginRight: '2%',
        backgroundColor: 'white',
        borderRadius: 20,
        marginBottom: 10,
    },
    significantText: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        color: 'black',
        height: 30,
        paddingRight: 100,
        marginRight: 85,
        paddingTop: 3,
        marginLeft: 2
    },
    HotText: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        color: 'black',
        height: 30,
        paddingRight: 100,
        marginRight: 85,
        marginLeft: 10,
        paddingTop: 3
    },
    viewAllText: {
        height: 30,
        width: '100%',
        borderRadius: 2,
        color: 'black',
        padding: 2,
        fontSize: 16,
        alignSelf: 'center',
        fontWeight: 'bold',
        marginRight: 95
    },
    trendingText: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        color: 'black',
        height: 30,
        paddingRight: 100,
        marginRight: 85,
        marginLeft: 10,
        paddingTop: 3
    },
    hotTextAndIcon: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#ffffbf',
        paddingLeft: 15,
        paddingTop: 5,
        height: 38,
        marginBottom: 10
    },
    significantIndexTextAndIcon: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#ffffbf',
        paddingLeft: 15,
        paddingTop: 5,
        height: 38,
        marginBottom: 10
    },
    trendingTextAndIcon: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#ffffbf',
        paddingLeft: 15,
        marginBottom: 10,
        paddingTop: 5,
        height: 38
    },
    iconAndCoinName: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: '2.3%'
    },
    image: {
        height: 25,
        width: 25
    },
    coinName: {
        marginLeft: 3,
        fontSize: 17,
        fontWeight: 'bold'
    },
    eventName: {
        textAlign: 'center',
    },
    eventNameAndDate: {
        marginTop: '1%',
        alignItems: 'center'
    },
    viewsAndVotes: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: '5%',
        marginRight: '5%',
        marginTop: '1.3%'
    },
    eventDate: {
        color: 'green'
    },
    source: {
        height: 30,
        width: '45%',
        borderRadius: 50,
        backgroundColor: '#3F51B5',
        marginTop: '2.5%',
        paddingTop: 2.5,
        paddingBottom: 5,
        fontSize: 13,
        alignSelf: 'center'
    },
    sourceText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
    },
    hotIndexIconAndText: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 15,
        backgroundColor: "#ff0101",
    },
    significantIndexIconAndText: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 15,
        backgroundColor: "#ff9725",
    },
    trendingIndexIconAndText: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 15,
        backgroundColor: "#09a731",
    },
    hotIndexText: {
        fontWeight: "bold",
        fontSize: 18,
        alignSelf: 'center',
        color: "white",
        paddingLeft: '3%'
    },
    significantIndexText: {
        fontWeight: "bold",
        fontSize: 18,
        alignSelf: 'center',
        color: "white",
        paddingLeft: '3%'
    },
    trendingIndexText: {
        fontWeight: "bold",
        fontSize: 18,
        alignSelf: 'center',
        color: "white",
        paddingLeft: '3%'
    },
    hotIndexDataContainer: {
        height: '100%',
        paddingBottom: 90,
        backgroundColor: '#CAD5E2',
        paddingTop: 10
    },
    significantIndexDataContainer: {
        height: '100%',
        paddingBottom: 90,
        backgroundColor: '#CAD5E2',
        paddingTop: 10
    },
    trendingIndexDataContainer: {
        height: '100%',
        paddingBottom: 90,
        backgroundColor: '#CAD5E2',
        paddingTop: 10
    },
})
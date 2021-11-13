import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, TouchableHighlight } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LoginContext } from '../../context/context';
import { IMAGE_PATH } from '../../utils/constants';
import moment from 'moment';

export default function Highlights(props) {
    const { highlights } = useContext(LoginContext)
    const totalHotIndex = highlights[0].hot.map((val, index) => {
        if (index < 1) {
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
        }

    })
    const totalSignificantIndex = highlights[0].significant.map((val, index) => {
        if (index < 1) {
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
        }

    })
    const totalTrendingIndex = highlights[0].trending.map((val, index) => {
        if (index < 1) {
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
        }

    })
    return (
        <View style={style.portfolios}>
            <View style={style.threadIconAndText}>
                <View style={style.threadView}>
                    <Image style={style.coimmomoLogo} source={IMAGE_PATH.logo} />
                </View>
            </View>
            <View style={style.highlights}>
                <Text style={style.highlightsText}>HIGHLIGHTS</Text>
            </View>
            <View style={style.highlightsContainer}>
                <View>
                    <View style={style.trendingTextAndIcon}>
                        <FontAwesome5 style={style.indexIcon} name="crown" size={20} color="white" />
                        <Text style={style.trendingText}>Trending Index</Text>
                        <TouchableOpacity onPress={() => props.navigation.navigate('highlightsViewAll', { name: 'trending' })}>
                            <Text style={style.trendingIndexViewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    {totalTrendingIndex}
                </View>
                <View>
                    <View style={style.significantTextAndIcon}>
                        <MaterialIcons style={style.indexIcon} name="trending-up" size={25} color="white" />
                        <Text style={style.significantText}>Significant Index</Text>
                        <TouchableOpacity onPress={() => props.navigation.navigate('highlightsViewAll', { name: 'significant' })}>
                            <Text style={style.significantIndexViewAllText} >View All</Text>
                        </TouchableOpacity>
                    </View>
                    {totalSignificantIndex}
                </View>
                <View>
                    <View style={style.hotTextAndIcon}>
                        <FontAwesome5 style={style.indexIcon} name="hotjar" size={20} color="white" />
                        <Text style={style.HotText}>Hot Index</Text>
                        <TouchableOpacity onPress={() => props.navigation.navigate('highlightsViewAll', { name: 'hot' })}>
                            <Text style={style.hotIndexViewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    {totalHotIndex}
                </View>
            </View>
        </View >
    )
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
        paddingVertical: 10,
        backgroundColor: "#F75626",
    },
    portfolios: {
        height: "100%",
        width: "100%",
    },
    indexIcon: {
        marginVertical: '2%'
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
        fontWeight: 'bold',
        color: '#525252'
    },
    highlightsDataContainer: {
        width: "100%",
        height: '29.8%',
        backgroundColor: 'lightblue',
    },
    highlightsContainer: {
        height: '100%',
        backgroundColor: '#CAD5E2',
        padding: 2,
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
        height: 175,
        marginLeft: '1%',
        marginRight: '1%',
        backgroundColor: 'white',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        padding: '1%',
    },
    significantText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white',
        height: 30,
        marginRight: '25%',
        marginLeft: '3%',
        marginTop: 8
    },
    HotText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white',
        height: 30,
        marginRight: '25%',
        marginLeft: '5%',
        marginTop: 8
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
        color: 'white',
        height: 30,
        marginRight: '25%',
        marginLeft: '3%',
        marginTop: 8
    },
    hotTextAndIcon: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#ff0101',
        paddingLeft: '5%',
        height: 35,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginRight: '1%',
        marginLeft: '1%',
        marginTop: '1%'
    },
    significantTextAndIcon: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#ff9725',
        paddingLeft: '5%',
        height: 35,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginRight: '1%',
        marginLeft: '1%',
        marginTop: '1%'
    },
    trendingTextAndIcon: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#09a731',
        paddingLeft: '5%',
        height: 35,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginRight: '1%',
        marginLeft: '1%',
        marginTop: '1%'
    },
    iconAndCoinName: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8
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
        marginTop: 3,
        alignItems: 'center'
    },
    viewsAndVotes: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: '5%',
        marginRight: '5%',
        marginTop: 5
    },
    eventDate: {
        color: 'green'
    },
    source: {
        height: 30,
        width: '45%',
        borderRadius: 50,
        backgroundColor: '#3F51B5',
        marginTop: 10,
        fontSize: 13,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    viewAll: {
        height: 30,
        width: '100%',
        borderRadius: 2,
        color: 'white',
        backgroundColor: '#3F51B5',
        padding: 2,
        marginRight: 4,
        fontSize: 13,
        alignSelf: 'center',

    },
    sourceText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
    },
    hotIndexViewAllText: {
        marginTop: 3,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        height: 30,
        marginTop: 8,
        marginLeft: '35%'
    },
    significantIndexViewAllText: {
        marginTop: 3,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        height: 30,
        marginTop: 8,
        marginLeft: '12%'
    },
    trendingIndexViewAllText: {
        marginTop: 3,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        height: 30,
        marginTop: 8,
        marginLeft: '15%'
    }
})
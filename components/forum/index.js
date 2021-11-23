import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, TextInput, Text, Image, TouchableOpacity, Pressable, TouchableHighlight, Dimensions, FlatList, ActivityIndicator, ScrollView, LogBox, Keyboard } from "react-native";
import { IMAGE_PATH } from '../../utils/constants';
import { AntDesign, EvilIcons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { RFPercentage } from "react-native-responsive-fontsize";
import { LoginContext } from "../../context/context";
import { API } from '../../services/apiService';
import { TouchableWithoutFeedback } from "react-native";
import Footer from '../Footer/footer';

const fontSize = Dimensions.get('window').width <= 320 ? 2.4 : 2
export default function Forum(props) {
    const [allTextColor, setAllTextColor] = useState('white')
    const [mostVotedColor, setMostVotedColor] = useState('#3F51B5')
    const [mostViewedColor, setMostViewedColor] = useState('#3F51B5')
    const [allTextBgColor, setAllTextBgColor] = useState('#F75626')
    const [mostVotedBgColor, setMostVotedBgColor] = useState('white')
    const [mostViewedBgColor, setMostViewedBgColor] = useState('white')
    const [allBorderWitdh, setAllBorderWidth] = useState(0)
    const [mostViewedBorderWidth, setMostViewedBorderWidth] = useState(1)
    const [mostVotedBorderWidth, setmostVotedBorderWidth] = useState(1)
    const [tab, setTab] = useState('')
    const [threadsData, setThreadsData] = useState([]);
    const [isListEnd, setIsListEnd] = useState(false)
    const [loading, setLoading] = useState(false)
    const [pageSort, setSortPage] = useState(2)
    const [loadingForum, setLoadingForum] = useState(false)
    const [noForumData, setNoForumData] = useState(false)
    const [title, setTitle] = useState('')
    const [titleData, setTitleData] = useState([])
    const [titleDataObj, setTitleDataObj] = useState([])
    const [titleLoading, setTitleLoading] = useState(false)
    const [noTitleData, setNoTitleData] = useState(false)
    const { sortTitle, sortCategory, sortCommunity, sortTags, pageLoading, sortDate, setSortTags, setSortCommunity, setSortCategory, setSortTitle, setSortDate, userSigninId, setPageLoading, setDrawerBgColor } = useContext(LoginContext)

    let getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        (async () => {
            setLoadingForum(true)
            let titleObj = await API.request('fetchTitle', undefined, 'GET', null, null, null, null)
            setTitleDataObj(titleObj)
            setThreadsData([])
            allText()
            LogBox.ignoreLogs(["You should always pass contentWidth prop to properly handle screen rotations and have a seamless support for images scaling. In the meantime, HTML will fallback to Dimensions.window().width, but its layout will become inconsistent after screen rotations. You are encouraged to use useWindowDimensions hook, see: https://reactnative.dev/docs/usewindowdimensions"])
        })()
    }, [sortTitle, sortCategory, sortCommunity, sortTags, pageLoading])
    const onChangeTitle = (titleName) => {
        setTitle(titleName)
        if (titleName) {
            setTitleLoading(true)
            let titleObj = titleDataObj.filter((val) => {
                if (val.title.toLowerCase().indexOf(titleName.toLowerCase()) != -1 && titleName != '') {
                    return 1
                }
                else {
                    return false
                }
            })
            setTitleData(titleObj)
            setTitleLoading(false)
            if (titleObj.length <= 0) {
                setTitleLoading(false)
                setNoTitleData(true)
                setTitleData([])
            }
        }
        else {
            setTitleData([])
            setNoTitleData(false)
        }
    }
    const onBlurTitle = () => {
        setTitleData([])
        Keyboard.dismiss()
        setNoTitleData(false)
        setTitle(null)
    }
    const allText = async () => {
        setThreadsData([])
        setLoadingForum(true)
        setAllTextColor('white')
        setMostVotedColor('#3F51B5')
        setMostViewedColor('#3F51B5')
        setAllTextBgColor('#F75626')
        setMostVotedBgColor('white')
        setMostViewedBgColor('white')
        setAllBorderWidth(0)
        setMostViewedBorderWidth(1)
        setmostVotedBorderWidth(1)
        setTab('')
        setIsListEnd(false)
        setLoading(false)
        let params = {}
        sortTitle ? params["title"] = sortTitle : delete params["title"]
        sortCategory ? params["category"] = sortCategory : delete params["category"]
        sortCommunity ? params["community"] = sortCommunity : delete params["community"]
        sortTags.length > 0 ? params["tags"] = sortTags : delete params["tags"]
        sortDate ? params["trending"] = sortDate : delete params["trending"]
        params["page_num"] = 1
        setSortPage(2)
        const data = await API.request('thread', undefined, 'POST', null, null, null, null, null, params);
        data.length > 0 ? setNoForumData(false) : setNoForumData(true)
        setThreadsData(data)
        setTab('')
        setIsListEnd(false)
        setLoading(false)
        setLoadingForum(false)
    }
    const mostVoted = async () => {
        setThreadsData([])
        setLoadingForum(true)
        setAllTextColor('#3F51B5')
        setMostVotedColor('white')
        setMostViewedColor('#3F51B5')
        setAllTextBgColor('white')
        setMostVotedBgColor('#F75626')
        setMostViewedBgColor('white')
        setAllBorderWidth(1)
        setMostViewedBorderWidth(1)
        setmostVotedBorderWidth(0)
        setTab('likes')
        setIsListEnd(false)
        setLoading(false)
        setSortPage(2)
        let params = {}
        sortTitle ? params["title"] = sortTitle : delete params["title"]
        sortCategory ? params["category"] = sortCategory : delete params["category"]
        sortCommunity ? params["community"] = sortCommunity : delete params["community"]
        sortTags.length > 0 ? params["tags"] = sortTags : delete params["tags"]
        sortDate ? params["trending"] = sortDate : delete params["trending"]
        params["page_num"] = 1
        params["sort_by"] = 'likes'
        const data = await API.request('threadSortby', undefined, 'POST', null, null, null, null, null, params);
        setThreadsData(data)
        setLoadingForum(false)
    }
    const mostViewed = async () => {
        setThreadsData([])
        setLoadingForum(true)
        setAllTextColor('#3F51B5')
        setMostVotedColor('#3F51B5')
        setMostViewedColor('white')
        setAllTextBgColor('white')
        setMostVotedBgColor('white')
        setMostViewedBgColor('#F75626')
        setAllBorderWidth(1)
        setMostViewedBorderWidth(0)
        setmostVotedBorderWidth(1)
        setTab('visited')
        setIsListEnd(false)
        setLoading(false)
        setSortPage(2)
        let params = {}
        sortTitle ? params["title"] = sortTitle : delete params["title"]
        sortCategory ? params["category"] = sortCategory : delete params["category"]
        sortCommunity ? params["community"] = sortCommunity : delete params["community"]
        sortTags.length > 0 ? params["tags"] = sortTags : delete params["tags"]
        sortDate ? params["trending"] = sortDate : delete params["trending"]
        params["page_num"] = 1
        params["sort_by"] = 'visited'
        const data = await API.request('threadSortby', undefined, 'POST', null, null, null, null, null, params);
        setThreadsData(data)
        setLoadingForum(false)
    }
    const Loading = async () => {
        if (!loading && !isListEnd) {
            let params = {}
            if (!tab) {
                sortTitle ? params["title"] = sortTitle : delete params["title"]
                sortCategory ? params["category"] = sortCategory : delete params["category"]
                sortCommunity ? params["community"] = sortCommunity : delete params["community"]
                sortTags.length > 0 ? params["tags"] = sortTags : delete params["tags"]
                sortDate ? params["trending"] = sortDate : delete params["trending"]
                params["page_num"] = pageSort
            }
            else {
                sortTitle ? params["title"] = sortTitle : delete params["title"]
                sortCategory ? params["category"] = sortCategory : delete params["category"]
                sortCommunity ? params["community"] = sortCommunity : delete params["community"]
                sortTags.length > 0 ? params["tags"] = sortTags : delete params["tags"]
                sortDate ? params["trending"] = sortDate : delete params["trending"]
                params["page_num"] = pageSort
                params["sort_by"] = tab
            }
            setLoading(true)
            const sort = await API.request(!tab ? 'thread' : 'threadSortby', undefined, 'POST', null, null, null, null, null, params)
            if (sort.length > 0) {
                setSortPage(pageSort + 1);
                setThreadsData(threadsData.concat(sort));
                setLoading(false);
            } else {
                setIsListEnd(true);
                setLoading(false);
            }
        }
    }
    const newThreadPage = () => {
        props.navigation.navigate(userSigninId ? 'forumCreate' : 'portfolio', { forum: 'forumCreate' })
    }
    const advanceSearchPage = () => {
        props.navigation.navigate('forumSearch')
    }
    const onSelectTitle = (searchTitle) => {
        setTitle(searchTitle);
        setTitleData([]);
        let selectData = threadsData.filter((val) => val.title == searchTitle)
        selectData = Object.assign({}, selectData)
        props.navigation.navigate('forumConversation', { conversationDetails: selectData["0"] })
        setTitle(null)
        setNoTitleData(false)
    }
    const ForumConversation = async (_id, item) => {
        if (userSigninId) {
            let params = {
                thread_id: _id,
                user_id: userSigninId
            }
            await API.request("visited", undefined, 'POST', null, null, null, null, null, params)
        }
        props.navigation.navigate('forumConversation', { conversationDetails: item })
        setPageLoading(!pageLoading)
        setNoTitleData(false)
    }

    const renderFooter = () => {
        return (
            <View style={style.footer}>
                {loading ?
                    <ActivityIndicator color="black" style={style.activityIndicator} /> : null
                }
            </View>
        );
    };
    const Tab = () => {
        let threadsDataJsx = ({ item, index }) => {
            let date2 = new Date();
            var date1 = new Date(item.current_date_time)
            var delta = Math.abs(date1 - date2) / 1000;
            // calculate (and subtract) whole days
            var days = Math.floor(delta / 86400);
            delta -= days * 86400;
            // calculate (and subtract) whole hours
            var hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;
            // calculate whole minutes
            let minutes = Math.floor(delta / 60) % 60;
            return (
                <TouchableWithoutFeedback onPress={() => ForumConversation(item._id, item)}>
                    <View style={[style.threadEnd, { backgroundColor: index % 2 == 0 ? '#eff2f5' : 'white' }]}>
                        <View style={style.threads}>
                            <View style={style.titleAndTags}>
                                <Text style={style.titleText}>{item.title}</Text>
                                <View style={style.TagsView}>
                                    {item.tags && item.tags.map((tagName, index) => {
                                        return (<Text key={index} style={[style.tags, { backgroundColor: getRandomColor() }]}>{tagName}</Text>)
                                    })}
                                </View>
                            </View>
                            <View style={style.timeAndCategory}>
                                {days > 0 ? <Text style={style.time}>{days} day(s) ago</Text> : hours > 0 ? <Text style={style.time}>{hours} hour(s) ago</Text> : <Text style={style.time}>{minutes} minute(s) ago</Text>}
                                {item.category ? <Text style={style.category}>{item.category}</Text> : null}
                                {tab == 'visited' ? <View style={style.views}>
                                    <Entypo style={style.viewIcon} name="eye" size={20} color="#3F51B5" /><Text style={style.viewText} >{item.visited && item.visited.length}</Text></View> : null}
                                {tab == 'likes' ? <View style={style.votes}>
                                    <Text style={style.votesText} >Liked {item.likes && item.likes.length}</Text></View> : null}
                            </View>
                        </View>
                        <TouchableWithoutFeedback onPress={() => props.navigation.navigate('forumUser', { userData: item.user_data, likes: item.likes && item.likes.length })}>
                            <View style={style.userView}>
                                {!item.user_data.image ? <Text style={style.user}>{item.user_data.name.charAt(0)}</Text> : <Image style={style.userImage} source={{ uri: item.user_data.image }} />}
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={style.repliesView}>
                            <Text style={style.replies}>{item.replies_arr && item.replies_arr.length}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        };
        if (threadsData) {
            return (
                <View>
                    <View style={style.Heading}>
                        <Text style={style.threadsHeading}>Threads</Text>
                        <Text style={style.userHeading}>User</Text>
                        <Text style={style.repliesHeading}>Replies</Text>
                    </View>
                    {loadingForum ? <View style={style.indexLoading}><ActivityIndicator size={35} color={'blue'} /></View> : null}
                    {noForumData ? <Text style={style.noDataContainer}>No Data Available</Text> : null}
                    <View style={{ paddingBottom: 360 }}>
                        <FlatList
                            data={threadsData && threadsData}
                            onEndReached={() => Loading()}
                            ListFooterComponent={renderFooter}
                            onEndReachedThreshold={0.5}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={threadsDataJsx}
                        />
                    </View>
                </View>
            )
        }
    }
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={style.moreComponent}>
                <View style={style.logoAndBackButton}>
                    <TouchableOpacity style={style.menu} onPress={() => { setDrawerBgColor("forum"); props.navigation.openDrawer() }}>
                        <Entypo name="menu" size={30} color="black" />
                    </TouchableOpacity>
                    <View style={style.threadView}><Image style={style.coinMomoLogo} source={IMAGE_PATH.logo} /></View>
                    <TouchableOpacity onPress={() => newThreadPage()}>
                        <View style={style.threadViewIcon}>
                            <MaterialIcons style={style.threadIcon} name="post-add" size={27} color="#3F51B5" />
                            <Text style={style.newThreadText}>New Thread</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={style.searchComponent}>
                    <View style={style.titleAndTextInput}>
                        <View style={style.searchHeader}>
                            <TextInput maxLength={150} onBlur={() => { onBlurTitle() }} value={title} style={style.searchText} placeholder="Search Title..." onChangeText={(text) => { onChangeTitle(text) }} onFocus={() => { setTitle(null); onChangeTitle() }} autoCorrect={false}></TextInput>
                            <TouchableHighlight>
                                <EvilIcons style={style.searchIcon} name="search" size={25} color="#F75626" />
                            </TouchableHighlight>
                        </View>

                        {titleLoading ? <View style={style.loadingView}><Text>loading...<Text></Text></Text><ActivityIndicator size={25} color='blue' /></View> : null}
                        {noTitleData ? <View style={style.noDataView}><Text style={style.noDataText} >No results available . . .</Text></View> : null}
                        {titleData.length > 0 ? <View style={style.titleSuggestionContainer}>
                            <ScrollView keyboardShouldPersistTaps={'handled'} >
                                {titleData.length > 0 && titleData.map((val, index) => {
                                    return (
                                        <View key={index} >
                                            <TouchableHighlight underlayColor='blue' autoCorrect={false} onPress={() => { onSelectTitle(val.title) }}>
                                                <Text style={[style.titleSuggestionsText, { backgroundColor: index % 2 == 0 ? '#e6e6e6' : 'white' }]}>{val.title}</Text>
                                            </TouchableHighlight>
                                        </View>
                                    )
                                })}
                            </ScrollView>
                        </View> : null}
                    </View>
                    <View style={style.advanceSearchView}>
                        <TouchableOpacity activeOpacity={.9} style={style.advanceSearch} onPress={() => advanceSearchPage()}>
                            <Text style={style.advanceSearchText}>Advance Search</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={style.filtersText}>
                        <Text onPress={() => allText()} style={[style.allText, { borderBottomWidth: allBorderWitdh, backgroundColor: allTextBgColor, color: allTextColor, fontSize: RFPercentage(fontSize) }]}>All</Text>
                        <Text onPress={() => mostVoted()} style={[style.mostVotedText, { borderBottomWidth: mostVotedBorderWidth, backgroundColor: mostVotedBgColor, color: mostVotedColor, fontSize: RFPercentage(fontSize) }]}>Most Liked</Text>
                        <Text onPress={() => mostViewed()} style={[style.mostViewedText, { borderBottomWidth: mostViewedBorderWidth, backgroundColor: mostViewedBgColor, color: mostViewedColor, fontSize: RFPercentage(fontSize) }]}>Most Viewed</Text>
                    </View>
                </View>
                {Tab()}
                <Footer props={props} />
            </View >
        </TouchableWithoutFeedback>
    );
}
const style = StyleSheet.create({
    menu: {
        marginLeft: '5%',
        marginTop: '3%'
    },
    titleText: {
        fontWeight: 'bold'
    },
    indexLoading: {
        position: "absolute",
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.5,
        height: "100%",
        width: "100%",
    },
    noDataContainer: {
        textAlign: 'center',
        fontSize: 20,
        marginTop: '40%'
    },
    titleAndTags: {
        width: '100%',
        paddingTop: 5
    },
    views: {
        flexDirection: 'row',
        marginLeft: '2%'
    },
    votes: {
        flexDirection: 'row',
        marginLeft: '3%'
    },
    votesText: {
        marginLeft: '10%',
        paddingTop: '2%',
        fontWeight: 'bold',
        fontSize: 14,
        color: '#3F51B5'
    },
    viewIcon: {
        marginLeft: '2%',
        paddingTop: '2%'
    },
    viewText: {
        marginLeft: '10%',
        paddingTop: '2%',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#3F51B5'
    },
    TagsView: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        flexShrink: 1,
        flexWrap: 'wrap'
    },
    loadingView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        marginTop: 50,
        backgroundColor: 'lightgrey',
        height: 60,
        paddingTop: 10,
        borderWidth: 0.5
    },
    noDataView: {
        width: '100%',
        height: 30,
        zIndex: 1,
        backgroundColor: '#ededed',
        position: 'absolute',
        marginTop: 40,
        paddingLeft: 5,
        justifyContent: 'center',
        borderWidth: 0.5,
    },
    titleAndTextInput: {
        width: '65%',
        marginLeft: 5
    },
    titleSuggestionContainer: {
        position: 'absolute',
        width: '100%',
        height: 150,
        zIndex: 1,
        marginTop: 40,
        elevation: 20,
    },
    titleSuggestionsText: {
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 5,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: 'grey',
        elevation: 10,
        color: 'black'
    },
    mostViewedText: {
        width: '34%',
        height: 40,
        backgroundColor: 'white',
        borderColor: '#F75626',
        borderWidth: 1,
        textAlign: 'center',
        paddingTop: 8,
        fontWeight: 'bold'
    },
    mostVotedText: {
        width: '34%',
        height: 40,
        borderWidth: 1,
        borderColor: '#F75626',
        textAlign: 'center',
        paddingTop: 8,
        backgroundColor: 'white',
        color: 'black',
        fontWeight: 'bold'
    },
    allText: {
        width: '34%',
        height: 40,
        borderColor: '#F75626',
        borderWidth: 1,
        textAlign: 'center',
        paddingTop: 8,
        color: 'white',
        backgroundColor: '#F75626',
        fontWeight: 'bold'
    },
    filtersText: {
        width: '96%',
        display: 'flex',
        flexDirection: 'row',
        marginTop: '3%',
        marginLeft: '1%',
        height: 40
    },
    advanceSearchView: {
        display: 'flex',
        width: '32%',
        marginTop: -36,
        marginLeft: '67%'
    },
    advanceSearchText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        paddingTop: 7
    },
    replies: {
        color: 'black',
        textAlign: 'center',
        paddingTop: 10,
    },
    repliesView: {
        width: '10%',
        height: 40,
        alignSelf: 'center',
    },
    user: {
        color: 'white',
        textAlign: 'center',
        paddingTop: '19%',
        width: 40,
        height: 40,
        borderRadius: 50,
        borderColor: 'lightgrey',
        borderWidth: 5,
        fontSize: 17,
        fontWeight: 'bold'
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        borderColor: 'lightgrey',
        borderWidth: 5,
    },
    userView: {
        borderRadius: 50,
        backgroundColor: '#1aa3e8',
        width: 40,
        height: 40,
        display: 'flex',
        alignSelf: 'center',
        marginRight: '10%'
    },
    category: {
        marginTop: "2%",
        marginLeft: '3%',
        fontWeight: 'bold',
        backgroundColor: 'lightgrey',
        borderRadius: 6,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 5,
        paddingRight: 5,
        textAlign: 'center',
        fontSize: 12
    },
    time: {
        fontWeight: "800",
        color: 'grey',
        paddingTop: '2%'
    },
    timeAndCategory: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '2%'
    },
    tags: {
        color: 'white',
        fontWeight: 'bold',
        borderRadius: 1,
        textAlign: 'center',
        marginTop: 3,
        marginRight: 2,
        fontSize: 15,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 2,
        paddingBottom: 2
    },
    threads: {
        marginLeft: 10,
        width: '65%'
    },
    threadEnd: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: 10,
        width: '100%',
        justifyContent: 'space-around'
    },
    newThreadView: {
        height: 80
    },
    threadIcon: {
        marginRight: 15
    },
    newThreadText: {
        color: '#F75626',
        fontWeight: 'bold',
        fontSize: 13,
        marginLeft: 5,
    },
    threadViewIcon: {
        display: 'flex',
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
        width: '100%',
        marginLeft: '66%',
        marginTop: 3,
    },
    dropDown: {
        marginLeft: 10,
        marginTop: 10,
        width: '100%',
    },
    searchIcon: {
        marginTop: -22,
        display: 'flex',
        marginLeft: '90%'
    },
    Heading: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingRight: '2%'
    },
    threadsHeading: {
        height: 50,
        paddingTop: 15,
        fontSize: 15,
        color: 'grey',
        paddingLeft: '2%',
        fontWeight: 'bold',
        width: '65%'
    },
    userHeading: {
        fontSize: 15,
        display: 'flex',
        height: 50,
        paddingTop: 15,
        color: 'grey',
        fontWeight: 'bold',
        width: '20%',
        textAlign: 'center'
    },
    repliesHeading: {
        fontSize: 15,
        display: 'flex',
        height: 50,
        paddingTop: 15,
        color: 'grey',
        fontWeight: 'bold',
        width: '17%',
        textAlign: 'center'
    },
    logoAndBackButton: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 25,
        height: 75,
        backgroundColor: 'white',
        paddingTop: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: 'black'
    },
    threadView: {
        zIndex: -1,
        position: 'absolute',
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    coinMomoLogo: {
        height: 40,
        width: 150
    },
    Icon: {
        width: 40,
        paddingLeft: 10
    },
    searchHeader: {
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#eff2f5',
        height: 40,
        borderColor: '#F75626',
        borderBottomWidth: 1.3,
        width: '100%'
    },
    advanceSearch: {
        backgroundColor: '#3F51B5',
        height: 35,
        borderRadius: 50
    },
    searchComponent: {
        marginTop: 10
    },
    searchText: {
        fontSize: 18,
        paddingTop: 5,
        width: '85%'
    },
    logo: {
        paddingTop: 20,
        alignItems: 'center'
    },
    moreComponent: {
        position: 'relative',
        height: '100%',
        backgroundColor: 'white'
    },
    footer: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
})
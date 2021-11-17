import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { IMAGE_PATH } from '../../utils/constants';
import { AntDesign, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import { API } from "../../services/apiService";
import RenderHTML from "react-native-render-html";

export default function ForumUser(props) {
    console.log('hello', props);
    const [userDetails, setUsersDetails] = useState([])
    const [userLoading, setUserLoading] = useState(false)
    const [reputation, setReputation] = useState(null)
    useEffect(() => {
        (async () => {
            setUserLoading(true)
            let params = {
                user_id: props.route.params.userData.id
            }
            let users = await API.request("userData", undefined, "POST", null, null, null, null, null, params)
            let reputation = {
                user_id: props.route.params.userData.id
            }
            let reputationCount = await API.request("reputation", undefined, 'POST', null, null, null, null, null, reputation)
            setUsersDetails(users)
            setReputation(reputationCount)
            setUserLoading(false)
        })()
    }, [])
    let date2 = new Date();
    var date1 = new Date(userDetails.length > 0 && userDetails[1].threads[0].current_date_time);
    var delta = Math.abs(date1 - date2) / 1000;
    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    // calculate whole minutes
    let minutes = Math.floor(delta / 60) % 60;
    const Tab = () => {
        return (
            <ScrollView>
                <View style={style.container}>
                    <View style={style.border}>
                        <View style={style.userHeader}>
                            {!props.route.params.userData.image ?
                                <View style={style.userImg}>
                                    <Text style={style.userText}>{props.route.params.userData.name.charAt(0).toUpperCase()}</Text>
                                </View> :
                                <View >
                                    <Image style={style.userImage} source={{ uri: props.route.params.userData.image }} />
                                </View>}
                            <View style={style.conversationUserNameAndEmail}>
                                <Text style={style.userName}>{props.route.params.userData.name[0].toUpperCase() + props.route.params.userData.name.slice(1)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={style.border}>
                        <View>
                            <Text style={style.head}>Overall Stats</Text>
                        </View>
                        <View style={style.heading}>
                            <View style={style.joined}>
                                <Text style={style.textStyle}>{moment(props.route.params.userData.current_date_time).format('MMMM DD, YYYY')}</Text>
                                <Text style={style.textInside}>JOINED</Text>
                            </View>
                            <View style={style.threads}>
                                <Text style={style.textStyle}>{userDetails.length > 0 && userDetails[1].threads.length}</Text>
                                <Text style={style.textInside}>THREADS</Text>
                            </View>
                            <View style={style.threads}>
                                <Text style={style.textStyle}>{userDetails.length > 0 && userDetails[0].replies.length}</Text>
                                <Text style={style.textInside}>REPLIES</Text>
                            </View>
                        </View>
                        <View style={style.heading}>
                            <View style={style.joined}>
                                <View>
                                    {days > 0 ? (
                                        <Text style={style.time}>{days} day(s) ago</Text>
                                    ) : hours > 0 ? (
                                        <Text style={style.time}>{hours} hour(s) ago</Text>
                                    ) : (
                                        <Text style={style.time}>{minutes} minute(s) ago</Text>
                                    )}
                                </View>
                                <Text style={style.textInside}>LAST THREAD</Text>
                            </View>
                            <View style={style.threads}>
                                {reputation && reputation > 0 ? <AntDesign name="like1" size={20} color="#3F51B5" ><Text style={style.textStyle}>{reputation && reputation}</Text></AntDesign>
                                    : <AntDesign name="like2" size={20} color="#3F51B5"><Text style={style.textStyle}>{reputation && reputation}</Text></AntDesign>}
                                <Text style={style.textInside}>REPUTATION</Text>
                            </View>
                            <View style={style.threads}>
                                {props.route.params.likes > 0 ? <AntDesign name="like1" size={20} color="#3F51B5" ><Text style={style.textStyle}>{props.route.params.likes}</Text></AntDesign>
                                    : <AntDesign name="like2" size={20} color="#3F51B5"><Text style={style.textStyle}>{props.route.params.likes}</Text></AntDesign>}
                                <Text style={style.textInside}>RECEIVED</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={style.border}>
                            <Text style={style.head}>Replies</Text>
                            <View style={{ marginBottom: 15 }}>
                                {userDetails.length > 0 && userDetails[0].replies.length > 0 ? userDetails[0].replies.map((val, index) => {
                                    const html = val.description
                                    let date2 = new Date();
                                    var date1 = new Date(val.current_date_time);
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
                                        <View key={index}>
                                            <View style={style.threadsIcon}>
                                                <View style={{ marginBottom: 15 }}>
                                                    {days > 0 ? (
                                                        <Text style={style.time}>{days} day(s) ago</Text>
                                                    ) : hours > 0 ? (
                                                        <Text style={style.time}>{hours} hour(s) ago</Text>
                                                    ) : (
                                                        <Text style={style.time}>{minutes} minute(s) ago</Text>
                                                    )}
                                                </View>
                                                {val.likes && val.likes.length > 0 ? <AntDesign name="like1" size={20} color="#3F51B5" style={style.icon}>{val.likes && val.likes.length}</AntDesign>
                                                    : <AntDesign name="like2" size={20} color="#3F51B5" style={style.icon}>{val.likes && val.likes.length}</AntDesign>}
                                            </View>
                                            <RenderHTML source={{ html }} />
                                        </View>
                                    )
                                }) : <View><Text style={{ marginBottom: '5%', fontWeight: 'bold', fontSize: 15 }}>No Replies</Text></View>}
                            </View>
                            <View>
                            </View>
                        </View>
                        <View style={style.border}>
                            <Text style={style.head}>Threads</Text>
                            <View style={style.threadsIcon}>
                                <View style={{ marginBottom: 15 }}>
                                    {userDetails.length > 0 && userDetails[1].threads.map((val, index) => {
                                        const html = val.title
                                        let date2 = new Date();
                                        var date1 = new Date(val.current_date_time);
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
                                            <View key={index} style={{ marginBottom: 10 }}>
                                                <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: 10 }}>
                                                    <View>
                                                        {days > 0 ? (
                                                            <Text style={style.time}>{days} day(s) ago</Text>
                                                        ) : hours > 0 ? (
                                                            <Text style={style.time}>{hours} hour(s) ago</Text>
                                                        ) : (
                                                            <Text style={style.time}>{minutes} minute(s) ago</Text>
                                                        )}
                                                    </View>
                                                    {val.likes && val.likes.length > 0 ? <AntDesign name="like1" size={20} color="#3F51B5" style={style.icon}>{val.likes && val.likes.length}</AntDesign>
                                                        : <AntDesign name="like2" size={20} color="#3F51B5" style={style.icon}>{val.likes && val.likes.length}</AntDesign>}
                                                    <MaterialCommunityIcons name="reply-outline" size={20} color="#3F51B5" style={style.icon}>{val.no_of_replies}</MaterialCommunityIcons>
                                                </View>
                                                <RenderHTML source={{ html }} />
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    }
    return (
        <View style={style.moreComponent}>
            <View style={style.logoAndBackButton}>
                <TouchableOpacity onPress={() => props.navigation.navigate('forum')}>
                    <AntDesign style={style.Icon} name='arrowleft' size={24} color='black' />
                </TouchableOpacity>
                <View style={style.threadView}><Image style={style.coinMomoLogo} source={IMAGE_PATH.logo} /></View>
                <Pressable>
                    <View style={style.dotRight}>
                        <Entypo name="dots-three-vertical" size={24} color="black" />
                    </View>
                </Pressable>
            </View>
            {!userLoading ?
                Tab() :
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', position: 'absolute' }}>
                    <ActivityIndicator size={35} color='blue' />
                </View>}
        </View >
    );
}
const style = StyleSheet.create({
    conversationUserNameAndEmail: {
        marginLeft: '1%',
        alignSelf: 'center',
        paddingBottom: 5
    },
    joined: {
        width: '40%',
        marginRight: 10,
        marginLeft: 5
    },
    threads: {
        width: '30%',
        marginRight: 15
    },
    userEmail: {
        color: 'grey'
    },
    time: {
        fontWeight: "bold",
        color: "#3F51B5",
    },
    Icon: {
        width: 40,
        paddingLeft: 10
    },
    dotLeft: {
        width: 40,
        paddingLeft: 10
    },
    dotRight: {
        display: 'flex',
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
        width: '100%',
        marginLeft: '82%'
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    userHeader: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        marginTop: 5,
        marginBottom: 15,
    },
    userImg: {
        borderRadius: 50,
        backgroundColor: '#1aa3e8',
        width: 50,
        height: 50,
        display: 'flex',
        alignSelf: 'center',
        marginRight: '1%'
    },
    userText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        paddingTop: '25%'
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginRight: '2%'
    },
    userName: {
        marginTop: 5,
        color: '#f0438b',
        fontWeight: 'bold',
        fontSize: 20,
    },
    border: {
        borderBottomWidth: 2,
        borderBottomColor: '#d1d1d1',
        position: 'relative',
    },
    head: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3F51B5',
        marginTop: 15,
        marginBottom: 25,
    },
    heading: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 5,
        marginBottom: 10
    },
    textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3F51B5',
    },
    textInside: {
        marginVertical: 10,
        fontSize: 16,
        color: '#979797',
    },
    threadsIcon: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    content: {
        fontSize: 15,
        color: '#979797',
        marginBottom: 15,
    },
    icon: {
        marginLeft: 20,
    },
    logoAndBackButton: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 25,
        height: 75,
        backgroundColor: 'white',
        paddingTop: 25,
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
        marginTop: 20
    },
    coinMomoLogo: {
        height: 40,
        width: 150
    },
    searchHeader: {
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'white',
        height: 40,
        borderColor: 'green',
        borderWidth: 1,
        borderRadius: 10,
        marginLeft: 5,
        width: '65%'
    },
    logo: {
        paddingTop: 20,
        alignItems: 'center'
    },
    moreComponent: {
        position: 'relative',
        height: '100%',
        backgroundColor: 'white'
    }
})
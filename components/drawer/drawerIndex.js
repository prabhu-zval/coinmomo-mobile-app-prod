import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome5, MaterialCommunityIcons, FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LoginContext } from "../../context/context";
import { API } from '../../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DrawerIndex(props) {
    const { userLogin, userSigninId, setPopupBackground, setIsModalVisible, drawerBgColor, setDrawerBgColor } = useContext(LoginContext)
    const [userData, setUserData] = useState([])
    const [drawerColor, setDrawerColor] = useState("")
    useEffect(() => {
        (async () => {
            const user = await AsyncStorage.getItem('UserLogin')
            setUserData(JSON.parse(user))
        })()
    }, [userLogin])
    useEffect(() => {
        if (drawerBgColor == "forum") {
            setDrawerColor("forum")
        } else if (drawerBgColor == "portfolio") {
            setDrawerColor("portfolio")
        } else if (drawerBgColor == "explore") {
            setDrawerColor("explore")
        } else {
            setDrawerColor("market")
        }
    }, [drawerBgColor])
    const onPressPortfolio = async () => {
        props.navigation.closeDrawer();
        if (userLogin) {
            let isCreatePortfolio = false;
            let userPortfolios = await API.request('findPortfolio', undefined, 'POST', null, null, null, null, {
                user_id: userSigninId
            })
            if (userPortfolios && userPortfolios.length > 0) {
                props.navigation.navigate('listingPage')
            } else {
                props.navigation.navigate('createPortfolio', { isCreatePortfolio })
            }
        } else {
            props.navigation.navigate('portfolio')
        }
    }
    return (
        <View style={style.sideBar}>
            {userData && userData.length > 0 ? <View style={style.userDetailView}>
                <View style={style.userImg}>
                    <Text style={style.detailText}>{userData[0].name[0].toUpperCase()}</Text>
                </View>
                <View style={style.userDescriptionView}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={style.userName}>{userData[0].name}</Text>
                </View>
            </View> :
                <View style={style.userDetailView}>
                    <FontAwesome5 style={style.userIcon} name="user-circle" size={70} color="#f7f7f7" />
                    <Text style={style.info}>Welcome User !</Text>
                </View>}
            <View style={style.contentView}>
                <View style={style.sideBarItems}>
                    <ScrollView>
                        <TouchableOpacity activeOpacity={0.8} style={[style.itemStyle, { backgroundColor: drawerColor == 'market' ? '#ffccbd' : 'white' }]} onPress={() => { setDrawerBgColor("market"); props.navigation.navigate('home'); props.navigation.closeDrawer() }}>
                            <FontAwesome5 style={style.marketIcon} name="list-alt" size={23} color="black" />
                            <Text style={style.footerIconText}>Market</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={style.itemStyle} onPress={() => { props.navigation.navigate('index'); props.navigation.closeDrawer() }}>
                            <MaterialIcons style={style.eventsIcon} name="event-note" size={30} color="black" />
                            <Text style={style.footerIconText}>Events</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={style.itemStyle} onPress={() => { props.navigation.navigate('search'); props.navigation.closeDrawer() }}>
                            <Ionicons style={style.searchIcon} name='search' size={30} color='black' />
                            <Text style={style.footerIconText}>Search</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={[style.itemStyle, { backgroundColor: drawerColor == 'portfolio' ? '#ffccbd' : 'white' }]} onPress={() => { setDrawerBgColor("portfolio"); onPressPortfolio() }}>
                            <FontAwesome style={style.portfolioIcon} name="line-chart" size={22} color="black" />
                            <Text style={style.footerIconText}>Portfolio</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={[style.itemStyle, { backgroundColor: drawerColor == 'forum' ? '#ffccbd' : 'white' }]} onPress={() => { setDrawerBgColor("forum"); props.navigation.navigate('forum'); props.navigation.closeDrawer() }}>
                            <MaterialCommunityIcons style={style.forumIcon} name="forum-outline" size={29} color="black" />
                            <Text style={style.footerIconText}>Forum</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={[style.itemStyle, { backgroundColor: drawerColor == 'explore' ? '#ffccbd' : 'white' }]} onPress={() => { setDrawerBgColor("explore"); props.navigation.navigate('explore'); props.navigation.closeDrawer() }}>
                            <FontAwesome style={style.exploreIcon} name='wpexplorer' size={29} color='black' />
                            <Text style={style.footerIconText}>Explore</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
            <View style={style.notification}>
                {!userLogin ?
                    <TouchableOpacity style={style.login} activeOpacity={0.8} onPress={() => { props.navigation.navigate('portfolio', { home: 'home' }); props.navigation.openDrawer() }} >
                        <View style={style.loginView}>
                            <MaterialCommunityIcons name="login" size={30} color="black" />
                            <Text style={style.textStyle}>login</Text>
                        </View>
                    </TouchableOpacity> :
                    <TouchableOpacity style={style.logout} activeOpacity={0.8} onPress={() => { setIsModalVisible(true); setPopupBackground(true); props.navigation.closeDrawer() }} >
                        <View style={style.loginView}>
                            <MaterialCommunityIcons name="logout" size={30} color="black" />
                            <Text style={style.textStyle}>Logout</Text>
                        </View>
                    </TouchableOpacity>}
            </View>
        </View>
    );
}
const style = StyleSheet.create({
    userIcon: {
        marginTop: '17%',
        alignSelf: 'center'
    },
    info: {
        marginTop: 13,
        alignSelf: 'center',
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold'
    },
    login: {
        height: 50,
        width: '60%',
        paddingTop: 10,
        paddingLeft: '8%',
        borderRadius: 50,
        backgroundColor: 'lightgrey'
    },
    logout: {
        height: 50,
        width: '60%',
        paddingTop: 10,
        paddingLeft: '8%',
    },
    textStyle: {
        marginTop: 2,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 37
    },
    loginView: {
        flexDirection: 'row'
    },
    notification: {
        paddingTop: '3%',
        paddingLeft: '10%'
    },
    searchIcon: {
        paddingRight: 38
    },
    eventsIcon: {
        paddingRight: 38
    },
    forumIcon: {
        paddingRight: 39
    },
    exploreIcon: {
        paddingRight: 39
    },
    portfolioIcon: {
        paddingRight: 43
    },
    marketIcon: {
        paddingRight: 44
    },
    profileIcon: {
        paddingRight: 40
    },
    itemStyle: {
        height: 70,
        width: '96%',
        borderRadius: 5,
        alignSelf: 'center',
        flexDirection: 'row',
        paddingLeft: '15%',
        paddingTop: '8%'
    },
    footerIconText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    sideBarItems: {
        marginTop: '8%',
    },
    sideBar: {
        height: '100%',
        width: '100%',
        borderRightWidth: 0.3,
        borderRightColor: 'black'
    },
    userDetailView: {
        height: '26.7%',
        width: '100%',
        marginTop: 23,
        backgroundColor: '#F75626'
    },
    userImg: {
        borderRadius: 50,
        backgroundColor: 'grey',
        width: 85,
        height: 85,
        borderWidth: 4,
        borderColor: 'white',
        alignSelf: 'center',
        marginTop: '15%',
        justifyContent: 'center'
    },
    detailText: {
        color: 'white',
        fontSize: 35,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    userDescriptionView: {
        marginTop: 20,
        alignSelf: 'center'
    },
    userName: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold'
    },
    reputation: {
        marginLeft: 5,
        color: '#eff2f5',
        fontSize: 16,
        fontWeight: 'bold'
    },
    reputationView: {
        flexDirection: 'row',
        marginTop: 10
    },
    contentView: {
        backgroundColor: 'white',
        height: '60%',
        width: '100%',
    },
})
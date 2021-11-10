import React, { useContext } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { FontAwesome5, MaterialCommunityIcons, FontAwesome, Feather, MaterialIcons } from '@expo/vector-icons';
import { LoginContext } from "../../context/context";
import { API } from '../../services/apiService';

const Footer = (props) => {
    const { userLogin, userSigninId } = useContext(LoginContext)
    const onPressPortfolio = async () => {
        if (userLogin) {
            let isCreatePortfolio = false;
            let userPortfolios = await API.request('findPortfolio', undefined, 'POST', null, null, null, null, {
                user_id: userSigninId
            })
            if (userPortfolios && userPortfolios.length > 0) {
                props.props.navigation.navigate('listingPage')
            } else {
                props.props.navigation.navigate('createPortfolio', { isCreatePortfolio })
            }
        } else {
            props.props.navigation.navigate('portfolio')
        }
    }
    return (
        <View style={style.Footer}>
            <View style={style.marketLogo}>
                <TouchableOpacity onPress={() => props.props.navigation.navigate('home')}>
                    <FontAwesome5 style={style.marketIcon} name="list-alt" size={20} color="white" />
                    <Text style={style.footerIconText}>Market</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={() => { onPressPortfolio() }}>
                    <FontAwesome style={style.portfolioIcon} name="line-chart" size={20} color="white" />
                    <Text style={style.footerIconText}>Portfolio</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={() => props.props.navigation.navigate('search')}>
                    <Feather style={style.searchIcon} name='search' size={23} color='white' />
                    <Text style={style.footerIconText}>Search</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={() => props.props.navigation.navigate('index')}>
                    <MaterialIcons style={style.exploreIcon} name='event-note' size={23} color='white' />
                    <Text style={style.footerIconText}>Events</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => props.props.navigation.navigate('forum')}>
                <View style={style.forum}>
                    <MaterialCommunityIcons name="forum-outline" size={22} color="white" />
                    <Text style={style.footerIconText}>Forum</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}
const style = StyleSheet.create({
    Footer: {
        backgroundColor: '#F75626',
        paddingTop: 7,
        paddingBottom: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        bottom: 0,
        position: 'absolute',
        width: '100%'
    },
    marketLogo: {
        paddingLeft: 15
    },
    forum: {
        paddingRight: 15,
    },
    moreIcon: {
        marginLeft: 2
    },
    footerIconText: {
        fontSize: 13,
        color: 'white',
        fontWeight: 'bold'
    },
    portfolioIcon: {
        marginTop: 2,
        marginLeft: 12,
        marginBottom: 2
    },
    searchIcon: {
        marginLeft: 8
    },
    exploreIcon: {
        marginLeft: 8
    },
    marketIcon: {
        marginLeft: 8,
        marginTop: 2,
        marginBottom: 1
    }
});

export default Footer;
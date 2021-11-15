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
            <View style={style.Logo}>
                <TouchableOpacity onPress={() => props.props.navigation.navigate('home')}>
                    <FontAwesome5 style={style.Icon} name="list-alt" size={20} color="white" />
                    <Text style={style.footerIconText}>Market</Text>
                </TouchableOpacity>
            </View>
            <View style={style.Logo}>
                <TouchableOpacity onPress={() => { onPressPortfolio() }}>
                    <FontAwesome style={style.Icon} name="line-chart" size={20} color="white" />
                    <Text style={style.footerIconText}>Portfolio</Text>
                </TouchableOpacity>
            </View>
            <View style={style.Logo}>
                <TouchableOpacity onPress={() => props.props.navigation.navigate('search')}>
                    <Feather style={style.Icon} name='search' size={23} color='white' />
                    <Text style={style.footerIconText}>Search</Text>
                </TouchableOpacity>
            </View>
            <View style={style.Logo}>
                <TouchableOpacity onPress={() => props.props.navigation.navigate('index')}>
                    <MaterialIcons style={style.Icon} name='event-note' size={23} color='white' />
                    <Text style={style.footerIconText}>Events</Text>
                </TouchableOpacity>
            </View>
            <View style={style.Logo}>
            <TouchableOpacity onPress={() => props.props.navigation.navigate('forum')}>
                    <MaterialCommunityIcons style={style.Icon} name="forum-outline" size={22} color="white" />
                    <Text style={style.footerIconText}>Forum</Text>
            </TouchableOpacity>
            </View>
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
    Logo: {
        width: '20%',
        alignSelf: 'center',
        alignItems: 'center',
    },
    footerIconText: {
        fontSize: 13,
        color: 'white',
        fontWeight: 'bold'
    },
    Icon: {
        alignSelf: 'center'
    }
});

export default Footer;
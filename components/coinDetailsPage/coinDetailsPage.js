import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { CoinDetailsHeaderTabs } from '../headerMenus/headerMenus';

export default function CoinDetailsPage(props) {
    return (
        <View>
            <View style={style.IconAndText}>
                <TouchableOpacity onPress={() => props.navigation.navigate('home')}>
                    <AntDesign style={style.Icon} name='arrowleft' size={24} color='white' />
                </TouchableOpacity>
                <Text style={style.coinName}>{props.route.params.name}({props.route.params.symbol.toUpperCase()})</Text>
            </View>
            <View style={style.CoinDetailsHeaderTabs}>
                <CoinDetailsHeaderTabs props={props} />
            </View>
        </View>
    )
}
const style = StyleSheet.create({
    CoinDetailsHeaderTabs: {
        height: '100%',
        marginTop: -10
    },
    Icon: {
        width: 40,
        paddingLeft: 10
    },
    IconAndText: {
        backgroundColor: '#F75626',
        marginTop: 25,
        height: 55,
        paddingTop: 15,
        display: 'flex',
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgrey',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    coinName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        zIndex: -1,
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 15
    }
})
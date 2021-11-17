import React, { useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
// import { ExploreHeaderTabs } from '../headerMenus/headerMenus';
import BeamUpdates from '../beamUpdates/beamUpdates'
import { LoginContext } from "../../context/context";
import Footer from '../Footer/footer';

export default function Explore(props) {
    const { setDrawerBgColor } = useContext(LoginContext)
    return (
        <View style={style.exploreComponent}>
            <View style={style.exploreHeader}>
                <TouchableOpacity style={style.menu} onPress={() => { props.navigation.openDrawer(); setDrawerBgColor("explore") }}>
                    <Entypo name="menu" size={30} color="black" />
                </TouchableOpacity>
                <Text style={style.exploreText}>EXPLORE</Text>
            </View>
            {/* <ExploreHeaderTabs /> */}
            {/* <View style={style.beamUpdates}>
                <Text style={style.beamUpdatesText}>Beam Updates</Text>
            </View> */}
            <BeamUpdates />
            <Footer props={props} />
        </View>
    );
}
const style = StyleSheet.create({
    menu: {
        marginRight: '35%'
    },
    exploreHeader: {
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 25,
        flexDirection: 'row',
        backgroundColor: '#f4f4f4',
        paddingTop: 20,
        height: 60,
    },
    exploreComponent: {
        position: 'relative',
        height: '100%',
    },
    exploreText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F75626'
    },
    beamUpdatesText: {
        fontWeight: "bold",
        fontSize: 18,
        alignSelf: 'center',
        color: "white",
    },
    beamUpdates: {
        display: "flex",
        paddingVertical: 10,
        backgroundColor: "#F75626",
    },

});
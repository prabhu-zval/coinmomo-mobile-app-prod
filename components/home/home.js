import React, { useContext, useState } from "react";
import Header from "../header/header";
import { View, StyleSheet } from "react-native";
import { LoginContext } from '../../context/context';
import { HeaderMenus } from '../headerMenus/headerMenus';
import Footer from '../Footer/footer';

export default function Home(props) {
    const { screenLoading, popupBackground } = useContext(LoginContext)

    return (
        <View style={styles.Home}>
            {popupBackground ? <View style={styles.popupBackground}></View> : null}
            <Header props={props} />
            {screenLoading ? <View style={styles.loadingView}></View> : null}
            <View style={styles.headerMenus}>
                <HeaderMenus />
            </View>
            <Footer props={props} />
        </View>
    );
}
const styles = StyleSheet.create({
    popupBackground: {
        position: "absolute",
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "black",
        opacity: 0.5,
        height: "100%",
        width: "100%"
    },
    loadingView: {
        elevation: 2,
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'black',
        opacity: 0.5
    },
    headerMenus: {
        height: '100%',
        marginTop: -10
    },
    Home: {
        position: 'relative',
        height: '100%'
    }
});
import React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { IMAGE_PATH } from '../../utils/constants';
import { MaterialCommunityIcons, Foundation, MaterialIcons } from '@expo/vector-icons';
import Footer from '../Footer/footer';

export default function Index(props) {
    return (
        <View style={style.container}>
            <View style={style.threadIconAndText}>
                <View style={style.threadView}>
                    <Image style={style.coimmomoLogo} source={IMAGE_PATH.logo} />
                </View>
            </View>
            <View style={style.events}>
                <Text style={style.eventsText}>Choose Events</Text>
            </View>
            <View style={style.buttonContainer}>
                <TouchableOpacity activeOpacity={0.8} style={style.box} onPress={() => { props.navigation.navigate("mainEvents") }}>
                    <MaterialCommunityIcons name="calendar-month" size={60} color="white" />
                    <Text style={style.text}>Upcoming Events</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={style.box} onPress={() => { props.navigation.navigate("pastevents") }}>
                    <MaterialCommunityIcons name="calendar-clock" size={60} color="white" />
                    <Text style={style.text}>Past Events</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={style.box} onPress={() => { props.navigation.navigate("highlights") }}>
                    <MaterialIcons name="highlight" size={60} color="white" />
                    <Text style={style.text}>Highlights</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={style.box} onPress={() => { props.navigation.navigate("advanceSearch") }}>
                    <MaterialCommunityIcons name="calendar-search" size={60} color="white" />
                    <Text style={style.text}>Advanced Search</Text>
                </TouchableOpacity>
            </View>
            <Footer props={props} />
        </View>
    )
}
const style = StyleSheet.create({
    container: {
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
    events: {
        display: "flex",
        paddingVertical: 10,
        backgroundColor: "#F75626",
    },
    eventsText: {
        marginVertical: 5,
        fontWeight: "bold",
        fontSize: 18,
        alignSelf: 'center',
        color: "white",
    },
    buttonContainer: {
        flex: 1,
        padding: '5%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: '4%',
        backgroundColor: '#ECF0F1',
    },
    box: {
        height: '43%',
        width: '48%',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#CAD5E2',
        borderRadius: 15,
        marginBottom: '4%',
        backgroundColor: '#3F51B5',
        elevation: 10,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 20
    },
})
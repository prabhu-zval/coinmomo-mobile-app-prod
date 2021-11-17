import React, { useContext, useState } from "react";
import { IMAGE_PATH } from "../../../utils/constants";
import { View, StyleSheet, Image, Text } from "react-native";
import { LoginContext } from "../../../context/context";
import { ScrollView } from "react-native";
import { TouchableHighlight } from "react-native";

export default function PriceFilter(props) {
    const { setSortBy } = useContext(LoginContext);
    const [filterData, setFilterData] = useState([
        { name: "1H", Symbol: "" },
        { name: "24H", Symbol: "" },
        { name: "7D", Symbol: "" },

    ]);
    return (
        <View style={style.portfolios}>
            <View style={style.threadIconAndText}>
                <View style={style.threadView}>
                    <Image style={style.coimmomoLogo} source={IMAGE_PATH.logo} />
                </View>
            </View>
            <View style={style.title}>
                <Text style={style.titleText}>HOUR FILTER</Text>
            </View>
            <ScrollView>
                <View style={style.container}>
                    {filterData.map((val, index) => (
                        <View key={index} style={style.textArea}>
                            <TouchableHighlight underlayColor="rgba(1,1,1,0.2)" style={{ width: "100%", paddingTop: 18, paddingLeft: 15 }}
                                onPress={() => {
                                    props.navigation.navigate("");
                                    setSortBy(val.Symbol);
                                }}>
                                <Text style={style.content}>
                                    {val.name}
                                </Text>
                            </TouchableHighlight>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
const style = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
    },
    textArea: {
        height: 60,
        display: "flex",
        borderBottomWidth: 1,
        borderBottomColor: "grey",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    IconAndText: {
        height: 60,
        paddingTop: 22,
        display: "flex",
        borderBottomWidth: 0.5,
        borderBottomColor: "black",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 30,
    },

    coinName: {
        fontSize: 20,
        color: "black",
        zIndex: -1,
        position: "absolute",
        width: "100%",
        textAlign: "center",
        marginTop: "5%",
        color: "#5142a9",
        fontWeight: "bold",
    },
    portfolios: {
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
    title: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 15,
        backgroundColor: "#F75626",
    },
    titleText: {
        fontWeight: "bold",
        fontSize: 18,
        marginLeft: "38%",
        color: "white",
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
    content: {
        fontWeight: "bold",
        fontSize: 18,
    },
});
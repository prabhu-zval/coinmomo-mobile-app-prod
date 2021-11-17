import React, { useContext, useState, useEffect } from "react";
import { IMAGE_PATH } from "../../../utils/constants";
import { View, StyleSheet, Image, Text } from "react-native";
import { LoginContext } from "../../../context/context";
import { ScrollView } from "react-native";
import { TouchableHighlight } from "react-native";

export default function BtcToUsdFilter(props) {

    const { dollarvalue, setConversionValue, setConversionPrice, conversionValue, conversionPrice, setConversionRate, conversionRate, setConversionBgColor, conversionBgColor } = useContext(LoginContext)
    const [rates, setRates] = useState(dollarvalue)
    const [mapedData, setMapedData] = useState([])
    useEffect(() => {
        const arrayOfObj = Object.entries(rates).map((e) => {
            return (
                {
                    "id": e[0],
                    "name": e[1].name,
                    "type": e[1].type,
                    "unit": e[1].unit,
                    "value": e[1].value,
                })
        }
        );
        if (conversionRate.length > 0) {
            setMapedData(conversionRate)
        }
        else {
            setMapedData(arrayOfObj)
        }
    }, [])
    const conversion = (value, price) => {
        props.navigation.navigate("home")
        let data = mapedData.filter((val) => val.id != value)
        let removedData = mapedData.filter((val) => val.id == value)
        data.unshift(removedData[0])
        setMapedData(data)
        setConversionValue(value.toUpperCase())
        setConversionPrice(price)
        setConversionRate(data)
        setConversionBgColor(value)
    }

    return (
        <View style={style.portfolios}>
            <View style={style.threadIconAndText}>
                <View style={style.threadView}>
                    <Image style={style.coimmomoLogo} source={IMAGE_PATH.logo} />
                </View>
            </View>
            <View style={style.title}>
                <Text style={style.titleText}>Conversion: {conversionValue}</Text>
                <Text style={style.titleText}>Value: {conversionPrice}</Text>
            </View>
            <ScrollView>
                {mapedData.length > 0 && mapedData.map((val, index) => {
                    return (
                        <View style={style.container} key={index}>
                            <View style={[style.textArea, { backgroundColor: val.id == conversionBgColor ? "lightgrey" : 'white' }]} >
                                <TouchableHighlight underlayColor="rgba(1,1,1,0.2)" style={style.clickable}
                                    onPress={() => { setConversionBgColor(null); conversion(val.id, val.value) }}>
                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Text style={style.coinContent}>{val.id.toUpperCase()}</Text>
                                        <Text style={style.content}>{val.value}</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    )
                })
                }
            </ScrollView>
        </View>
    );
}
const style = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
    },
    clickable: {
        width: "100%",
        paddingTop: 18,
        paddingLeft: 15
    },
    textArea: {
        height: 60,
        display: "flex",
        borderBottomWidth: 0.5,
        borderBottomColor: "grey",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: 'white'
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
        paddingVertical: 15,
        justifyContent: 'space-around',
        backgroundColor: "#F75626"
    },
    titleText: {
        width: '50%',
        fontWeight: "bold",
        fontSize: 18,
        color: "white",
        paddingLeft: '10%'
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
        fontSize: 16,
        color: 'black',
        width: '50%',
        paddingLeft: '10%',
    },
    coinContent: {
        fontWeight: "bold",
        fontSize: 18,
        width: '50%',
        paddingLeft: '10%',
        color: '#525252'
    }
});
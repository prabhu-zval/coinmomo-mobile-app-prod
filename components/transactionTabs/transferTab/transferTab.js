import React, { useState, useEffect, useContext } from "react";
import { Picker } from '@react-native-picker/picker';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Pressable, Image, ScrollView, Keyboard, ActivityIndicator } from "react-native";
import { FontAwesome5, AntDesign, SimpleLineIcons, Fontisto, EvilIcons } from "@expo/vector-icons";
import moment from "moment";
import { LoginContext } from "../../../context/context";
import { API } from "../../../services/apiService";
import CalendarPicker from "react-native-calendar-picker";

export default function TransferTab() {
    let { currentTab, fee, setSymbol, setPricePercentage, coinName, setCoinName, setFee, quantity, notes, setQuantity, setPricePerCoin, setDate, setCurrentTab, setNotes, quantityError, setQuantityError, assetsCoin, assetsCoinImage, setAssetsCoin, setAssetsCoinImage } = useContext(LoginContext);
    const [feeModalVisible, setFeeModalVisible] = useState(false);
    const [noteModalVisible, setNoteModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState("Transfer In");
    const [dateModalVisible, setDateModalVisible] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [transferFee, setTransferFee] = useState("");
    const [transferNotes, setTransferNotes] = useState("");
    const [suggestionsList, setSuggestionsList] = useState(null);
    const [selectedItem, setSelectedItem] = useState("");
    const [coinDataloading, setCoinDataLoading] = useState(false);
    const [noCoinData, setNoCoinData] = useState();
    const [coinImage, setCoinImage] = useState(coinName.image);
    const [coinRenderData, setCoinRenderData] = useState(null);
    const [coinInputValue, setCoinInputValue] = useState(coinName.coinName);

    useEffect(() => {
        let params = {
            coin_id: coinName.coinId,
        };
        (async () => {
            const coinEventResult = await API.request("assetsTable", undefined, "POST", null, null, null, null, params);
            setSymbol(coinEventResult[0].symbol);
            setDate(moment().format("Do MMM YYYY h:mm a"));
            setPricePercentage(coinEventResult[0].price_change_percentage_24h);
        })();
    }, []);

    useEffect(() => {
        setCoinInputValue(coinName.coinName);
        setCoinImage(coinName.image);
    }, [coinName.coinName]);

    const onChangeCoinTextFunction = (q) => {
        setCoinRenderData(null);
        setCoinDataLoading(true);
        setNoCoinData(false);
        if (q) {
            const params = {
                q: q,
            };
            API.request("fetchCoins", undefined, "GET", null, null, null, null, params).then((result) => {
                let data =
                    result &&
                    result.map((item, index) => ({
                        id: item.id,
                        title: item.name + ` (${item.symbol.toUpperCase()})`,
                        image: item.image,
                        symbol: item.symbol,
                    }));
                setCoinRenderData(data);
                setCoinDataLoading(false);
                if (data.length == 0) {
                    setNoCoinData(true);
                }
            });
        } else {
            setCoinRenderData(null);
            setCoinDataLoading(null);
        }
    };
    const startDate = selectedStartDate ? selectedStartDate.toString() : "";
    const today = moment().format("YYYY-MM-DD");
    const onChangeDateAndTime = () => {
        setDate(
            startDate
                ? moment(`${startDate}`).format("Do MMM YYYY") +
                moment().format(" h:mm a")
                : moment().format("Do MMM YYYY h:mm a")
        );
        setDateModalVisible(!dateModalVisible);
    };
    const searchCoin = async () => {
        let params = {
            coin_id: coinName.coinId,
        };
        const coinEventResult = await API.request("assetsTable", undefined, "POST", null, null, null, null, params);
        setPricePerCoin(coinEventResult[0].current_price);
        setPricePercentage(coinEventResult[0].price_change_percentage_24h);
        setSymbol(coinEventResult[0].symbol);
    };
    const onDateChange = (date) => {
        setSelectedStartDate(date);
    };
    const removeDecimals = (num) => {
        let decimals = num.split(".");
        return decimals[0];
    };
    const addDecimals = (num) => {
        if (!num) return num;
        num = num.toString();
        let decimals = num.split(".");
        if ((decimals[1] && decimals[1].length == 0) || !decimals[1]) {
            return `${num}.00`;
        } else {
            if (decimals[1].length == 1) {
                return `${num}0`;
            } else if (decimals[1].length > 2) {
                const factorOfTen = Math.pow(10, 2);
                num = Math.round(num * factorOfTen) / factorOfTen;
            }
        }
        return num.toString();
    };
    const transferQuantityFunction = (text) => {
        var reg = /^-?\d+\.?\d*$/;
        if (reg.test(text)) {
            setQuantity(text);
            setQuantityError(false);
        }
        if (text == "") {
            setQuantity(text);
            setQuantityError(false);
        }
    };
    const transferFeeFunction = (text) => {
        var reg = /^-?\d+\.?\d*$/;
        if (reg.test(text)) {
            setTransferFee(text);
        }
        if (text == "") {
            setTransferFee(text);
        }
    };

    const onBlurCoin = () => {
        setCoinImage(assetsCoinImage);
        setCoinInputValue(assetsCoin)
        setNoCoinData(false)
        Keyboard.dismiss()
    }
    return (
        <Pressable onPress={() => Keyboard.dismiss()}>
            <View style={style.transferContainer}>
                <View>
                    <View style={style.commonTextInput}>
                        <View style={style.ImageAndTextInput}>
                            <View style={style.ImageView}>
                                <Image style={style.imageTag} source={{ uri: coinImage }} />
                            </View>
                            <TextInput
                                onBlur={() => onBlurCoin()}
                                value={coinInputValue}
                                placeholder={"Select Coins"}
                                style={style.coinTextInput}
                                onChangeText={(text) => onChangeCoinTextFunction(text)}
                                onFocus={() => {
                                    setCoinImage(null);
                                    setCoinInputValue(null);
                                    setCoinName("");
                                }}
                                autoCorrect={false}
                            />
                        </View>
                        {coinDataloading ? (
                            <View style={style.loadingView}>
                                <Text>Loading...</Text>
                                <ActivityIndicator size={25} color="blue" />
                            </View>
                        ) : null}
                        {coinRenderData ? (
                            <View style={style.suggestionsContainer}>
                                <ScrollView keyboardShouldPersistTaps={"handled"}>
                                    {noCoinData ? (
                                        <View style={style.noDataView}>
                                            <Text style={style.noDataAvailable}>NO DATA AVAILABLE</Text>
                                        </View>
                                    ) : (
                                        <View></View>
                                    )}
                                    {coinRenderData &&
                                        coinRenderData.map((val, item) => {
                                            return (
                                                <View key={item}>
                                                    <Pressable
                                                        onPress={() => {
                                                            setCoinInputValue(val.title);
                                                            setCoinRenderData(null);
                                                            setCoinImage(val.image);
                                                            Keyboard.dismiss();
                                                            searchCoin(val.id);
                                                            setCoinName({
                                                                coinId: val.id,
                                                                coinName: val.title,
                                                                image: val.image,
                                                            });
                                                            setSymbol(val.id);
                                                            setAssetsCoin(val.title)
                                                            setAssetsCoinImage(val.image)
                                                        }}
                                                    >
                                                        <View style={[style.coinSuggestionsView, { backgroundColor: item % 2 == 0 ? 'white' : '#e6e6e6' }]}>
                                                            <Image
                                                                style={style.coinSuggestionsImage}
                                                                source={{ uri: val.image }}
                                                            />
                                                            <Text style={style.coinSuggestionsText}>
                                                                {val.title}
                                                            </Text>
                                                        </View>
                                                    </Pressable>
                                                </View>
                                            );
                                        })}
                                </ScrollView>
                            </View>
                        ) : null}
                    </View>
                </View>
                <View style={style.quantityAndPrice}>
                    <Text style={style.transferText}>Transfer</Text>
                    <View style={style.pickerViewContainer}>
                        <Picker
                            selectedValue={currentTab}
                            style={style.pickerContainer}
                            onValueChange={(itemValue, itemIndex) => {
                                setCurrentTab(itemValue);
                            }}
                        >
                            <Picker.Item label="TRANSFER IN" value="TRANSFER IN" />
                            <Picker.Item label="TRANSFER OUT" value="TRANSFER OUT" />
                        </Picker>
                    </View>
                    <View style={style.quantityContainer}>
                        <View style={style.quantity}>
                            <Text style={style.quantityText}>Quantity</Text>
                            <TextInput
                                keyboardType={"numeric"}
                                maxLength={9}
                                value={quantity}
                                onChangeText={(text) => transferQuantityFunction(text)}
                                style={
                                    quantityError != "" ? style.quantityError : style.placeholder
                                }
                                placeholder={"0.00"}
                            ></TextInput>
                            {quantityError != "" ? (
                                <Text style={style.quantityErrorText}>{quantityError}</Text>
                            ) : null}
                        </View>
                    </View>
                </View>
                <View style={style.dateFeesAndNotes}>
                    <View style={style.dateView}>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => setDateModalVisible(true)}>
                            <View style={style.dateContainer}>
                                <Fontisto
                                    style={style.calendarIcon} name="calendar" size={26} color="white" />
                                {startDate ? (
                                    <View>
                                        <Text style={style.dateText}>
                                            {moment(`${startDate}`).format("Do MMM YYYY")}
                                        </Text>
                                        <Text style={style.timeText}>
                                            {moment().format(" h:mm a")}
                                        </Text>
                                    </View>
                                ) : (
                                    <View>
                                        <Text style={style.dateText}>
                                            {moment().format("Do MMM YYYY")}{" "}
                                        </Text>
                                        <Text style={style.timeText}>
                                            {moment().format(" h:mm a")}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={style.feeAndNotesView}>
                        <TouchableOpacity activeOpacity={0.9}
                            onPress={() => {
                                setTransferFee(removeDecimals(fee));
                                setFeeModalVisible(true);
                            }}
                        >
                            <View style={style.feeContainer}>
                                <FontAwesome5 name="coins" size={18} color="white" />
                                {fee ? (
                                    <Text style={style.selectFeeText}>${addDecimals(fee)}</Text>
                                ) : (
                                    <Text style={style.feeText}>FEE</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => setNoteModalVisible(true)}>
                            <View style={style.notesContainer}>
                                <SimpleLineIcons name="note" size={18} color="white" />
                                <Text style={style.notesText}>NOTES</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={style.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={dateModalVisible}
                        onRequestClose={() => {
                            setDateModalVisible(!dateModalVisible);
                        }}
                    >
                        <View style={style.centeredView}>
                            <View style={style.dateModalView}>
                                <View style={style.backIconAndText}>
                                    <Text style={style.dateAndTimeText}>Date & Time</Text>
                                    <TouchableOpacity activeOpacity={0.9}
                                        style={{}}
                                        onPress={() => setDateModalVisible(!dateModalVisible)}>
                                        <EvilIcons style={style.popupCross} name='close' size={24} color='black' />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 12 }}>
                                    <CalendarPicker
                                        onDateChange={onDateChange}
                                        maxDate={today}
                                        selectedDayColor="#3861fb"
                                        selectedDayTextColor="white"
                                        positio
                                        height={350}
                                        width={350}
                                    />
                                    <TouchableOpacity activeOpacity={0.9} onPress={onChangeDateAndTime}>
                                        <View style={style.changeDateAndTimeContainer}>
                                            <Text style={style.changeDateAndTimeText}>
                                                Update Date
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View style={style.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={feeModalVisible}
                        onRequestClose={() => {
                            setFeeModalVisible(!feeModalVisible);
                        }}
                    >
                        <View style={style.centeredView}>
                            <View style={style.modalView}>
                                <View style={style.backIconAndText}>
                                    <Text style={style.addFeeText}>Add Fee</Text>
                                    <TouchableOpacity activeOpacity={0.9}
                                        onPress={() => {
                                            setFeeModalVisible(!feeModalVisible);
                                        }}
                                    >
                                        <EvilIcons style={style.popupCross} name='close' size={24} color='black' />
                                    </TouchableOpacity>
                                </View>
                                <TextInput
                                    maxLength={9}
                                    keyboardType={"numeric"}
                                    value={transferFee}
                                    onChangeText={(text) => transferFeeFunction(text)}
                                    placeholder="$"
                                    style={style.feePlaceholder}
                                ></TextInput>
                                <TouchableOpacity activeOpacity={0.9}
                                    style={style.buttonClose}
                                    onPress={() => {
                                        setFeeModalVisible(!feeModalVisible);
                                        setFee(addDecimals(transferFee));
                                        setNotes(transferNotes);
                                    }}
                                >
                                    <Text style={style.textStyle}>Add Fee</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View style={style.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={noteModalVisible}
                        onRequestClose={() => {
                            setNoteModalVisible(!noteModalVisible);
                        }}
                    >
                        <View style={style.centeredView}>
                            <View style={style.notesModalView}>
                                <View style={style.backIconAndText}>
                                    <Text style={style.addFeeText}>Add Note</Text>
                                    <TouchableOpacity activeOpacity={0.9}
                                        onPress={() => {
                                            setTransferNotes(notes);
                                            setNoteModalVisible(!noteModalVisible);
                                        }}
                                    >
                                        <EvilIcons style={style.popupCross} name='close' size={24} color='black' />
                                    </TouchableOpacity>
                                </View>
                                <TextInput
                                    placeholder="Add notes here...!"
                                    value={transferNotes}
                                    onChangeText={(text) => setTransferNotes(text)}
                                    style={style.notesPlaceholder}
                                ></TextInput>
                                <TouchableOpacity activeOpacity={0.9}
                                    style={style.buttonClose}
                                    onPress={() => {
                                        setNoteModalVisible(!noteModalVisible);
                                        setNotes(transferNotes);
                                    }}
                                >
                                    <Text style={style.textStyle}>Add Note</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </Pressable>
    );
}
const style = StyleSheet.create({
    popupCross: {
        marginRight: 12
    },
    selectFeeText: {
        fontSize: 15,
        marginLeft: "5%",
        color: 'white',
        fontWeight: 'bold',
    },
    noDataAvailable: {
        textAlign: "center",
        paddingTop: 10,
    },
    coinSuggestionsView: {
        height: 50,
        backgroundColor: "white",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "lightgrey",
        elevation: 10,
    },
    coinSuggestionsImage: {
        height: 30,
        width: 30,
        marginLeft: 15,
        marginTop: 10,
    },
    coinSuggestionsText: {
        color: "black",
        marginLeft: 15,
        marginTop: 15,
    },
    ImageAndTextInput: {
        display: "flex",
        marginTop: 20,
        flexDirection: "row",
    },
    coinTextInput: {
        height: 40,
        width: "88%",
        borderBottomWidth: 1.5,
        borderBottomColor: '#F75626',
        fontWeight: 'bold',
        fontSize: 15,
        paddingLeft: 5,
        backgroundColor: "#eff2f5",
    },
    suggestionsContainer: {
        position: "absolute",
        width: "100%",
        marginTop: 60,
        height: 150,
        zIndex: 1,
    },
    noDataView: {
        width: "100%",
        display: "flex",
        backgroundColor: "white",
        height: 40,
        textAlign: "center",
        justifyContent: "center",
        borderWidth: 0.4,
    },

    loadingView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        position: "absolute",
        zIndex: 1,
        width: "100%",
        marginTop: 35,
        backgroundColor: "white",
        height: 50,
        paddingTop: 10,
        borderWidth: 0.5,
    },
    ImageView: {
        height: 40,
        borderBottomColor: '#F75626',
        borderBottomWidth: 1.5,
        width: "12%",
        backgroundColor: "#eff2f5",
    },
    imageTag: {
        width: 25,
        height: 25,
        marginLeft: 10,
        marginTop: 5,
    },
    changeDateAndTimeContainer: {
        width: 170,
        height: 35,
        borderRadius: 50,
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: "#3F51B5",
        marginTop: 20,
    },
    feeText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
        marginLeft: "10%",
    },
    pickerContainer: {
        height: 35,
        width: "100%",
    },
    changeDateAndTimeText: {
        color: "white",
        paddingTop: 8,
        fontWeight: "bold"
    },
    quantityContainer: {
        marginTop: 10,
    },
    notesText: {
        fontSize: 15,
        fontWeight: "bold",
        color: "white",
        marginLeft: "10%",
    },
    quantityText: {
        fontWeight: "bold",
        marginBottom: 3,
    },
    calendarIcon: {
        marginTop: 10,
        marginRight: 15,
    },
    pickerViewContainer: {
        borderColor: "black",
        borderWidth: 0.5,
    },
    transferText: {
        fontWeight: "bold",
        marginBottom: 3,
    },
    dateModalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        paddingLeft: 10,
        paddingTop: 10,
        height: 430,
        width: 350,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderColor: '#eff2f5',
        borderWidth: 2
    },
    dateAndTimeText: {
        fontSize: 18,
        color: "#F75626",
        width: "50%",
        marginLeft: "3%",
        fontWeight: "bold",
    },
    dateText: {
        paddingRight: 2,
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
    },
    dateContainer: {
        marginTop: 20,
        marginBottom: 6,
        backgroundColor: "#3F51B5",
        alignItems: "center",
        width: "98%",
        height: 78,
        borderRadius: 4,
        padding: 10,
        display: "flex",
        flexDirection: "row",
        marginRight: "1%",
    },
    addTransaction: {
        width: "100%",
        height: 40,
        marginTop: 30,
        borderRadius: 6,
        backgroundColor: "blue",
        display: "flex",
        alignItems: "center",
    },
    addTransactionText: {
        color: "white",
        paddingTop: 10,
        fontWeight: "bold",
    },
    notesContainer: {
        marginTop: 5,
        backgroundColor: "#3F51B5",
        width: "98%",
        borderRadius: 4,
        paddingTop: 7,
        paddingLeft: 44,
        display: "flex",
        flexDirection: "row",
        height: 36,
    },
    feeContainer: {
        marginTop: 20,
        backgroundColor: "#3F51B5",
        width: "98%",
        borderRadius: 4,
        paddingTop: 7,
        paddingLeft: 44,
        display: "flex",
        flexDirection: "row",
        height: 36,
    },
    dateFeesAndNotes: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
    },
    notesPlaceholder: {
        marginTop: 20,
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: 0.7,
        width: 220,
        height: 70,
        borderRadius: 4,
        paddingLeft: 10,
    },
    feePlaceholder: {
        marginTop: 20,
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: 0.7,
        width: 220,
        height: 25,
        borderRadius: 4,
        paddingLeft: 10,
    },
    addFeeText: {
        fontSize: 15,
        color: "#F75626",
        width: "50%",
        marginLeft: "15%",
        fontWeight: "bold",
    },
    backIconAndText: {
        height: 35,
        paddingTop: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: 'space-between',
        backgroundColor: "white",
        width: "100%",
    },
    icon: {
        width: 20,
    },
    buttonClose: {
        backgroundColor: "#3F51B5",
        padding: 5,
        borderRadius: 50,
        width: 105,
        marginTop: 40,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        paddingTop: 10,
        height: 200,
        width: 250,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderColor: '#eff2f5',
        borderWidth: 2
    },
    notesModalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        paddingTop: 10,
        height: 230,
        width: 250,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderColor: '#eff2f5',
        borderWidth: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight: "bold",
    },
    transferContainer: {
        backgroundColor: "white",
        height: "100%",
    },
    coinContainer: {
        backgroundColor: "#eff2f5",
        marginTop: 15,
        borderRadius: 6,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    quantityAndPrice: {
        marginTop: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    placeholder: {
        backgroundColor: "white",
        width: "100%",
        borderColor: "black",
        borderWidth: 0.7,
        height: 35,
        borderRadius: 4,
        paddingLeft: 10,
    },
    dateView: {
        width: "50%",
        marginRight: "1%",
    },
    feeAndNotesView: {
        width: "50%",
    },
    timeText: {
        display: "flex",
        color: "white",
        fontWeight: "bold",
        alignSelf: "center",
    },
    quantityError: {
        backgroundColor: "#fff6f8",
        borderColor: "#8B0000",
        borderWidth: 1,
        width: "100%",
        height: 35,
        borderRadius: 4,
        paddingLeft: 10,
    },
    quantityErrorText: {
        color: "red",
        marginTop: 2,
        fontSize: 11,
    },
});
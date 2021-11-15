import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { FontAwesome5, AntDesign, SimpleLineIcons, Fontisto, EvilIcons } from '@expo/vector-icons';
import moment from 'moment';
import { LoginContext } from '../../context/context';
import { API } from '../../services/apiService';
import CalendarPicker from 'react-native-calendar-picker';

export default function BuyTransaction() {
    const [notemodalVisible, setNoteModalVisible] = useState(false);
    const [feeModalVisible, setFeeModalVisible] = useState(false);
    const [dateModalVisible, setDateModalVisible] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState(null)
    const [buyFee, setBuyFee] = useState('')
    const [buyNotes, setBuyNotes] = useState('')

    let { setSymbol, quantity, fee, setPricePercentage, coinName, pricePerCoin, setFee, setQuantity, setPricePerCoin, setDate, quantityError, setQuantityError, notes, setNotes } = useContext(LoginContext)

    useEffect(() => {
        let params = {
            coin_id: coinName
        };
        (async () => {
            const coinEventResult = await API.request('assetsTable', undefined, 'POST', null, null, null, null, params)
            setSymbol(coinEventResult[0].symbol)
            setDate(moment().format('Do MMM YYYY h:mm a'))
            setPricePercentage(coinEventResult[0].price_change_percentage_24h)
        })()
    }, [])

    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
    const today = moment().format("YYYY-MM-DD");
    const onChangeDateAndTime = () => {
        setDate(startDate ? moment(`${startDate}`).format('Do MMM YYYY') + moment().format(' h:mm a') : moment().format('Do MMM YYYY h:mm a'))
        setDateModalVisible(!dateModalVisible)
    }
    const onDateChange = (date) => {
        setSelectedStartDate(date)
    }
    const removeDecimals = (num) => {
        let decimals = num.split('.')
        return decimals[0]
    }
    const addDecimals = (num) => {
        if (!num) return num
        num = num.toString()
        let decimals = num.split('.')
        if (decimals[1] && decimals[1].length == 0 || !decimals[1]) {
            return `${num}.00`
        } else {
            if (decimals[1].length == 1) {
                return `${num}0`
            } else if (decimals[1].length > 2) {
                const factorOfTen = Math.pow(10, 2)
                num = Math.round(num * factorOfTen) / factorOfTen
            }
        }
        return num.toString()
    }
    const quantityBuyTransaction = (text) => {
        var reg = /^-?\d+\.?\d*$/
        if (reg.test(text)) {
            setQuantity(text)
            setQuantityError(false)
        }
        if (text == '') {
            setQuantity(text)
            setQuantityError(false)
        }
    }
    const FeeBuyTransction = (text) => {
        var reg = /^-?\d+\.?\d*$/
        if (reg.test(text)) {
            setBuyFee(text)
        }
        if (text == '') {
            setBuyFee(text)
        }
    }
    const BuyTransactionPrice =
        pricePerCoin &&
        parseFloat(pricePerCoin.toString().replace(/,/g, '')).toString();
    const calculatedFee = (fee) ? parseFloat(fee) == 'NaN' ? 0 : parseFloat(fee) : 0
    const totalSpent = pricePerCoin && parseFloat(pricePerCoin.toString().replace(/,/g, '')) * parseFloat(quantity) + parseFloat(calculatedFee);
    const totalSpentValue = totalSpent > 0 ? totalSpent.toFixed(2) : '0'
    return (
        <View>
            <View style={style.buyContainer}>
                <View style={style.quantityAndPrice}>
                    <View style={style.quantity}>
                        <Text style={style.quantityText}>Quantity</Text>
                        <TextInput keyboardType={'numeric'} maxLength={9} value={quantity} onChangeText={(text) => quantityBuyTransaction(text)} style={quantityError != '' ? style.quantityError : style.placeholder} placeholder={'0.00'}></TextInput>
                        {quantityError != "" ? <Text style={style.quantityErrorText}>{quantityError}</Text> : null}
                    </View>
                    <View style={style.price}>
                        <Text style={style.pricePerCoinText}>Price Per Coin</Text>
                        <TextInput keyboardType={'numeric'} value={BuyTransactionPrice} onChangeText={(text) => setPricePerCoin(text)} style={style.placeholder}></TextInput>
                    </View>
                </View>
                <View style={style.dateFeesAndNotes}>
                    <View style={style.dateView}>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => setDateModalVisible(true)}>
                            <View style={style.dateContainer}>
                                <Fontisto style={style.calendarIcon} name="calendar" size={26} color="white" />
                                {startDate ? <View>
                                    <Text style={style.dateText}>{moment(`${startDate}`).format('Do MMM YYYY')}</Text>
                                    <Text style={style.timeText}>{moment().format(' h:mm a')}</Text></View> :
                                    <View>
                                        <Text style={style.dateText}>{moment().format('Do MMM YYYY')} </Text>
                                        <Text style={style.timeText}>{moment().format(' h:mm a')}</Text>
                                    </View>}
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={style.feeAndNotes}>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => { setBuyFee(removeDecimals(fee)); setFeeModalVisible(true) }}>
                            <View style={style.feeContainer}>
                                <FontAwesome5 name='coins' size={18} color='white' />
                                {fee ? <Text style={style.feeText}>${addDecimals(fee)}</Text> : <Text style={style.feeText}>FEE</Text>}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => { setBuyNotes(notes); setNoteModalVisible(true) }}>
                            <View style={style.notesContainer}>
                                <SimpleLineIcons name='note' size={18} color='white' />
                                <Text style={style.notesText}>NOTES</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={style.totalSpent}>
                    <Text style={style.totalSpentText}>Total Spent</Text>
                    <Text style={style.totalSpentPlaceholder} >$ {totalSpentValue}</Text>
                </View>
                <View style={style.centeredView}>
                    <Modal
                        animationType='slide'
                        transparent={true}
                        visible={dateModalVisible}
                        onRequestClose={() => {
                            setDateModalVisible(!dateModalVisible)
                        }}
                    >
                        <View style={style.centeredView}>
                            <View style={style.dateModalView}>
                                <View style={style.backIconAndText}>
                                    <Text style={style.dateAndTimeText}>Date & Time</Text>
                                    <TouchableOpacity activeOpacity={0.9} style={style.popupCross} onPress={() => setDateModalVisible(!dateModalVisible)}>
                                        <EvilIcons name='close' size={24} color='black' />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <CalendarPicker
                                        onDateChange={onDateChange}
                                        maxDate={today}
                                        selectedDayColor='#3861fb'
                                        selectedDayTextColor='white'
                                        positio
                                        height={350}
                                        width={350}
                                    />
                                    <TouchableOpacity activeOpacity={0.9} onPress={onChangeDateAndTime} >
                                        <View style={style.changeDateAndTimeContainer}>
                                            <Text style={style.changeDateAndTimeText}>Update Date</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View style={style.centeredView}>
                    <Modal
                        animationType='slide'
                        transparent={true}
                        visible={feeModalVisible}
                        onRequestClose={() => {
                            setFeeModalVisible(!feeModalVisible)
                        }}
                    >
                        <View style={style.centeredView}>
                            <View style={style.feeModalView}>
                                <View style={style.backIconAndText1}>
                                    <Text style={style.addFeeAndNoteText}>Add Fee</Text>
                                    <TouchableOpacity activeOpacity={0.9} onPress={() => setFeeModalVisible(!feeModalVisible)}>
                                        <EvilIcons style={style.popupCross} name='close' size={24} color='black' />
                                    </TouchableOpacity>
                                </View>
                                <TextInput maxLength={9} keyboardType={'numeric'} value={buyFee} onChangeText={(text) => FeeBuyTransction(text)} placeholder='$' style={style.feePlaceholder}></TextInput>
                                <TouchableOpacity activeOpacity={0.9}
                                    style={style.buttonClose}
                                    onPress={() => { setFeeModalVisible(!feeModalVisible); setFee(addDecimals(buyFee)) }}
                                >
                                    <Text style={style.textStyle}>Add Fee</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View style={style.centeredView}>
                    <Modal
                        animationType='slide'
                        transparent={true}
                        visible={notemodalVisible}
                        onRequestClose={() => {
                            setNoteModalVisible(!notemodalVisible);
                        }}
                    >
                        <View style={style.centeredView}>
                            <View style={style.notesModalView}>
                                <View style={style.backIconAndText1}>
                                    <Text style={style.addFeeAndNoteText}>Add Note</Text>
                                    <TouchableOpacity activeOpacity={0.9} onPress={() => setNoteModalVisible(!notemodalVisible)}>
                                        <EvilIcons style={style.popupCross} name='close' size={24} color='black' />
                                    </TouchableOpacity>
                                </View>
                                <TextInput placeholder='Add notes here...!' value={buyNotes} onChangeText={setBuyNotes} style={style.notesPlaceholder}></TextInput>
                                <TouchableOpacity activeOpacity={0.9}
                                    style={style.buttonClose}
                                    onPress={() => { setNotes(buyNotes); setNoteModalVisible(!notemodalVisible) }}
                                >
                                    <Text style={style.textStyle}>Add Note</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </View>
    )
}
const style = StyleSheet.create({
    popupCross: {
        marginRight: 12
    },
    changeDateAndTimeText: {
        color: 'white',
        paddingTop: 8,
        fontWeight: 'bold'
    },
    changeDateAndTimeContainer: {
        width: 170,
        height: 35,
        borderRadius: 50,
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#3F51B5',
        marginTop: 20
    },
    quantityText: {
        marginBottom: 3
    },
    pricePerCoinText: {
        marginBottom: 3
    },
    calendarIcon: {
        marginTop: 10,
        marginRight: 15
    },
    addTransaction: {
        width: '100%',
        height: 40,
        marginTop: 30,
        borderRadius: 6,
        backgroundColor: 'blue',
        display: 'flex',
        alignItems: 'center'
    },
    notesText: {
        fontSize: 15,
        marginLeft: 15,
        color: 'white',
        fontWeight: "bold"
    },
    feeText: {
        fontSize: 15,
        marginLeft: 15,
        color: 'white',
        fontWeight: "bold"
    },
    dateText: {
        fontSize: 14,
        color: 'white',
        fontWeight: "bold"
    },
    timeText: {
        display: 'flex',
        alignSelf: 'center',
        color: 'white',
        fontWeight: "bold"
    },
    dateAndTimeText: {
        fontSize: 17,
        color: '#F75626',
        width: '50%',
        marginLeft: '3%',
        fontWeight: 'bold'
    },
    addTransactionText: {
        color: 'white',
        paddingTop: 10,
        fontWeight: 'bold'
    },
    totalSpentPlaceholder: {
        marginRight: "14%",
        fontSize: 18,
        fontWeight: "bold",
        color: '#F75626'
    },
    totalSpentText: {
        marginLeft: "4%",
        padding: 1,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "left",
    },
    notesContainer: {
        marginTop: 5,
        backgroundColor: '#3F51B5',
        width: '100%',
        borderRadius: 6,
        padding: 10,
        paddingLeft: 30,
        display: 'flex',
        flexDirection: 'row',
    },
    feeContainer: {
        marginTop: 19,
        backgroundColor: '#3F51B5',
        width: '100%',
        height: 38,
        borderRadius: 6,
        paddingTop: 10,
        paddingLeft: 30,
        display: 'flex',
        flexDirection: 'row',
    },
    dateContainer: {
        marginTop: 20,
        backgroundColor: '#3F51B5',
        alignItems: 'center',
        width: '98%',
        height: 80,
        borderRadius: 6,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        marginRight: '1%'
    },
    dateFeesAndNotes: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%'
    },
    notesPlaceholder: {
        marginTop: 20,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 0.7,
        width: 220,
        height: 70,
        borderRadius: 4,
        paddingLeft: 10
    },
    feePlaceholder: {
        marginTop: 20,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 0.7,
        width: 220, height: 25,
        borderRadius: 4,
        paddingLeft: 10
    },
    addFeeAndNoteText: {
        fontSize: 15,
        color: '#F75626',
        width: '50%',
        fontWeight: 'bold',
        marginLeft: 20
    },
    backIconAndText: {
        height: 35,
        paddingTop: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        width: '100%',
        marginBottom: 10
    },
    backIconAndText1: {
        height: 35,
        paddingTop: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        width: '100%',
    },
    Icon: {
        width: 20
    },
    buttonClose: {
        backgroundColor: '#3F51B5',
        padding: 5,
        borderRadius: 50,
        width: 120,
        alignSelf: 'center',
        marginTop: 40
    },
    dateButtonClose: {
        backgroundColor: '#2196F3',
        padding: 5,
        borderRadius: 4,
        width: 250,
        marginTop: '90%'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22
    },
    feeModalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingTop: 10,
        height: 200,
        width: 250,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderColor: '#eff2f5',
        borderWidth: 2
    },
    dateModalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingLeft: 10,
        paddingTop: 10,
        height: 430,
        width: 350,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderColor: '#eff2f5',
        borderWidth: 2
    },
    notesModalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingTop: 10,
        height: 230,
        width: 250,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderColor: '#eff2f5',
        borderWidth: 2
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    buyContainer: {
        backgroundColor: 'white',
        height: '100%'
    },
    totalSpent: {
        backgroundColor: "#FFFFFF",
        height: 50,
        padding: 10,
        borderRadius: 6,
        display: "flex",
        flexDirection: "row",
        marginTop: 20,
        justifyContent: "space-around",
    },
    quantityAndPrice: {
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    placeholder: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 0.7,
        width: '98%',
        height: 35,
        borderRadius: 4,
        paddingLeft: 10
    },
    dateView: {
        width: '49%',
        justifyContent: 'center'
    },
    feeAndNotes: {
        width: '49%'
    },
    quantity: {
        width: '50%'
    },
    price: {
        width: '50%'
    },
    quantityError: {
        backgroundColor: '#fff6f8',
        borderColor: '#8B0000',
        borderWidth: 1,
        width: '100%',
        height: 35,
        borderRadius: 4,
        paddingLeft: 10
    },
    quantityErrorText: {
        color: 'red',
        marginTop: 2,
        fontSize: 11
    }
})
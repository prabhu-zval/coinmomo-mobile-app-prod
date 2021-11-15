import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome5, AntDesign, SimpleLineIcons, Fontisto, EvilIcons } from '@expo/vector-icons';
import moment from 'moment';
import { LoginContext } from '../../context/context';
import { API } from '../../services/apiService';
import CalendarPicker from 'react-native-calendar-picker';

export default function TransferTransaction() {
    let { currentTab, setSymbol, setPricePercentage, coinName, setFee, quantity, setQuantity, setDate, setCurrentTab, fee, quantityError, setQuantityError, notes, setNotes } = useContext(LoginContext)

    const [feeModalVisible, setFeeModalVisible] = useState(false);
    const [noteModalVisible, setNoteModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState("Transfer In");
    const [dateModalVisible, setDateModalVisible] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState(null)
    const [transferFee, setTransferFee] = useState('')
    const [transferNotes, setTransferNotes] = useState('')

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
    const quantityTransferTransaction = (text) => {
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
    const feeTransferTransaction = (text) => {
        var reg = /^-?\d+\.?\d*$/
        if (reg.test(text)) {
            setTransferFee(text)
        }
        if (text == '') {
            setTransferFee(text)
        }
    }
    return (
        <View style={style.transferContainer}>
            <View style={style.quantityAndPrice}>
                <Text style={style.transferText}>Transfer</Text>
                <View style={style.pickerViewContainer}>
                    <Picker
                        selectedValue={currentTab}
                        style={style.pickerContainer}
                        onValueChange={(itemValue, itemIndex) => { setCurrentTab(itemValue) }}
                    >
                        <Picker.Item label='Transfer In' value='Transfer In' />
                        <Picker.Item label='Transfer Out' value='Transfer Out' />
                    </Picker>

                </View>
                <View style={style.quantityContainer}>
                    <Text style={style.quantityText}>Quantity</Text>
                    <TextInput keyboardType={'numeric'} maxLength={9} value={quantity} onChangeText={(text) => quantityTransferTransaction(text)} style={quantityError != '' ? style.quantityError : style.placeholder} placeholder={'0.00'}></TextInput>
                    {quantityError != "" ? <Text style={style.quantityErrorText}>{quantityError}</Text> : null}
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
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { setTransferFee(removeDecimals(fee)); setFeeModalVisible(true) }}>
                        <View style={style.feeContainer}>
                            <FontAwesome5 name='coins' size={18} color='white' />
                            {fee ? <Text style={style.feeText}>${addDecimals(fee)}</Text> : <Text style={style.feeText}>FEE</Text>}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { setTransferNotes(notes); setNoteModalVisible(true) }}>
                        <View style={style.notesContainer}>
                            <SimpleLineIcons name='note' size={18} color='white' />
                            <Text style={style.notesText}>NOTES</Text>
                        </View>
                    </TouchableOpacity>
                </View>
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
                                <TouchableOpacity activeOpacity={0.9} style={{}} onPress={() => setDateModalVisible(!dateModalVisible)}>
                                    <EvilIcons style={style.popupCross} name='close' size={24} color='black' />
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
                        setFeeModalVisible(!feeModalVisible);
                    }}
                >
                    <View style={style.centeredView}>
                        <View style={style.modalView}>
                            <View style={style.backIconAndText1}>
                                <Text style={style.addFeeText}>Add Fee</Text>
                                <TouchableOpacity activeOpacity={0.9} onPress={() => setFeeModalVisible(!feeModalVisible)}>
                                    <EvilIcons style={style.popupCross} name='close' size={24} color='black' />
                                </TouchableOpacity>
                            </View>
                            <TextInput maxLength={9} keyboardType={'numeric'} value={transferFee} onChangeText={(text) => feeTransferTransaction(text)} placeholder='$' style={style.feePlaceholder}></TextInput>
                            <TouchableOpacity activeOpacity={0.9}
                                style={style.buttonClose}
                                onPress={() => { setFeeModalVisible(!feeModalVisible); setFee(addDecimals(transferFee)) }}
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
                    visible={noteModalVisible}
                    onRequestClose={() => {
                        setNoteModalVisible(!noteModalVisible);
                    }}
                >
                    <View style={style.centeredView}>
                        <View style={style.notesModalView}>
                            <View style={style.backIconAndText1}>
                                <Text style={style.addFeeText}>Add Note</Text>
                                <TouchableOpacity activeOpacity={0.9} onPress={() => setNoteModalVisible(!noteModalVisible)}>
                                    <EvilIcons style={style.popupCross} name='close' size={24} color='black' />
                                </TouchableOpacity>
                            </View>
                            <TextInput placeholder='Add notes here...!' value={transferNotes} onChangeText={setTransferNotes} style={style.notesPlaceholder}></TextInput>
                            <TouchableOpacity activeOpacity={0.9}
                                style={style.buttonClose}
                                onPress={() => { setNotes(transferNotes); setNoteModalVisible(!noteModalVisible) }}
                            >
                                <Text style={style.textStyle}>Add Note</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View >
    )
}
const style = StyleSheet.create({
    popupCross: {
        marginRight: 12
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
    feeText: {
        fontSize: 15,
        marginLeft: '10%',
        color: 'white',
        fontWeight: 'bold'
    },
    pickerContainer: {
        height: 35,
        width: '100%'
    },
    changeDateAndTimeText: {
        color: 'white',
        paddingTop: 8,
        fontWeight: 'bold'
    },
    quantityContainer: {
        marginTop: 10
    },
    notesText: {
        fontSize: 15,
        marginLeft: '10%',
        color: 'white',
        fontWeight: 'bold'
    },
    quantityText: {
        marginBottom: 3
    },
    calendarIcon: {
        marginTop: 10,
        marginRight: 15
    },
    pickerViewContainer: {
        borderColor: 'black',
        borderWidth: 0.5,
        borderBottomWidth: 0.7
    },
    transferText: {
        marginBottom: 3
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
    dateAndTimeText: {
        fontSize: 17,
        color: '#F75626',
        width: '50%',
        marginLeft: '3%',
        fontWeight: 'bold'
    },
    dateText: {
        paddingLeft: 1,
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold'
    },
    timeText: {
        display: 'flex',
        alignSelf: 'center',
        color: 'white',
        fontWeight: 'bold'
    },
    dateContainer: {
        marginTop: 20,
        backgroundColor: '#3F51B5',
        width: '98%',
        height: 80,
        borderRadius: 6,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
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
    addTransactionText: {
        color: 'white',
        paddingTop: 10,
        fontWeight: 'bold'
    },
    notesContainer: {
        marginTop: 5,
        backgroundColor: '#3F51B5',
        width: '100%',
        height: 38,
        borderRadius: 6,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: 30
    },
    feeContainer: {
        marginTop: 20,
        borderRadius: 6,
        backgroundColor: '#3F51B5',
        width: '100%',
        height: 38,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: 30
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
    addFeeText: {
        fontSize: 15,
        color: '#F75626',
        width: '50%',
        marginLeft: '15%',
        fontWeight: 'bold'
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
        width: '100%'
    },
    icon: {
        width: 20
    },
    buttonClose: {
        backgroundColor: '#3F51B5',
        padding: 5,
        borderRadius: 50,
        width: 105,
        marginTop: 40
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22
    },
    modalView: {
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
    transferContainer: {
        backgroundColor: 'white',
        height: '100%'
    },
    coinContainer: {
        backgroundColor: '#eff2f5',
        marginTop: 15,
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    totalSpent: {
        backgroundColor: '#eff2f5',
        marginTop: 15,
        height: 70
    },
    quantityAndPrice: {
        marginTop: 20,
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    placeholder: {
        backgroundColor: 'white',
        width: '100%',
        borderColor: 'black',
        borderWidth: 0.7,
        height: 35,
        borderRadius: 4,
        paddingLeft: 10
    },
    dateView: {
        width: '50%'
    },
    feeAndNotes: {
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
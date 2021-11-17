import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TouchableHighlight, Modal, TextInput, Pressable, Picker, Image, ScrollView } from 'react-native';
import { AntDesign, Ionicons, Feather, MaterialIcons, EvilIcons, FontAwesome5, SimpleLineIcons, Fontisto } from '@expo/vector-icons';
import moment from 'moment';
import { API } from '../../services/apiService';
import { LoginContext } from '../../context/context';
import { CoinTransactionTabs } from '../headerMenus/headerMenus';
import CalendarPicker from 'react-native-calendar-picker';

export default function PortfolioTransactions(props) {
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [AddEditModalVisible, setAddEditModalVisible] = useState(false);
    const [feeModalVisible, setFeeModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [noteModalVisible, setNoteModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState("Transfer In");
    const [dateModalVisible, setDateModalVisible] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState(null)
    const [coinTransactions, setCoinTransactions] = useState([])
    const [transactionId, setTransactionId] = useState(null)
    const [transactionDelete, setTransactionDelete] = useState(null)
    const [isNoData, setIsNoData] = useState(false);
    const [activityIndicator, setActivityIndicator] = useState(false)
    const [transactionNotes, setTransactionsNotes] = useState('')
    const [transactionFee, setTransactionFee] = useState('')
    const [counter, setCounter] = useState(0)
    const [popupBackground, setPopupBackground] = useState(false);
    const [activityIndication, setActivityIndication] = useState(false);
    const { quantity, notes, setNotes, setPricePerCoin, setQuantity, transactions, setCurrentTab, setTransactions, currentTab, fee, setFee, symbol, pricePercentage, coinName, pricePerCoin, date, setDate, showData, setShowData, quantityError, setQuantityError, transactionImage, userSigninId, currentprice, setCurrentPrice } = useContext(LoginContext)

    useEffect(() => {
        (async () => {
            setIsNoData(false)
            setActivityIndicator(true)
            let transactions = await API.request('findTransactions', undefined, 'POST', null, null, null, null, {
                user_id: userSigninId,
                coin_id: coinName,
                portfolio_id: props.route.params.portfolio_id
            })
            let params = {
                coin_id: coinName
            };
            const coinEventResult = await API.request('assetsTable', undefined, 'POST', null, null, null, null, params)
            setCoinTransactions(transactions)
            setCurrentPrice(coinEventResult[0].current_price)
            setActivityIndicator(false)
            if (transactions.length == 0) {
                setIsNoData(true)
            }
        })()
    }, [])
    const updateAssets = (transactions) => {
        if (transactions.length == 0) {
            let currentCoinData = showData.filter((data) => data.id == coinName)
            currentCoinData = currentCoinData[0]
            let showDataCopy = showData
            showDataCopy.splice(showData.indexOf(currentCoinData), 1)
            setShowData(showDataCopy)
        } else {
            let currentCoinData = showData.filter((data) => data.id == coinName)
            currentCoinData = currentCoinData[0]
            let convertedPrice = parseFloat(pricePerCoin.toString().replace(/,/g, ''))
            let transactionquantity = 0, amount = 0, pnl = 0
            transactions.forEach((f) => {
                if (f.type == 'Buy') {
                    transactionquantity += f.quantity ? (parseFloat(f.quantity)) : 0
                    pnl = currentCoinData.pnl + (parseFloat(f.quantity) * transactions[0].current_price - parseFloat(f.quantity) * f.pricePerCoin)
                } else if (f.type == 'Sell') {
                    transactionquantity -= f.quantity ? (parseFloat(f.quantity)) : 0
                    pnl = currentCoinData.pnl - (parseFloat(f.quantity) * transactions[0].current_price - parseFloat(f.quantity) * f.pricePerCoin)
                } else if (f.type == 'Transfer In') {
                    transactionquantity += f.quantity ? (parseFloat(f.quantity)) : 0
                    pnl = currentCoinData.pnl + (parseFloat(f.quantity) * transactions[0].current_price - parseFloat(f.quantity) * f.pricePerCoin)
                } else {
                    transactionquantity -= f.quantity ? (parseFloat(f.quantity)) : 0
                    pnl = currentCoinData.pnl - (parseFloat(f.quantity) * transactions[0].current_price - parseFloat(f.quantity) * f.pricePerCoin)
                }
                amount += f.Amount
            })
            let showDataCopy = showData
            showDataCopy.splice(showData.indexOf(currentCoinData), 1, {
                ...currentCoinData,
                quantity: transactionquantity,
                holdings: currentCoinData.current_price * transactionquantity,
                pnl: pnl,
                pnlPercentage: (pnl / amount) * 100
            })
            setShowData(showDataCopy)
        }
    }
    const TransactionEditModal = (type, _id, transactionQuantity, transactionPricePerCoin, transactionDate, transactionFee, transactionNotes) => {
        setCounter(0)
        setQuantity(transactionQuantity)
        setPricePerCoin(transactionPricePerCoin)
        setDate(transactionDate)
        setFee(transactionFee)
        setCurrentTab(type)
        setQuantityError(false)
        setNotes(transactionNotes)
        if (type == 'Transfer In') {
            setTransactionId(_id)
            setAddEditModalVisible(false)
            setEditModalVisible(true)
        } if (type == 'Buy') {
            setTransactionId(_id)
            setAddEditModalVisible(true)
            setEditModalVisible(false)
        } if (type == 'Transfer Out') {
            setTransactionId(_id)
            setAddEditModalVisible(false)
            setEditModalVisible(true)
        } if (type == 'Sell') {
            setTransactionId(_id)
            setAddEditModalVisible(true)
            setEditModalVisible(false)
        }
    }
    const openModal = async () => {
        setCounter(0)
        setCurrentTab('Buy')
        setQuantity('')
        setFee('')
        setNotes('')
        setQuantityError(false)
        setModalVisible(true)
        setPricePerCoin(currentprice)
    }
    const onTransactionClose = () => {
        setModalVisible(!modalVisible)
        setCurrentTab("Buy")
    }
    const deleteTransaction = async (id) => {
        setDeleteModalVisible(false)
        setPopupBackground(false)
        setActivityIndication(true)
        let params = {
            id: transactionDelete,
            coin_id: coinName,
            user_id: userSigninId,
            portfolio_id: props.route.params.portfolio_id
        }
        let edit = await API.request('deleteTransactions', undefined, 'POST', null, null, null, null, params, null)
        let transactions = await API.request('findTransactions', undefined, 'POST', null, null, null, null, {
            user_id: userSigninId,
            coin_id: coinName,
            portfolio_id: props.route.params.portfolio_id
        })
        if (transactions.length == 0) {
            setIsNoData(true)
            props.navigation.navigate('portfolioAssets')
            let currentCoinData = showData.filter((data) => data.id == coinName)
            currentCoinData = currentCoinData[0]
            let showDataCopy = showData
            showDataCopy.splice(showData.indexOf(currentCoinData), 1)
            setShowData(showDataCopy)
        }
        else {
            let currentCoinData = showData.filter((data) => data.id == coinName)
            currentCoinData = currentCoinData[0]
            let transactionquantity = 0, amount = 0, pnl = 0
            transactions.forEach((f) => {
                if (f.type == 'Buy') {
                    transactionquantity += f.quantity ? (parseFloat(f.quantity)) : 0
                    pnl = pnl + (parseFloat(f.quantity) * f.current_price - parseFloat(f.quantity) * f.pricePerCoin)
                } else if (f.type == 'Sell') {
                    transactionquantity -= f.quantity ? (parseFloat(f.quantity)) : 0
                    pnl = pnl - (parseFloat(f.quantity) * f.current_price - parseFloat(f.quantity) * f.pricePerCoin)
                } else if (f.type == 'Transfer In') {
                    transactionquantity += f.quantity ? (parseFloat(f.quantity)) : 0
                    pnl = pnl + (parseFloat(f.quantity) * f.current_price - parseFloat(f.quantity) * f.pricePerCoin)
                } else {
                    transactionquantity -= f.quantity ? (parseFloat(f.quantity)) : 0
                    pnl = pnl - (parseFloat(f.quantity) * f.current_price - parseFloat(f.quantity) * f.pricePerCoin)
                }
                amount += f.Amount
            })
            let showDataCopy = showData
            showDataCopy.splice(showData.indexOf(currentCoinData), 1, {
                ...currentCoinData,
                quantity: transactionquantity,
                holdings: currentCoinData.current_price * transactionquantity,
                pnl: pnl,
                pnlPercentage: (pnl / amount) * 100
            })
            setShowData(showDataCopy)
        }
        setCoinTransactions(transactions)
        setActivityIndication(false)
    }
    const onEditTransaction = async () => {
        if (!quantity) {
            setQuantityError('quantity is required')
            return
        }
        else if (parseFloat(quantity) < 0.1) {
            setQuantityError('value should be greater than zero')
            return
        }
        setAddEditModalVisible(false)
        setEditModalVisible(false)
        setPopupBackground(false)
        setActivityIndication(true)
        let convertedPrice = parseFloat(pricePerCoin.toString().replace(/,/g, ''))
        let params = {
            id: transactionId,
            data_obj: {
                quantity: parseFloat(quantity),
                pricePerCoin: convertedPrice,
                date: date,
                fee: fee,
                type: currentTab
            }
        }
        let edit = await API.request('updateTransactions', undefined, 'POST', null, null, null, null, null, params)
        let transactions = await API.request('findTransactions', undefined, 'POST', null, null, null, null, {
            user_id: userSigninId,
            coin_id: coinName,
            portfolio_id: props.route.params.portfolio_id
        })
        setCoinTransactions(transactions)
        let currentCoinData = showData.filter((data) => data.id == coinName)
        currentCoinData = currentCoinData[0]
        let transactionquantity = 0, amount = 0, pnl = 0
        transactions.forEach((f) => {
            if (f.type == 'Buy') {
                transactionquantity += f.quantity ? (parseFloat(f.quantity)) : 0
                pnl = pnl + (parseFloat(f.quantity) * f.current_price - parseFloat(f.quantity) * f.pricePerCoin)
            } else if (f.type == 'Sell') {
                transactionquantity -= f.quantity ? (parseFloat(f.quantity)) : 0
                pnl = pnl - (parseFloat(f.quantity) * f.current_price - parseFloat(f.quantity) * f.pricePerCoin)
            } else if (f.type == 'Transfer In') {
                transactionquantity += f.quantity ? (parseFloat(f.quantity)) : 0
                pnl = pnl + (parseFloat(f.quantity) * f.current_price - parseFloat(f.quantity) * f.pricePerCoin)
            } else {
                transactionquantity -= f.quantity ? (parseFloat(f.quantity)) : 0
                pnl = pnl - (parseFloat(f.quantity) * f.current_price - parseFloat(f.quantity) * f.pricePerCoin)
            }
            amount += f.Amount
        })
        let showDataCopy = showData
        showDataCopy.splice(showData.indexOf(currentCoinData), 1, {
            ...currentCoinData,
            quantity: transactionquantity,
            holdings: currentCoinData.current_price * transactionquantity,
            pnl: pnl,
            pnlPercentage: (pnl / amount) * 100
        })
        setShowData(showDataCopy)
        setActivityIndication(false)
    }
    const onAddTransaction = async () => {
        if (!quantity) {
            setQuantityError('quantity is required')
            return
        }
        else if (parseFloat(quantity) < 0.1) {
            setQuantityError('value should be greater than zero')
            return
        }
        setModalVisible(false)
        setPopupBackground(false)
        setActivityIndication(true)
        let count = counter
        count = count + 1
        setCounter(count)
        let convertedPrice = parseFloat(pricePerCoin.toString().replace(/,/g, ''))
        if (counter == 0) {
            setTransactions([...transactions, { notes: notes, fee: fee, symbol: symbol, pricePercentage: pricePercentage, type: currentTab, quantity: quantity, coinName: coinName, date: date, pricePerCoin: convertedPrice, Amount: parseFloat(quantity) * convertedPrice }])
            setCoinTransactions([...coinTransactions, { notes: notes, fee: fee, symbol: symbol, pricePercentage: pricePercentage, type: currentTab, quantity: quantity, coinName: coinName, date: date, pricePerCoin: convertedPrice, Amount: parseFloat(quantity) * convertedPrice }])
            const addTransaction = await API.request('insertTransactions', undefined, 'POST', null, null, null, null, null, {
                data_obj: JSON.stringify({
                    coin_id: coinName,
                    user_id: userSigninId,
                    type: currentTab,
                    pricePerCoin: convertedPrice,
                    pricePercentage: pricePercentage,
                    symbol: symbol,
                    Amount: quantity * convertedPrice,
                    fee: fee,
                    quantity: quantity,
                    notes: notes,
                    date: date,
                    portfolio_id: props.route.params.portfolio_id,
                    current_price: currentprice
                })
            })
        }
        setIsNoData(false)
        updateAssets([...coinTransactions, { notes: notes, fee: fee, symbol: symbol, pricePercentage: pricePercentage, type: currentTab, quantity: quantity, coinName: coinName, date: date, pricePerCoin: convertedPrice, Amount: parseFloat(quantity) * convertedPrice }])
        setActivityIndication(false)
    }
    const onDateChange = (date) => {
        setDate(date ? moment(date).format('Do MMM YYYY') + moment().format(' h:mm a') : moment().format('Do MMM YYYY h:mm a'))
        setSelectedStartDate(date)
    }
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
    const today = moment().format("YYYY-MM-DD");
    const sellBuyPrice =
        pricePerCoin &&
        parseFloat(pricePerCoin.toString().replace(/,/g, '')).toString();
    const calculatedFee = (fee) ? parseFloat(fee) == 'NaN' ? 0 : parseFloat(fee) : 0
    const totalSpent = pricePerCoin && parseFloat(pricePerCoin.toString().replace(/,/g, '')) * parseFloat(quantity) + parseFloat(calculatedFee);
    const totalSpentValue = totalSpent > 0 ? totalSpent.toFixed(2) : '0'
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
    const quantityTransferFunction = (text) => {
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
    const setTrnsferBuySellFeeFunction = (text) => {
        var reg = /^-?\d+\.?\d*$/
        if (reg.test(text)) {
            setTransactionFee(text)
        }
        if (text == '') {
            setTransactionFee(text)
        }
    }
    const quantityBuySellFunction = (text) => {
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
    return (
        <View style={style.transactionOverview}>
            {popupBackground ? <View style={style.popupBackground}></View> : null}
            {activityIndication ? <View style={style.activityIndicationView}>
                <View style={style.loading}></View>
                <ActivityIndicator style={style.activityIndication} size='large' color='blue'></ActivityIndicator>
            </View> : null}
            <View style={style.IconAndText}>
                <Text style={style.TransactionOverviewText}><Image style={style.image} source={{ uri: transactionImage }} /> {symbol.toUpperCase()} - Transaction</Text>
            </View>
            <TouchableOpacity activeOpacity={0.9} style={style.addTransactionContainer} onPress={() => { openModal(); setPopupBackground(true); }}>
                <View style={style.addTransactionView} >
                    <Ionicons name='add' size={20} color='white' />
                    <Text style={style.addTransactionText}>Add Transaction</Text>
                </View>
            </TouchableOpacity>
            <View style={style.Heading}>
                <Text style={style.allHeading}>Type</Text>
                <Text style={style.allHeading}>Price</Text>
                <Text style={style.allHeading}>24H</Text>
                <Text style={style.allHeading}>Amount</Text>
                <Text style={style.allHeading}>QTY</Text>
                <Text style={style.allHeading}>Fees</Text>
            </View>
            <View style={style.activityIndicatorView}>
                {activityIndicator ? <ActivityIndicator style={style.activityIndicator} size='large' color='blue'></ActivityIndicator> : null}
            </View>
            {isNoData ? <View style={style.noDataText}><Text>NO DATA AVAILABLE</Text></View> : <View></View>}
            <View>
                <ScrollView>
                    <View style={style.transactionView}>
                        {coinTransactions.length > 0 && coinTransactions.map((val, index) => (
                            <View key={index} style={[style.market, { backgroundColor: index % 2 == 0 ? 'white' : '#e6e6e6' }]}>
                                <View style={style.type}>
                                    <Text style={style.titles}>Type</Text>
                                    <Text style={style.typeText}>{val.type}</Text>
                                    <Text style={style.titles}>Date</Text>
                                    <Text numberOfLines={3} style={style.tableDateText}>{val.date}</Text>
                                </View>
                                <View style={style.price}>
                                    <Text style={style.titles}>Price</Text>
                                    <Text style={style.textPrice} numberOfLines={1}>${val.pricePerCoin && parseFloat(val.pricePerCoin).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
                                    <Text style={style.titles}>24H</Text>
                                    {val.pricePercentage ? val.pricePercentage > 0 ? <Text style={style.bottomText} numberOfLines={1}>{val.pricePercentage.toFixed(2)}%</Text> : <Text style={style.negativeBottomText} numberOfLines={1}>{val.pricePercentage.toFixed(2)}%</Text> : null}
                                </View>
                                <View style={style.amount}>
                                    <Text style={style.titles}>Amount</Text>
                                    <Text style={style.textPrice} numberOfLines={1} >${(val.pricePerCoin * val.quantity).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
                                    <View>
                                        <View style={style.qtyAndFee}>
                                            <View style={style.valueSpace1}>
                                                <Text style={style.titles}>QTY</Text>
                                                {val.type == "Buy" || val.type == "Transfer In" ? <Text style={style.bottomText} numberOfLines={1} >{val.quantity}</Text> : <Text style={style.negativeBottomText} numberOfLines={1} >-{val.quantity}</Text>}
                                            </View>
                                            <View style={style.valueSpace}>
                                                <Text style={style.titles}>Fee</Text>
                                                {val.fee ? <Text style={style.text} numberOfLines={1} >${val.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text> : <Text style={style.text} numberOfLines={1} >0</Text>}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={style.fee}>
                                    <TouchableOpacity activeOpacity={0.9} style={style.editCoinContainerInner1} onPress={() => { TransactionEditModal(val.type, val._id, val.quantity, val.pricePerCoin, val.date, val.fee, val.notes); setPopupBackground(true); }} >
                                        <Feather style={style.actionEdit} name="edit-3" size={20} color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={0.9} style={style.editCoinContainerInner} onPress={() => { setDeleteModalVisible(true); setTransactionDelete(val._id); setPopupBackground(true); }}>
                                        <MaterialIcons style={style.actionDelete} name="delete-outline" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
            <View>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={deleteModalVisible}
                    onRequestClose={() => {
                        setDeleteModalVisible(!deleteModalVisible);
                        setPopupBackground(false);
                    }}
                >
                    <View style={style.deleteCenteredView}>
                        <View style={style.deleteModalView}>
                            <Text style={style.modalText}>Do you want to delete this transaction?</Text>
                            <View style={style.buttons}>
                                <TouchableOpacity activeOpacity={0.9}
                                    style={[style.button, style.buttonClose]}
                                    onPress={() => { deleteTransaction(); }}
                                >
                                    <Text style={style.textStyle}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.9}
                                    style={[style.button, style.buttonClose]}
                                    onPress={() => { setDeleteModalVisible(!deleteModalVisible); setPopupBackground(false); }}
                                >
                                    <Text style={style.textStyle}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            <View style={style.centeredView}>
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={dateModalVisible}
                    onRequestClose={() => {
                        setDateModalVisible(!dateModalVisible);
                    }}
                >
                    <View style={style.centeredView}>
                        <View style={style.dateModalView}>
                            <View style={style.backIconAndText1}>
                                <Text style={style.dateAndTimeText}>Date & Time</Text>
                                <TouchableOpacity activeOpacity={0.9} onPress={() => { setDateModalVisible(!dateModalVisible); }}>
                                    <EvilIcons style={{ marginRight: 12 }} name='close' size={24} color='black' />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <CalendarPicker
                                    onDateChange={onDateChange}
                                    maxDate={today}
                                    selectedDayColor='#3861fb'
                                    selectedDayTextColor='white'
                                    height={350}
                                    width={350}
                                />
                                <TouchableOpacity activeOpacity={0.9} onPress={() => { setDateModalVisible(!dateModalVisible); }} >
                                    <View style={style.changeDateAndTimeContainer}>
                                        <Text style={style.changeDateAndTimeText}>Update Date</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            <View>
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                        setPopupBackground(false);
                    }}
                >
                    <View style={style.centeredView}>
                        <View style={style.addTransactionmodalView}>
                            <View style={style.transactionTabs}>
                                <View style={style.headerlabels}>
                                    <Text style={style.addTransaction}>Add Transaction</Text>
                                    <EvilIcons onPress={() => { setPopupBackground(false); onTransactionClose(); }} name='close' size={24} color='black' />
                                </View>
                                <CoinTransactionTabs />
                            </View>
                            <TouchableOpacity activeOpacity={0.9}
                                style={style.addTransactionbuttonClose}
                                onPress={() => { onAddTransaction(); }}
                            >
                                <Text style={style.textStyle}>Confirm Transaction</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
            <View>
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={editModalVisible}
                    onRequestClose={() => {
                        setEditModalVisible(!editModalVisible);
                        setPopupBackground(false);
                    }}
                >
                    <View style={style.centeredView}>
                        <View style={style.editTransfermodalView}>
                            <View style={style.headerlabelsContainer}>
                                <View style={style.headerlabels}>
                                    <Text style={style.editTransaction}>Edit Transaction</Text>
                                    <EvilIcons onPress={() => { setPopupBackground(false); setEditModalVisible(!editModalVisible); }} name='close' size={24} color='black' />
                                </View>
                                <View style={style.quantityAndPrice}>
                                    <View style={style.pickerContainer}>
                                        <Picker
                                            selectedValue={selectedValue}
                                            style={style.picker}
                                            onValueChange={(itemValue, itemIndex) => { setSelectedValue(itemValue); setCurrentTab(itemValue) }}
                                        >
                                            <Picker.Item label='Transfer In' value='Transfer In' />
                                            <Picker.Item label='Transfer Out' value='Transfer Out' />
                                        </Picker>
                                    </View>
                                    <View style={style.quantityText}>
                                        <Text>Quantity</Text>
                                        <TextInput keyboardType={'numeric'} maxLength={9} value={quantity} onChangeText={(text) => quantityTransferFunction(text)} style={quantityError != '' ? style.quantityError : style.placeholder} placeholder={'0.00'}></TextInput>
                                        {quantityError != "" ? <Text style={style.quantityErrorText}>{quantityError}</Text> : null}
                                    </View>
                                    <View style={style.dateFeesAndNotes}>
                                        <View style={style.dateView}>
                                            <TouchableOpacity activeOpacity={0.9} onPress={() => { setDateModalVisible(true); }}>
                                                <View style={style.dateContainer}>
                                                    <Fontisto style={style.calendarIcon} name="calendar" size={26} color="black" />
                                                    <View style={{flexDirection: 'column'}}>
                                                        <Text style={style.dateText}>{date.substr(0, 14)}</Text>
                                                        <Text style={style.timeText}>{date.substr(14,)}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={style.feeAndNotes}>
                                            <TouchableOpacity activeOpacity={0.9} onPress={() => { setTransactionFee(removeDecimals(fee)); setFeeModalVisible(true); }}>
                                                <View style={style.feeContainer}>
                                                    <FontAwesome5 name='coins' size={18} color='black' />
                                                    {fee ? <Text style={style.feeText}>${addDecimals(fee)}</Text> : <Text style={style.feeText}>FEE</Text>}
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity activeOpacity={0.9} onPress={() => { setTransactionsNotes(notes); setNoteModalVisible(true); }}>
                                                <View style={style.notesContainer}>
                                                    <SimpleLineIcons name='note' size={18} color='black' />
                                                    <Text style={style.notesText}>NOTES</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity activeOpacity={0.9} onPress={() => { onEditTransaction(); }}>
                                    <View style={style.editTransactionContainer}>
                                        <Text style={style.editTransactionText}>Update Transaction</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            <View>
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={AddEditModalVisible}
                    onRequestClose={() => {
                        setAddEditModalVisible(!AddEditModalVisible);
                        setPopupBackground(false);
                    }}
                >
                    <View style={style.centeredView}>
                        <View style={style.modalView}>
                            <View style={style.headerlabelsContainer}>
                                <View style={style.headerlabels}>
                                    <Text style={style.editTransaction}>Edit Transaction</Text>
                                    <EvilIcons onPress={() => { setAddEditModalVisible(!AddEditModalVisible); setPopupBackground(false); }} name='close' size={24} color='black' />
                                </View>
                                <View style={style.quantityAndPrice}>
                                    <View style={style.quantityText}>
                                        <Text style={{ marginBottom: 5 }}>Quantity</Text>
                                        <TextInput keyboardType={'numeric'} maxLength={9} value={quantity} onChangeText={(text) => quantityBuySellFunction(text)} style={quantityError != '' ? style.quantityError : style.placeholder} placeholder={'0.00'}></TextInput>
                                        {quantityError != "" ? <Text style={style.quantityErrorText}>{quantityError}</Text> : null}
                                        <View style={{ marginBottom: 10 }}>
                                            <Text style={style.pricePerCoinText}>Price Per Coin</Text>
                                            <TextInput value={sellBuyPrice} onChangeText={(text) => setPricePerCoin(text)} style={style.coinplaceholder} placeholder='$32,550'></TextInput>
                                        </View>
                                    </View>
                                    <View style={style.dateFeesAndNotes}>
                                        <View style={style.dateView}>
                                            <TouchableOpacity activeOpacity={0.9} onPress={() => { setDateModalVisible(true); }}>
                                                <View style={style.dateContainer}>
                                                    <Fontisto style={style.calendarIcon} name="calendar" size={26} color="white" />
                                                    <View style={{flexDirection: 'column'}}>
                                                        <Text style={style.dateText}>{date.substr(0, 13)}</Text>
                                                        <Text style={style.timeText}>{date.substr(13,)}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={style.feeAndNotes}>
                                            <TouchableOpacity activeOpacity={0.9} onPress={() => { setTransactionFee(removeDecimals(fee));; setFeeModalVisible(true) }}>
                                                <View style={style.feeContainer}>
                                                    <FontAwesome5 name='coins' size={18} color='white' />
                                                    {fee ? <Text style={style.feeText}>${addDecimals(fee)}</Text> : <Text style={style.feeText}>FEE</Text>}
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity activeOpacity={0.9} onPress={() => { setTransactionsNotes(notes); setNoteModalVisible(true) }}>
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
                                    <TouchableOpacity activeOpacity={0.9} onPress={() => { onEditTransaction(); }}>
                                        <View style={style.editTransactionContainer1}>
                                            <Text style={style.editTransactionText}>Update Transaction</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
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
                            <View style={style.backIconAndText}>
                                <Text style={style.addFeeText}>Add Note</Text>
                                <TouchableOpacity activeOpacity={0.9} onPress={() => setNoteModalVisible(!noteModalVisible)}>
                                    <EvilIcons style={{ marginRight: 12 }} name='close' size={24} color='black' />
                                </TouchableOpacity>
                            </View>
                            <TextInput value={transactionNotes} onChangeText={(text) => setTransactionsNotes(text)} placeholder='Add notes here...!' style={style.notesPlaceholder}></TextInput>
                            <TouchableOpacity activeOpacity={0.9}
                                style={style.buttonClose}
                                onPress={() => { setNotes(transactionNotes); setNoteModalVisible(!noteModalVisible) }}
                            >
                                <Text style={style.textStyle}>Add Note</Text>
                            </TouchableOpacity>
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
                        <View style={style.feeModalView}>
                            <View style={style.backIconAndText}>
                                <Text style={style.addFeeText}>Add Fee</Text>
                                <TouchableOpacity activeOpacity={0.9} onPress={() => setFeeModalVisible(!feeModalVisible)}>
                                    <EvilIcons style={{ marginRight: 12 }} name='close' size={24} color='black' />
                                </TouchableOpacity>
                            </View>
                            <TextInput value={fee} maxLength={9} value={transactionFee} onChangeText={(text) => setTrnsferBuySellFeeFunction(text)} style={style.feePlaceholder}></TextInput>
                            <TouchableOpacity activeOpacity={0.9}
                                style={style.buttonClose}
                                onPress={() => { setFeeModalVisible(!feeModalVisible); setFee(addDecimals(transactionFee)) }}
                            >
                                <Text style={style.textStyle}>Add Fee</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    )
}
const style = StyleSheet.create({
    activityIndication: {
        position: 'absolute',
        elevation: 2,
        height: "100%",
        width: "100%"
    },
    activityIndicationView: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    loading: {
        elevation: 2,
        backgroundColor: "black",
        opacity: 0.3,
        height: "100%",
        width: "100%",
    },
    qtyAndFee: {
        flexDirection: 'row'
    },
    valueSpace: {
        width: '60%'
    },
    valueSpace1: {
        width: '40%'
    },
    editCoinContainerInner: {
        width: 40,
        height: 40,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3F51B5',
        borderRadius: 50,
        display: 'flex',
        elevation: 5
    },
    editCoinContainerInner1: {
        width: 40,
        height: 40,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3F51B5',
        borderRadius: 50,
        display: 'flex',
        elevation: 5
    },
    titles: {
        color: '#7d7d7d',
        fontWeight: 'bold',
        marginBottom: 3
    },
    allHeading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    },
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
    pricePerCoinText: {
        marginTop: 10,
        marginBottom: 5
    },
    transactionView: {
        paddingBottom: '45%'
    },
    negativeBottomText: {
        color: 'red',
        fontSize: 14,
        fontWeight: 'bold'
    },
    noDataText: {
        display: 'flex',
        marginTop: '30%',
        alignItems: 'center'
    },
    activityIndicatorView: {
        display: 'flex',
        justifyContent: 'center'
    },
    activityIndicator: {
        marginTop: 50,
        marginBottom: 20
    },
    modalText: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: '3%'
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%'
    },
    editTransactionContainer: {
        width: '100%',
        height: 35,
        backgroundColor: '#3F51B5',
        borderRadius: 10,
        marginTop: 15
    },
    editTransactionContainer1: {
        width: '50%',
        height: 35,
        backgroundColor: '#3F51B5',
        borderRadius: 50,
        marginTop: 10,
        alignSelf: 'center'
    },
    calendarIcon: {
        marginTop: '2%',
        marginRight: '8%'
    },
    feeText: {
        fontSize: 15,
        marginLeft: '10%',
        color: 'white',
        fontWeight: 'bold'
    },
    notesText: {
        fontSize: 15,
        marginLeft: '10%',
        color: 'white',
        fontWeight: 'bold'
    },
    quantityText: {
        marginTop: 10
    },
    headerlabelsContainer: {
        width: '100%'
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
    changeDateAndTimeText: {
        color: 'white',
        paddingTop: 8,
        fontWeight: 'bold'
    },
    dateModalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingLeft: 10,
        paddingTop: 10,
        height: 400,
        width: 350,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    dateText: {
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold'
    },
    dateContainer: {
        marginTop: 10,
        backgroundColor: '#3F51B5',
        width: '98%',
        height: 80,
        borderRadius: 6,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
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
        elevation: 5
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
    addFeeText: {
        fontSize: 15,
        color: '#F75626',
        width: '50%',
        marginLeft: '15%',
        fontWeight: 'bold',
    },
    icon: {
        width: 20
    },
    backIconAndText: {
        height: 35,
        paddingTop: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        width: '100%'
    },
    backIconAndText1: {
        height: 35,
        paddingTop: 10,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: 'white',
        width: '100%',
        marginBottom: 10
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
        elevation: 5
    },
    picker: {
        height: 35,
        width: '100%'
    },
    pickerContainer: {
        borderColor: 'black',
        borderWidth: 0.5
    },
    dateFeesAndNotes: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%'
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
    totalSpent: {
        backgroundColor: "#FFFFFF",
        height: 50,
        padding: 10,
        borderRadius: 6,
        display: "flex",
        flexDirection: "row",
        marginTop: 15,
        justifyContent: "space-around",
    },
    notesContainer: {
        marginTop: 4,
        backgroundColor: '#3F51B5',
        width: '100%',
        height: 38,
        padding: 10,
        paddingLeft: 30,
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'row'
    },
    dateAndTimeText: {
        fontSize: 17,
        color: '#F75626',
        width: '50%',
        marginLeft: '3%',
        fontWeight: 'bold'
    },
    feeContainer: {
        marginTop: 10,
        backgroundColor: '#3F51B5',
        width: '100%',
        height: 38,
        padding: 10,
        paddingLeft: 30,
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'row'
    },
    placeholder: {
        width: '100%',
        height: 35,
        backgroundColor: '#eff2f5',
        borderBottomColor: '#F75626',
        borderBottomWidth: 1.4,
        paddingLeft: 10
    },
    coinplaceholder: {
        width: '100%',
        height: 35,
        backgroundColor: '#eff2f5',
        borderBottomColor: '#F75626',
        borderBottomWidth: 1.3,
        paddingLeft: 10
    },
    quantityAndPrice: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    transactionOverview: {
        height: '100%',
    },
    headerlabels: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    transactionTabs: {
        height: 350,
        width: '100%'
    },
    addTransaction: {
        fontWeight: 'bold',
        color: '#F75626',
        fontSize: 18,
    },
    editTransactionText: {
        fontWeight: 'bold',
        color: 'white',
        padding: 8,
        textAlign: 'center'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22
    },
    deleteCenteredView: {
        flex: 1,
        marginTop: '55%',
        alignItems: 'center'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        height: 435,
        width: '98%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    deleteModalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: '9%',
        height: 180,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    editTransfermodalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        height: 350,
        width: '98%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    addTransactionmodalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 15,
        paddingTop: 25,
        height: 440,
        width: '96%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    buttonClose: {
        backgroundColor: '#3F51B5',
        padding: 5,
        borderRadius: 50,
        width: 105,
        marginTop: 40
    },
    addTransactionbuttonClose: {
        backgroundColor: '#3F51B5',
        padding: 10,
        marginTop: '1%',
        borderRadius: 50,
        width: '50%'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    text: {
        width: '90%',
        color: '#2b2b2b',
        fontSize: 14,
        fontWeight: 'bold'
    },
    textPrice: {
        width: '90%',
        color: '#2b2b2b',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10
    },
    typeText: {
        fontSize: 14,
        color: '#2b2b2b',
        fontWeight: 'bold',
        marginBottom: 10
    },
    market: {
        display: 'flex',
        flexDirection: 'row',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: '2%'
    },
    type: {
        width: '27.5%',
        marginLeft: '1%'
    },
    bottomText: {
        color: 'green',
        fontWeight: 'bold',
        fontSize: 14
    },
    tableDateText: {
        width: '90%',
        color: 'black',
        fontSize: 11,
        fontWeight: 'bold'
    },
    price: {
        width: '27%',
        display: 'flex'
    },
    amount: {
        width: '29%',
        display: 'flex'
    },
    fee: {
        width: '15%',
        justifyContent: 'space-evenly'
    },
    IconAndText: {
        marginTop: 25,
        height: 60,
        paddingTop: 20,
        display: 'flex',
        borderBottomWidth: 0.5,
        borderBottomColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white'
    },
    action: {
        width: '10%',
        alignItems: 'center',
        paddingTop: '1%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    icon: {
        width: 40,
        paddingLeft: 10
    },
    Heading: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#F75626',
        paddingVertical: '3%',
        marginTop: '2%'
    },
    TransactionOverviewText: {
        fontSize: 20,
        color: 'black',
        zIndex: -1,
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 14,
        fontWeight: 'bold'
    },
    typeHeading: {
        backgroundColor: '#F75626',
        height: 50,
        paddingTop: 15,
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        width: '26%'
    },
    priceHeading: {
        fontSize: 15,
        display: 'flex',
        height: 50,
        paddingTop: 15,
        color: 'white',
        fontWeight: 'bold',
        width: '21%',
        textAlign: 'center'
    },
    feeHeading: {
        fontSize: 15,
        display: 'flex',
        height: 50,
        paddingTop: 15,
        color: 'white',
        fontWeight: 'bold',
        width: '21%',
        textAlign: 'center'
    },
    amountHeading: {
        fontSize: 15,
        display: 'flex',
        height: 50,
        paddingTop: 15,
        color: 'white',
        fontWeight: 'bold',
        width: '21%',
        textAlign: 'center'
    },
    addTransactionContainer: {
        alignItems: 'center',
        backgroundColor: '#3F51B5',
        alignSelf: 'flex-end',
        borderRadius: 50,
        display: 'flex',
        flexDirection: 'row',
        marginTop: '2.2%',
        marginRight: '4%'
    },
    addTransactionView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: '3%',
        marginVertical: '1.5%'
    },
    addTransactionText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold'
    },
    editTransaction: {
        fontWeight: 'bold',
        color: '#F75626',
        fontSize: 18
    },
    dateView: {
        width: '50%',
    },
    feeAndNotes: {
        width: '50%'
    },
    timeText: {
        display: 'flex',
        alignSelf: 'center',
        color: 'white',
        fontWeight: 'bold',
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
    },
    image: {
        height: 25,
        width: 25
    }
})
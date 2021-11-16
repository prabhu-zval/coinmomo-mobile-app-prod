import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Modal, Pressable, LogBox, ScrollView, TextInput, Keyboard, TouchableHighlight } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { AntDesign, Entypo, Ionicons, EvilIcons, MaterialIcons } from '@expo/vector-icons';
import { API } from '../../services/apiService'
import { LoginContext } from '../../context/context';
import { TransactionTabs } from '../headerMenus/headerMenus';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default function PortfolioAssets(props) {
    const { setQuantity, setAssetsData, showData, notes, setShowData, setSymbol, setPricePercentage, currentTab, setCurrentTab, quantity, pricePerCoin, setPricePerCoin, fee, setFee, date, coinName, setCoinName, pricePercentage, symbol, setQuantityError, setTransactionImage, setNotes, userSigninId, setAssetsCoin, setAssetsCoinImage, setAssetsCoinId } = useContext(LoginContext)
    const [modalVisible, setModalVisible] = useState(false);
    const [coinModalVisible, setCoinModalVisible] = useState(false);
    const [activityIndicator, setActivityIndicator] = useState(false);
    const [reload, setReload] = useState(true);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [state, setState] = useState(null);
    const [isNoData, setIsNoData] = useState(false);
    const [coinLoading, setCoinLoading] = useState(false)
    const [counter, setCounter] = useState(0)
    const isFocused = useIsFocused();
    const [coinDataloading, setCoinDataLoading] = useState(false)
    const [noCoinData, setNoCoinData] = useState(false)
    const [coinImage, setCoinImage] = useState(null)
    const [coinRenderData, setCoinRenderData] = useState(null)
    const [coinInputValue, setCoinInputValue] = useState(null)
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [portfolio, setPortfolio] = useState('')
    const [edit, setEdit] = useState('')
    const [visible, setVisible] = useState('');
    const [portfolioName, setPortfolioName] = useState('')
    const toggleMenu = (portfolioName) => setVisible(portfolioName);
    const [popupBackground, setPopupBackground] = useState(false);
    const [activityIndication, setActivityIndication] = useState(false);
    const { portfolioData, setPortfolioData } = useContext(LoginContext)
    let id = props.route.params.portfolio_id;

    useEffect(() => {
        (async () => {
            setPortfolioName(props.route.params.portfolio_name)
            setCurrentTab("Buy")
            if (!showData.length) {
                if (id)
                    setActivityIndicator(true)
                setIsNoData(false)
                let assets = await API.request('findAssets', undefined, 'POST', null, null, null, null, null, {
                    user_id: userSigninId,
                    portfolio_id: id
                })
                let showDataCopy = []
                for (let i = 0; i < assets.length; i++) {
                    let asset = assets[i]
                    let params = {
                        coin_id: asset.coin_id
                    };
                    let currentCoinTransactions = await API.request('findTransactions', undefined, 'POST', null, null, null, null, {
                        user_id: userSigninId,
                        portfolio_id: id,
                        coin_id: asset.coin_id
                    })
                    let quantity = 0, amount = 0, Pnl = 0
                    currentCoinTransactions.length > 0 && currentCoinTransactions.forEach((f) => {
                        if (f.type == 'Buy') {
                            quantity += f.quantity ? (parseFloat(f.quantity)) : 0
                            Pnl = Pnl + (parseFloat(f.quantity) * parseFloat(f.current_price) - parseFloat(f.quantity) * parseFloat(f.pricePerCoin))
                        } else if (f.type == 'Sell') {
                            quantity -= f.quantity ? (parseFloat(f.quantity)) : 0
                            Pnl = Pnl - (parseFloat(f.quantity) * parseFloat(f.current_price) - parseFloat(f.quantity) * parseFloat(f.pricePerCoin))
                        } else if (f.type == 'Transfer In') {
                            quantity += f.quantity ? (parseFloat(f.quantity)) : 0
                            Pnl = Pnl + (parseFloat(f.quantity) * parseFloat(f.current_price) - parseFloat(f.quantity) * parseFloat(f.pricePerCoin))
                        } else {
                            quantity -= f.quantity ? (parseFloat(f.quantity)) : 0
                            Pnl = Pnl - (parseFloat(f.quantity) * parseFloat(f.current_price) - parseFloat(f.quantity) * parseFloat(f.pricePerCoin))
                        }
                        amount += f.Amount
                    })
                    const coinEventResult = await API.request('assetsTable', undefined, 'POST', null, null, null, null, params)
                    let p = coinEventResult[0].current_price * quantity - amount
                    showDataCopy.push(
                        {
                            ...coinEventResult[0],
                            quantity,
                            amount,
                            holdings: coinEventResult[0].current_price * quantity,
                            pnl: Pnl,
                            pnlPercentage: (Pnl / amount) * 100
                        }
                    )
                }
                LogBox.ignoreLogs(["Encountered two children with the same key, `abc-chain`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version"])
                LogBox.ignoreLogs(["TypeError: undefined is not an object (evaluating 'coinEventResult[0].symbol')"])
                setShowData(showDataCopy)
                setActivityIndicator(false)
                if (!assets.length) {
                    setIsNoData(true);
                    setPopupBackground(true);
                    setCoinModalVisible(true);
                }
            } else {
                setIsNoData(false)
            }
            const params = {
                q: "a"
            }
            const coinItems = await API.request('fetchCoins', undefined, 'GET', null, null, null, null, params)
            const suggestions = coinItems.map((item, index) => ({
                price: item.current_price,
                id: item.id,
                title: item.name + ` (${item.symbol.toUpperCase()})`,
                image: item.image,
                symbol: item.symbol
            }))
            setCoinRenderData(suggestions)
        })();
    }, [isFocused, reload]);
    const onNextPage = (name, nextPageCoinsymbol, nextPagepricePercentage, nextPricePerCoin, Image) => {
        setCoinName(name)
        setPricePerCoin(nextPricePerCoin)
        setSymbol(nextPageCoinsymbol)
        setPricePercentage(nextPagepricePercentage)
        setTransactionImage(Image)
        props.navigation.navigate("transactionOverview", { portfolio_id: id })
    }
    const addCoin = (item, coinName, image, price) => {
        openTransactionModal(item, price, coinName, image)
        setCoinModalVisible(!coinModalVisible)
    }
    const onTransactionClose = () => {
        setCoinModalVisible(!coinModalVisible)
        setPopupBackground(false)
        setCurrentTab('Buy')
    }
    const openTransactionModal = (coinId, price, coinName, image) => {
        setQuantity('')
        setPricePerCoin(price)
        setCoinName({ coinId, coinName, image })
        setCounter(0)
        setFee('')
        setNotes('')
        setQuantityError(false)
        setModalVisible(true)
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
        setIsNoData(false)
        let convertedPrice = parseFloat(pricePerCoin.toString().replace(/,/g, ''))
        let totalCount = counter
        totalCount = totalCount + 1
        setCounter(totalCount)
        let currentCoinPrice;
        if (counter == 0) {
            if (coinName.coinId) {
                let isCoinNameExist = false
                let index = 0
                showData.every((coin, i) => {
                    if (coin.id == coinName.coinId) {
                        isCoinNameExist = true
                        index = i
                        return false
                    }
                    return true
                })
                let showDataCopy = [...showData]
                if (isCoinNameExist) {
                    let params = {
                        coin_id: coinName.coinId
                    };
                    const coinEventResult = await API.request('assetsTable', undefined, 'POST', null, null, null, null, params)
                    currentCoinPrice = coinEventResult[0].current_price
                    let calculate = () => {
                        if (currentTab == 'Buy') {
                            return showDataCopy[index].quantity ? (parseFloat(showDataCopy[index].quantity) + parseFloat(quantity)) : parseFloat(quantity)
                        } else if (currentTab == 'Sell') {
                            return showDataCopy[index].quantity ? (parseFloat(showDataCopy[index].quantity) - parseFloat(quantity)) : -parseFloat(quantity)
                        } else if (currentTab == 'Transfer In') {
                            return showDataCopy[index].quantity ? (parseFloat(showDataCopy[index].quantity) + parseFloat(quantity)) : parseFloat(quantity)
                        } else {
                            return showDataCopy[index].quantity ? (parseFloat(showDataCopy[index].quantity) - parseFloat(quantity)) : -parseFloat(quantity)
                        }
                    }
                    let amount = 0, pnl = 0
                    if (currentTab == 'Buy') {
                        amount = showDataCopy[index].amount + quantity * convertedPrice
                        pnl = showDataCopy[index].pnl + (quantity * showDataCopy[index].current_price - quantity * convertedPrice)
                    }
                    else if (currentTab == 'Transfer In') {
                        amount = showDataCopy[index].amount + quantity * convertedPrice
                        pnl = showDataCopy[index].pnl + (quantity * showDataCopy[index].current_price - quantity * convertedPrice)
                    }
                    else {
                        amount = showDataCopy[index].amount + quantity * convertedPrice
                        pnl = showDataCopy[index].pnl - (quantity * showDataCopy[index].current_price - quantity * convertedPrice)
                    }
                    showDataCopy[index] = {
                        ...showDataCopy[index],
                        holdings: showDataCopy[index].quantity ? (calculate()) * showDataCopy[index].current_price : parseFloat(quantity) * showDataCopy[index].current_price,
                        quantity: calculate(),
                        pricePerCoin: convertedPrice,
                        date: date,
                        pnl: pnl,
                        pnlPercentage: (pnl / amount) * 100
                    }
                    setShowData(showDataCopy)
                }
                else {
                    let params = {
                        coin_id: coinName.coinId
                    };
                    const coinEventResult = await API.request('assetsTable', undefined, 'POST', null, null, null, null, params)
                    currentCoinPrice = coinEventResult[0].current_price
                    coinEventResult[0].holdings = currentTab == 'Sell' || currentTab == 'Transfer Out' ? -parseFloat(quantity) * parseFloat(coinEventResult[0].current_price) : parseFloat(quantity) * parseFloat(coinEventResult[0].current_price)
                    coinEventResult[0].quantity = currentTab == 'Sell' || currentTab == 'Transfer Out' ? -quantity : quantity
                    coinEventResult[0].pricePerCoin = parseFloat(pricePerCoin)
                    coinEventResult[0].date = date
                    coinEventResult[0].amount = quantity * convertedPrice
                    coinEventResult[0].pnl = parseFloat(quantity) * parseFloat(coinEventResult[0].current_price) - convertedPrice * parseFloat(quantity)
                    coinEventResult[0].pnlPercentage = ((parseFloat(quantity) * parseFloat(coinEventResult[0].current_price) - convertedPrice * parseFloat(quantity)) / (convertedPrice * parseFloat(quantity))) * 100
                    setShowData((prev) => [...prev, coinEventResult[0]])
                }
            }
            let assets = await API.request('findAssets', undefined, 'POST', null, null, null, null, {
                user_id: userSigninId,
                coin_id: coinName.coinId,
                portfolio_id: id
            })
            let assetsParam = {
                data_obj: JSON.stringify({
                    coin_id: coinName.coinId,
                    user_id: userSigninId,
                    portfolio_id: id
                })
            }
            const insertAssets = await API.request('insertAssets', undefined, 'POST', null, null, null, null, null, assetsParam)
            let r = !reload
            setReload(r)
            const addTransaction = await API.request('insertTransactions', undefined, 'POST', null, null, null, null, null, {
                data_obj: JSON.stringify({
                    coin_id: coinName.coinId,
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
                    portfolio_id: id,
                    current_price: currentCoinPrice
                })
            })
        }
        setIsNoData(false)
        setActivityIndication(false)
    }
    const onChangeCoinTextFunction = (q) => {
        setCoinRenderData(null)
        setCoinDataLoading(true)
        setNoCoinData(false)
        if (q) {
            const params = {
                q: q
            }
            API.request('fetchCoins', undefined, 'GET', null, null, null, null, params)
                .then((result) => {
                    let data = result && result.map((item, index) => ({
                        price: item.current_price,
                        id: item.id,
                        title: item.name + ` (${item.symbol.toUpperCase()})`,
                        image: item.image,
                        symbol: item.symbol
                    }));
                    setCoinRenderData(data)
                    setCoinDataLoading(false)
                    if (data.length == 0) {
                        setNoCoinData(true)
                    }
                }
                )
        }
        else {
            setCoinRenderData(null)
            setCoinDataLoading(null)
        }
    }
    const onEditPortfolio = async () => {
        setEditModalVisible(!editModalVisible);
        setPopupBackground(false);
        if (!portfolioName) return
        let params = {
            name: portfolioName,
            id: edit
        }
        const Edit = await API.request('editPortfolio', undefined, 'POST', null, null, null, null, null, params)
        let currentCoinData = portfolioData.filter((data) => data._id == edit)
        currentCoinData = currentCoinData[0]
        let showDataCopy = portfolioData
        showDataCopy.splice(portfolioData.indexOf(currentCoinData), 1, {
            ...currentCoinData,
            name: portfolioName
        })
        setPortfolioData(() => [...showDataCopy])
    }
    const deleteAssets = async (id) => {
        setDeleteModalVisible(false)
        setPopupBackground(false)
        setActivityIndication(true)
        let params = {
            user_id: userSigninId,
            coin_id: state,
            portfolio_id: id
        }
        let deleteAssets = await API.request('deleteAssets', undefined, 'POST', null, null, null, null, null, params)
        let currentCoinData = showData.filter((data) => data.id == state)
        currentCoinData = currentCoinData[0]
        let showDataCopy = showData
        showDataCopy.splice(showData.indexOf(currentCoinData), 1)
        setShowData(showDataCopy)
        setReload(!reload)
        setActivityIndication(false)
    }
    const addDecimals = (num) => {
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
    return (
        <View style={style.portfolioAssets}>
            {popupBackground ? <View style={style.popupBackground}></View> : null}
            {activityIndication ? <View style={style.activityIndicationView}>
                <View style={style.loading}></View>
                <ActivityIndicator style={style.activityIndication} size='large' color='blue'></ActivityIndicator>
            </View> : null}
            <View style={style.backIconAndText}>
                <Text style={style.yourAssetsText}>Your Assets</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <AntDesign onPress={() => { setPopupBackground(true); setEditModalVisible(true); toggleMenu(''); toggleMenu(portfolioName); setVisible(true); setPortfolio(portfolioName); setEdit(id); }} name="edit" size={24} color="black" style={{ marginTop: 20, marginLeft: 10 }} />
                <View style={style.nameContainer}>
                    <Text ellipsizeMode='tail' numberOfLines={1} style={style.portfolioName}>{portfolioName}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.9} style={style.addCoinContainer} onPress={() => { setPopupBackground(true); setCoinModalVisible(true); setCurrentTab('Buy'); setCoinInputValue(null), setCoinRenderData(null); setCoinImage(null); onChangeCoinTextFunction('a'); }}>
                    <View style={style.addCoinView}>
                        <Ionicons style={style.addCoinIcon} name='add' size={20} color='white' />
                        <Text style={style.addCoinText}>Add Coin</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={style.Heading}>
                <Text style={style.allHeading}>Coin</Text>
                <Text style={style.allHeading}>Price</Text>
                <Text style={style.allHeading}>24H</Text>
                <Text style={style.allHeading}>Holdings</Text>
                <Text style={style.allHeading}>QTY</Text>
                <Text style={style.allHeading}>PNL(%)</Text>
            </View>
            <View style={style.activityIndicatorView}>
                {activityIndicator ? <ActivityIndicator style={style.activityIndicator} size='large' color='blue'></ActivityIndicator> : null}
            </View>
            {isNoData ? <View style={style.noDataText}><Text>NO DATA AVAILABLE</Text></View> : <View></View>}
            <View>
                <ScrollView>
                    <View style={style.assetsView}>
                        {showData.map((val, index) => (
                            <TouchableHighlight underlayColor='lightblue' key={index} onPress={() => { onNextPage(val.id, val.symbol, val.price_change_percentage_24h, val.current_price, val.image) }}>
                                <View style={[style.market, { backgroundColor: index % 2 == 0 ? 'white' : '#e6e6e6' }]}>
                                    <View style={style.iconAndText}>
                                        <Text style={style.titles}>Coin</Text>
                                        <View style={style.textAlignment}>
                                            <Image style={style.marketImage} source={{ uri: val.image }} />
                                            <Text numberOfLines={1} style={style.symbolText}>{val.symbol && val.symbol.toUpperCase()}</Text>
                                        </View>
                                        <Text style={style.titles}>Price</Text>
                                        <Text style={style.valueText} numberOfLines={1}>${val.current_price && val.current_price.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
                                    </View>
                                    <View style={style.price}>
                                        <Text style={style.titles}>24H</Text>
                                        {val.price_change_percentage_24h ? val.price_change_percentage_24h > 0 ? <Text style={style.bottomText} numberOfLines={1} >{val.price_change_percentage_24h ? val.price_change_percentage_24h.toFixed(2) : ''}%</Text> : <Text style={style.negativeBottomText} numberOfLines={1} >{val.price_change_percentage_24h ? val.price_change_percentage_24h.toFixed(2) : ''}%</Text> : null}
                                        <Text style={style.titleHolding}>Holdings</Text>
                                        {val.holdings >= 0 ? <Text style={style.valueText} numberOfLines={1} >${val.holdings.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text> : <Text style={style.valueText} numberOfLines={1} >-${(-1 * val.holdings).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>}
                                    </View>
                                    <View style={style.holdings}>
                                        <Text style={style.titles}>Quantity</Text>
                                        <Text style={val.quantity > 0 ? style.bottomText : style.negativeBottomText} numberOfLines={1}>{val.quantity}</Text>
                                        <View style={style.pnlPercent}>
                                            <Text style={style.titlePnl}>PNL</Text>
                                            {val.pnlPercentage ? val.pnlPercentage > 0 ? <Text style={style.bottomText} numberOfLines={1} >{val.pnlPercentage.toFixed(2)}%</Text> : <Text style={style.negativeBottomText} numberOfLines={1} >{val.pnlPercentage.toFixed(2)}%</Text> : val.pnlPercentage == 0 ? <Text style={style.zeroPnlPercentage}>{addDecimals(val.pnlPercentage)}%</Text> : <Text></Text>}
                                        </View>
                                        {val.pnl != 0 ? val.pnl > 0 ? <Text style={style.pnlValue}>${val.pnl.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text> : <Text style={style.pnlValueNegative}>-${(-1 * val.pnl).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text> : <Text style={style.pnlValueZero}>${val.pnl}</Text>}
                                    </View>
                                    <View style={style.action}>
                                        <TouchableOpacity activeOpacity={0.9} style={style.addCoinContainerInner1} onPress={() => { setPopupBackground(true); openTransactionModal(val.id, val.current_price, val.name + ` (${val.symbol.toUpperCase()})`, val.image); setQuantity(''); setCurrentTab('Buy'); setModalVisible(true); setAssetsCoin(val.name + ` (${val.symbol.toUpperCase()})`); setAssetsCoinImage(val.image) }} >
                                            <Entypo style={style.actionAdd} name="plus" size={25} color="white" />
                                        </TouchableOpacity>
                                        <TouchableOpacity activeOpacity={0.9} style={style.addCoinContainerInner} onPress={() => { setPopupBackground(true); setDeleteModalVisible(true); setState(val.id) }}>
                                            <MaterialIcons style={style.actionDelete} name="delete-outline" size={25} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        ))}
                    </View>
                </ScrollView>
            </View>
            <Modal
                animationType="none"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => {
                    setEditModalVisible(!editModalVisible);
                    setPopupBackground(false);
                }}
            >
                <View style={style.editCenteredView}>
                    <View style={style.editModalView}>
                        <View style={style.editHeaderlabels}>
                            <Text style={style.editAdd}>Edit Portfolio Name</Text>
                            <EvilIcons onPress={() => { setEditModalVisible(!editModalVisible); setPortfolioName(props.route.params.portfolio_name); setPopupBackground(false); }} name='close' size={24} color='black' />
                        </View>
                        <View style={style.quantityContainer}>
                            <View style={{ width: '100%' }}>
                                <TextInput style={style.placeholder} value={portfolioName} onChangeText={(text) => { setPortfolioName(text) }} placeholder={'Enter Your Portfolio Name'}></TextInput>
                            </View>
                        </View>
                        <TouchableOpacity activeOpacity={0.9}
                            style={style.buttonClose}
                            onPress={() => { onEditPortfolio(); setPortfolio(edit); }}
                        >
                            <Text style={style.textStyle}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
                            <Text style={style.modalText}>Do you want to delete this asset?</Text>
                            <View style={style.buttons}>
                                <TouchableOpacity activeOpacity={0.9}
                                    style={[style.deleteButtonClose]}
                                    onPress={() => { deleteAssets(id); }}
                                >
                                    <Text style={style.textStyle}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.9}
                                    style={[style.deleteButtonClose]}
                                    onPress={() => { setDeleteModalVisible(!deleteModalVisible); setPopupBackground(false); }}
                                >
                                    <Text style={style.textStyle}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            <View>
                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
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
                            <View style={style.modalView}>
                                <View style={style.transactionTabs}>
                                    <View style={style.transactionHeaderlabels}>
                                        <Text style={style.addTransaction}>Add Transaction</Text>
                                        <EvilIcons onPress={() => { setModalVisible(!modalVisible); setPopupBackground(false); }} name='close' size={24} color='black' />
                                    </View>
                                    <TransactionTabs />
                                </View>
                                <TouchableOpacity activeOpacity={0.9}
                                    style={style.buttonClose1}
                                    onPress={() => { onAddTransaction(); }}
                                >
                                    <Text style={style.textStyle}>Confirm Transaction</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </TouchableWithoutFeedback>
            </View>
            <View>
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={coinModalVisible}
                    onRequestClose={() => {
                        setCoinModalVisible(!coinModalVisible);
                        setPopupBackground(false);
                    }}
                >
                    <View style={style.centeredView}>
                        <View style={style.coinModalView}>
                            <View style={style.headerlabelsContainer}>
                                <View style={style.headerlabels}>
                                    <Text style={style.searchCoin}>Select Coin</Text>
                                    <EvilIcons onPress={() => { onTransactionClose(); setPopupBackground(false); }} name='close' size={24} color='black' />
                                </View>
                                <View>
                                    <View style={style.commonTextInput}>
                                        <View style={style.ImageAndTextInput}>
                                            <View style={style.ImageView}>
                                                <Image style={style.imageTag} source={{ uri: coinImage }} />
                                            </View>
                                            <TextInput value={coinInputValue} placeholder={'Select Coin'} style={style.coinTextInput} onChangeText={(text) => onChangeCoinTextFunction(text)} onFocus={() => { setCoinImage(null); setCoinInputValue(null) }} autoCorrect={false} />
                                        </View>
                                        {coinDataloading ? <View style={style.loadingView}><Text>Loading...</Text><ActivityIndicator size={25} color='blue' /></View> : null}
                                        {coinRenderData ? <View style={style.suggestionsContainer}>
                                            <ScrollView keyboardShouldPersistTaps={'handled'} >
                                                {noCoinData ? <View style={style.noDataView}><Text style={style.noDataAvailable} >NO DATA AVAILABLE</Text></View> : <View></View>}
                                                {coinRenderData && coinRenderData.map((val, item) => {
                                                    return (
                                                        <View key={item} >
                                                            <Pressable onPress={() => { setCoinInputValue(val.title); setCoinRenderData(null); setCoinImage(val.image); Keyboard.dismiss(); addCoin(val.id, val.title, val.image, val.price); setAssetsCoin(val.title); setAssetsCoinId(val.id); setAssetsCoinImage(val.image) }}>
                                                                <View style={[style.coinSuggestionsView, { backgroundColor: item % 2 == 0 ? '#e6e6e6' : 'white' }]}>
                                                                    <Image style={style.coinSuggestionsImage} source={{ uri: val.image }} />
                                                                    <Text style={style.coinSuggestionsText} >{val.title}</Text>
                                                                </View>
                                                            </Pressable>
                                                        </View>
                                                    )
                                                })}
                                            </ScrollView>
                                        </View> : null}
                                    </View>
                                    {coinLoading ? <ActivityIndicator style={style.coinLoading} size='large' color='blue'></ActivityIndicator> : null}
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </View >
    )
}
const style = StyleSheet.create({
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
    activityIndication: {
        position: 'absolute',
        elevation: 2,
        height: "100%",
        width: "100%"
    },
    pnlValue: {
        fontWeight: 'bold',
        color: 'green'
    },
    pnlValueZero: {
        fontWeight: 'bold',
        color: 'black'
    },
    pnlValueNegative: {
        fontWeight: 'bold',
        color: 'red'
    },
    titles: {
        color: '#7d7d7d',
        fontWeight: 'bold',
        marginBottom: 3
    },
    titleHolding: {
        color: '#7d7d7d',
        fontWeight: 'bold',
        marginBottom: 3,
        marginTop: 10
    },
    titlePnl: {
        color: '#7d7d7d',
        fontWeight: 'bold',
        marginBottom: 3,
        marginRight: 10
    },
    valueText: {
        width: '90%',
        fontWeight: 'bold',
        color: '#2b2b2b'
    },
    pnlPercent: {
        flexDirection: 'row',
        marginTop: 10
    },
    textAlignment: {
        flexDirection: 'row',
        marginBottom: 10
    },
    addCoinContainerInner: {
        width: '65%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3F51B5',
        borderRadius: 50,
        display: 'flex',
        elevation: 5
    },
    addCoinContainerInner1: {
        width: '65%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3F51B5',
        borderRadius: 50,
        display: 'flex',
        elevation: 5
    },
    actionAdd: {
        marginVertical: '19%'
    },
    actionDelete: {
        marginVertical: '19%'
    },
    allHeading: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
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
    editHeaderlabels: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%'
    },
    editModalView: {
        marginTop: 10,
        margin: 20,
        backgroundColor: "#fffafa",
        borderRadius: 20,
        paddingTop: 35,
        paddingLeft: 20,
        paddingRight: 30,
        alignItems: "center",
        shadowColor: "#000",
        height: 240,
        elevation: 30,
        width: '90%',
        shadowOffset: {
            width: 0,
            height: 2
        }
    },
    editAdd: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#F75626'
    },
    editCenteredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 55,
    },
    placeholder: {
        backgroundColor: 'white',
        width: '100%',
        borderColor: '#F75626',
        borderWidth: 1.5,
        height: 35,
        borderRadius: 4,
        paddingLeft: 10
    },
    quantityContainer: {
        marginTop: 30,
        marginBottom: 20,
        width: '80%'
    },
    nameContainer: {
        justifyContent: 'flex-start',
        width: '61%',
        padding: 10,
        paddingLeft: '3%',
        marginTop: 10,
    },
    portfolioName: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#2e2e2e',
    },
    noDataAvailable: {
        textAlign: 'center',
        paddingTop: 10
    },
    ImageAndTextInput: {
        display: 'flex',
        flexDirection: 'row',
    },
    coinTextInput: {
        height: 40,
        width: '88%',
        borderBottomWidth: 1.5,
        borderBottomColor: '#F75626',
        paddingLeft: 5,
        backgroundColor: '#eff2f5',
        fontSize: 15,
        fontWeight: 'bold'
    },
    suggestionsContainer: {
        position: 'absolute',
        width: '100%',
        marginTop: 45,
        height: 250,
        zIndex: 1
    },
    noDataView: {
        width: '100%',
        display: 'flex',
        backgroundColor: 'white',
        height: 40,
        textAlign: 'center',
        justifyContent: 'center',
        borderWidth: 0.4
    },

    loadingView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        marginTop: 35,
        backgroundColor: 'white',
        height: 50,
        paddingTop: 10,
        borderWidth: 0.5
    },
    ImageView: {
        height: 40,
        borderBottomWidth: 1.5,
        borderBottomColor: '#F75626',
        width: '12%',
        backgroundColor: '#eff2f5'
    },
    imageTag: {
        width: 25,
        height: 25,
        marginLeft: 10,
        marginTop: 5,
    },
    assetsView: {
        paddingBottom: '45%'
    },
    noDataText: {
        display: 'flex',
        marginTop: '30%',
        alignItems: 'center'
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    modalText: {
        marginTop: 5,
        fontSize: 15,
        fontWeight: 'bold'
    },
    deleteModalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: '10%',
        height: 200,
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
    deleteCenteredView: {
        flex: 1,
        marginTop: '55%',
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
    headerlabelsContainer: {
        width: '100%'
    },
    portfolioAssets: {
        height: '100%',
    },
    headerlabels: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14
    },
    transactionHeaderlabels: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    transactionTabs: {
        height: 380,
        width: '100%'
    },
    addTransaction: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#F75626'
    },
    searchCoin: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 2,
        color: '#F75626'
    },
    coinSuggestionsView: {
        height: 50,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 0.6,
        borderColor: 'lightgrey',
        elevation: 10,
    },
    coinSuggestionsImage: {
        height: 30,
        width: 30,
        marginLeft: 15,
        marginTop: 10
    },
    coinSuggestionsText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: 'black',
        marginLeft: 15,
        marginTop: 15
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
        paddingTop: 20,
        padding: 15,
        height: 465,
        width: '97%',
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
    coinModalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 35,
        paddingVertical: 22,
        height: 390,
        width: '97%',
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
        padding: 10,
        borderRadius: 50,
        marginTop: '3%',
        width: '40%'
    },
    buttonClose1: {
        backgroundColor: '#3F51B5',
        padding: 10,
        borderRadius: 50,
        marginTop: '2%',
        width: '50%'
    },
    deleteButtonClose: {
        backgroundColor: '#3F51B5',
        padding: 5,
        borderRadius: 50,
        width: 80,
        marginTop: 50
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15
    },
    bottomText: {
        color: 'green',
        fontSize: 14,
        fontWeight: 'bold',
    },
    negativeBottomText: {
        color: 'red',
        fontSize: 14,
        fontWeight: 'bold',
    },
    market: {
        display: 'flex',
        flexDirection: 'row',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
        paddingBottom: 5,
        paddingHorizontal: 1,
        paddingTop: 8
    },
    iconAndText: {
        width: '28%',
        marginBottom: 5,
        paddingLeft: '3%'
    },
    marketImage: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    symbolText: {
        width: '60%',
    },
    price: {
        width: '27%',
    },
    holdings: {
        width: '28%',
    },
    action: {
        width: '15%',
        justifyContent: 'space-around',
    },
    backIconAndText: {
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
    Icon: {
        width: 40,
        paddingLeft: 10
    },
    Heading: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F75626',
        padding: '3%',
        marginTop: '2%',

    },
    yourAssetsText: {
        fontSize: 20,
        color: '#3F51B5',
        zIndex: -1,
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 20,
        fontWeight: 'bold'
    },
    nameHeading: {
        backgroundColor: '#F75626',
        height: 50,
        paddingTop: 15,
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        width: '13%'
    },
    priceHeading: {
        fontSize: 15,
        display: 'flex',
        height: 50,
        paddingTop: 15,
        color: 'white',
        fontWeight: 'bold',
        width: '28%',
        textAlign: 'center'
    },
    holdingsHeading: {
        fontSize: 15,
        display: 'flex',
        height: 50,
        paddingTop: 15,
        color: 'white',
        fontWeight: 'bold',
        width: '23%',
        textAlign: 'center'
    },
    pnlHeading: {
        fontSize: 15,
        display: 'flex',
        height: 50,
        paddingTop: 15,
        color: 'white',
        fontWeight: 'bold',
        width: '25%',
        textAlign: 'center'
    },
    actionHeading: {
        fontSize: 15,
        display: 'flex',
        height: 50,
        paddingTop: 15,
        color: 'white',
        fontWeight: 'bold',
        width: '13%',
        textAlign: 'center'
    },
    addCoinContainer: {
        alignItems: 'center',
        backgroundColor: '#3F51B5',
        alignSelf: 'flex-end',
        borderRadius: 50,
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '1%',
    },
    addCoinView: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        marginHorizontal: '2.5%',
        marginVertical: '5%',
    },
    addCoinIcon: {
        paddingLeft: '2%'
    },
    addCoinText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold'
    },
    zeroPnlPercentage: {
        color: 'black'
    },
    coinLoading: {
        marginTop: '5%'
    }
})
import React from "react";
import { View, Text, StyleSheet, Image, Modal, Pressable, ActivityIndicator, Keyboard } from "react-native";
import { ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { EvilIcons, Entypo } from '@expo/vector-icons';
import { LoginContext } from '../../context/context';
import { API } from '../../services/apiService';
import moment from 'moment';
import { IMAGE_PATH } from '../../utils/constants';
import CalendarPicker from 'react-native-calendar-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AdvanceSearch extends React.Component {
    static contextType = LoginContext
    state = {
        coindata: [],
        advanceSearchResult: [],
        coinRenderData: [],
        categoryData: [],
        renderTags: [],
        tagsIds: [],
        coinSymbols: [],
        categoryClicked: false,
        tagsLabel: false,
        dateLabel: false,
        coininputvalue: null,
        calenderModal: false,
        selectedStartDate: null,
        selectedEndDate: null,
        selectedCategory: [],
        coinLoading: false,
        noCoinData: false,
        popupBackground: false,
        loading: false
    }
    async componentDidMount() {
        this.setState({ loading: true })
        const coinItems = await API.request('fetchCoins', undefined, 'GET', null, null, null, null, null)
        const suggestions = coinItems.map((item, index) => ({
            price: item.current_price,
            id: item.id,
            name: item.name,
            title: item.name + ` (${item.symbol.toUpperCase()})`,
            image: item.image,
            symbol: item.symbol.toUpperCase()
        }))
        this.setState({ coinRenderData: suggestions })
        const data = await AsyncStorage.getItem('categoryData')
        this.setState({ categoryData: JSON.parse(data) })
        this.setState({ loading: false })
    }
    onChangeCoinTextFunction = (q) => {
        this.setState({ coinLoading: true, noCoinData: false, coinRenderData: null })
        if (q) {
            const params = {
                q: q
            }
            API.request('fetchCoins', undefined, 'GET', null, null, null, null, params)
                .then((result) => {
                    let data = result && result.map((item, index) => ({
                        id: item.id,
                        title: item.name + ` (${item.symbol.toUpperCase()})`,
                        image: item.image,
                        symbol: item.symbol.toUpperCase()
                    }));
                    this.setState({
                        coinRenderData: data,
                        coinLoading: false
                    })
                    if (data.length == 0) {
                        this.setState({
                            noCoinData: true
                        })
                    }
                }
                )
        }
        else {
            this.setState({
                coinLoading: true,
                noCoinData: false,
                coinRenderData: null,
            })
            const params = {
                q: "a"
            }
            API.request('fetchCoins', undefined, 'GET', null, null, null, null, params)
                .then((result) => {
                    let data = result && result.map((item, index) => ({
                        id: item.id,
                        title: item.name + ` (${item.symbol.toUpperCase()})`,
                        image: item.image,
                        symbol: item.symbol.toUpperCase()
                    }));
                    this.setState({
                        coinRenderData: data,
                        coinLoading: false
                    })
                    if (data.length == 0) {
                        this.setState({
                            noCoinData: true
                        })
                    }
                }
                )
            this.setState({
                coinLoading: false
            })
        }
    }
    onDateChange = (date, type) => {
        if (type === 'END_DATE') {
            this.setState({
                selectedEndDate: date,
            });
        } else {
            this.setState({
                selectedStartDate: date,
                selectedEndDate: null,
            });
        }
    }
    onCoinSelect = async (name) => {
        if (this.state.renderTags.includes(name)) {
            return
        }
        this.setState({ renderTags: this.state.renderTags.concat(name) })
        this.setState({ coininputvalue: '' }),
            Keyboard.dismiss()
    }
    onAddCategory = (val) => {
        if (this.state.selectedCategory.includes(val)) {
            let data = this.state.selectedCategory.filter((value) => value != val)
            this.setState({ selectedCategory: data })
            return
        }
        this.setState({ selectedCategory: this.state.selectedCategory.concat(val) })
    }
    onSearch = async () => {
        let coin = this.state.renderTags.join();
        let category = this.state.selectedCategory.join();
        let advanceSearchObj = {
            coinData: coin,
            categoryData: category,
            startDate: this.state.selectedStartDate,
            endDate: this.state.selectedEndDate,
        }
        this.props.navigation.navigate("searchResult", { advanceSearchObj })
        this.setState({
            selectedCategory: [],
            renderTags: [],
            selectedStartDate: null,
            selectedEndDate: null
        })
    }
    render() {
        const { selectedStartDate, selectedEndDate } = this.state;
        const startDate = selectedStartDate ? selectedStartDate.toString() : '';
        const endDate = selectedEndDate ? selectedEndDate.toString() : '';
        return (
            <View style={style.cointainerView}>
                {this.state.popupBackground ? <View style={style.popupBackground}></View> : null}
                <View style={style.headerView}>
                    <View style={style.header}>
                        <Image style={style.coimmomoLogo} source={IMAGE_PATH.logo} />
                    </View>
                </View>
                <View style={style.titleView}>
                    <Text style={style.titleText}>Advance Search</Text>
                </View>
                <View style={style.content}>
                    <ScrollView>
                        {this.state.loading ? <View style={style.initialLoading}>
                            <ActivityIndicator color="blue" size={30} />
                        </View> : null}
                        <View style={style.allDetails}>
                            <View style={style.titleAndTextInput}>
                                {this.state.tagsLabel ? <Text style={style.label}>Select coins</Text> : <Text style={style.label}></Text>}
                                <View style={style.textInputs}>
                                    <View style={this.state.tagsLabel ? style.addTagsViewLabel : style.addTagsView}>
                                        {this.state.renderTags.map((val, index) => {
                                            return (
                                                <View key={index} style={style.renderTagsView}>
                                                    <Text>{val}</Text>
                                                    <Entypo onPress={() => { let ren = this.state.renderTags.filter((value) => value != val); this.setState({ renderTags: ren }); let removeTags = this.state.tagsIds.filter((value) => value.name != val); this.setState({ tagsIds: removeTags }); if (this.state.renderTags.length == 1) { this.setState({ tagsLabel: false }) } }} name="cross" size={24} color='grey' />
                                                </View>
                                            )
                                        })}
                                        <TextInput value={this.state.coininputvalue} onBlur={() => { this.setState({ coinrenderData: null }) }} onFocus={() => { this.setState({ tagsLabel: true, tagsArrow: true, coininputvalue: null }); }} onChangeText={(text) => { this.onChangeCoinTextFunction(text) }} placeholder={'Select coins'} style={style.addTags} autoCorrect={false} />
                                    </View>
                                    <View style={this.state.tagsLabel ? style.tagsArrowLabel : style.tagsArrow}>
                                        {this.state.coininputvalue ? <Entypo onPress={() => this.setState({ coininputvalue: null, renderTags: [] })} name="cross" size={20} color="gray" /> : null}
                                    </View>
                                </View>
                                <View>
                                    <View style={style.suggestionsContainer}>
                                        <ScrollView keyboardShouldPersistTaps={'handled'} >
                                            {this.state.coinLoading ? <View style={style.loadingView}><Text>Loading...</Text><ActivityIndicator size={25} color='blue' /></View> : <View></View>}
                                            {this.state.noCoinData ? <View style={style.noDataView}><Text style={style.noDataText} >NO DATA AVAILABLE</Text></View> : <View></View>}
                                            {this.state.coinRenderData && this.state.coinRenderData.map((val, item) => {
                                                return (
                                                    <View key={item} >
                                                        <Pressable onPress={() => { this.setState({ coininputvalue: val.title, tagsLabel: true }); this.onCoinSelect(val.symbol); Keyboard.dismiss() }}>
                                                            <View style={[style.coinSuggestionsView, { backgroundColor: item % 2 == 0 ? 'white' : '#e6e6e6' }]}>
                                                                <Text style={style.coinSuggestionsText} >{val.title}</Text>
                                                            </View>
                                                        </Pressable>
                                                    </View>
                                                )
                                            })}
                                        </ScrollView>
                                    </View>
                                </View>
                            </View>
                            <View style={style.tagsView}>
                                <Text style={style.headingLabel}>Select Categories</Text>
                                <View style={style.allTags}>
                                    {this.state.categoryData.map((index) => {
                                        return (
                                            <View key={index.id} >
                                                <TouchableOpacity activeOpacity={0.8} style={style.tagButton} onPress={() => { this.onAddCategory(index.id) }}>
                                                    {!this.state.selectedCategory.includes(index.id) ? <Text style={style.tagButtonText}>{index.name}</Text> : <Text style={style.tagButtonClickedText}>{index.name}</Text>}
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                            <View>
                                <View style={style.calendar}>
                                    <Pressable
                                        onPress={() => this.setState({ calenderModal: true, dateLabel: true, popupBackground: true })}
                                    >
                                        {this.state.dateLabel ? <View>
                                            <Text style={style.headingLabel}>Select Dates</Text>
                                            <View style={style.CalendarViewStyleClicked}>
                                                {endDate ? <View style={style.datesView}>
                                                    <Text style={style.datesText}>{moment(startDate).format('MMMM-DD')} to {moment(endDate).format('MMMM-DD')}</Text>
                                                    <Entypo onPress={() => { this.setState({ selectedStartDate: null, selectedEndDate: null }) }} name='cross' size={20} color='gray' />
                                                </View> :
                                                    <Text style={style.selectDate}>Select Date</Text>}
                                            </View>
                                        </View> : <View>
                                            <View style={style.CalendarViewStyle}>
                                                {endDate ? <View style={style.datesView}>
                                                    <Text style={style.datesText}>{moment(startDate).format('MMMM-DD')} to {moment(endDate).format('MMMM-DD')}</Text>
                                                    <Entypo onPress={() => { this.setState({ selectedStartDate: null, selectedEndDate: null }) }} name='cross' size={20} color='gray' />
                                                </View> :
                                                    <Text style={style.selectDate}>Select Date</Text>}
                                            </View>
                                        </View>}
                                    </Pressable>
                                    <View style={style.centeredView}>
                                        <Modal
                                            animationType="slide"
                                            transparent={true}
                                            visible={this.state.calenderModal}
                                            onRequestClose={() => {
                                                this.setSate({ calenderModal: false, popupBackground: false });
                                            }}
                                        >
                                            <View style={style.calendarCenteredView}>
                                                <View style={style.calendarModalView}>
                                                    <View style={style.datesheaderlabels}>
                                                        <Text style={style.calenderHeading}>Select Dates</Text>
                                                        <EvilIcons onPress={() => { this.setState({ calenderModal: false, popupBackground: false }) }} name='close' size={24} color='black' />
                                                    </View>
                                                    <View style={style.calendarHeight}>
                                                        <CalendarPicker
                                                            startFromMonday={true}
                                                            allowRangeSelection={true}
                                                            selectedStartDate={startDate}
                                                            selectedEndDate={endDate}
                                                            todayBackgroundColor="#f2e6ff"
                                                            selectedDayColor="#7300e6"
                                                            selectedDayTextColor="#FFFFFF"
                                                            onDateChange={this.onDateChange}
                                                        />
                                                    </View>
                                                    <Pressable
                                                        style={[style.button, style.buttonClose]}
                                                        onPress={() => this.setState({ calenderModal: false, popupBackground: false })}
                                                    >
                                                        <Text style={style.selectTextStyle}>select</Text>
                                                    </Pressable>
                                                </View>
                                            </View>
                                        </Modal>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <TouchableOpacity activeOpacity={0.8} style={style.searchButton} onPress={() => { this.onSearch() }}>
                                    <Text style={style.searchButtonText}>Search</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}
const style = StyleSheet.create({
    initialLoading: {
        marginTop: '10%',
        alignSelf: 'center'
    },
    allDetails: {
        height: '100%',
        width: '100%',
        paddingBottom: 200
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
    renderTagsView: {
        display: 'flex',
        height: 30,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'lightgrey',
        marginLeft: 4,
        marginTop: 4,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 4,
        borderRadius: 5
    },
    coinSuggestionsView: {
        height: 50,
        backgroundColor: 'white',
        alignSelf: 'center',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 0.6,
        borderColor: 'lightgrey',
        elevation: 10
    },
    coinSuggestionsText: {
        color: 'black',
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 15
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
        zIndex: 1,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: 'white',
        height: 35,
        paddingTop: 10,
        borderWidth: 0.5
    },
    noDataText: {
        textAlign: 'center',
        paddingTop: 10
    },
    suggestionsContainer: {
        alignSelf: 'center',
        width: '95%',
        height: 198,
        zIndex: 1,
        borderBottomColor: 'black',
        borderBottomWidth: 0.5
    },
    tagsArrow: {
        width: '10%',
        borderBottomWidth: 1.5,
        borderColor: '#F75626',
        backgroundColor: '#eff2f5',
        paddingLeft: '3%',
        paddingTop: '2%'
    },
    tagsArrowLabel: {
        width: '10%',
        borderWidth: 1.5,
        borderLeftWidth: 0,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: '#eff2f5',
        borderColor: '#F75626',
        paddingLeft: '3%',
        paddingTop: '2%'
    },
    addTags: {
        width: 0,
        maxWidth: '100%',
        paddingLeft: '5%',
        padding: 5,
        backgroundColor: 'transparent',
        flexGrow: 1,
        zIndex: 1
    },
    addTagsView: {
        height: 'auto',
        width: '85%',
        backgroundColor: '#eff2f5',
        borderBottomWidth: 1.5,
        flexWrap: 'wrap',
        borderColor: '#F75626',
        flexDirection: 'row',
        zIndex: 0,
    },
    addTagsViewLabel: {
        height: 'auto',
        width: '85%',
        borderWidth: 1.5,
        borderRightWidth: 0,
        flexWrap: 'wrap',
        backgroundColor: '#eff2f5',
        borderColor: '#F75626',
        flexDirection: 'row',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        zIndex: 0
    },
    textInputs: {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'center',
    },
    titleAndTextInput: {
        width: '100%',
        marginTop: '5%',
        paddingLeft: '5%',
        paddingRight: '5%'
    },
    label: {
        color: '#F75626',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: '5%',
        height: 23
    },
    calendar: {
        marginTop: '8%'
    },
    selectTextStyle: {
        width: 100,
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white'
    },
    buttonClose: {
        backgroundColor: "#3F51B5",
        borderRadius: 50
    },
    button: {
        padding: 5,
        elevation: 2
    },
    datesheaderlabels: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 35,
    },
    calenderHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F75626'
    },
    calendarCenteredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20
    },
    calendarModalView: {
        marginTop: 10,
        margin: 20,
        backgroundColor: "#fffafa",
        borderRadius: 20,
        borderWidth: 0.5,
        paddingTop: 20,
        paddingLeft: 15,
        paddingRight: 25,
        alignItems: "center",
        shadowColor: "#000",
        height: 450,
        elevation: 50,
        width: '95%',
        shadowOffset: {
            width: 0,
            height: 2
        }
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },
    selectDate: {
        fontSize: 15,
        paddingLeft: 40,
        color: 'grey'
    },
    CalendarViewStyle: {
        width: '85%',
        height: 40,
        paddingTop: 8,
        backgroundColor: '#eff2f5',
        borderBottomColor: '#F75626',
        borderBottomWidth: 1.5,
        alignSelf: 'center',
    },
    CalendarViewStyleClicked: {
        width: '85%',
        height: 40,
        paddingTop: 8,
        backgroundColor: '#eff2f5',
        borderColor: '#F75626',
        borderWidth: 1.5,
        borderRadius: 5,
        alignSelf: 'center',
    },
    calendarHeight: {
        height: 340,
        marginLeft: 50,
        marginRight: 35
    },
    datesView: {
        display: 'flex',
        flexDirection: 'row'
    },
    datesText: {
        paddingLeft: 40,
        color: 'black',
        width: '90%'
    },
    cointainerView: {
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: "white"
    },
    headerView: {
        display: "flex",
        justifyContent: "center",
        marginTop: 25,
        height: 70,
        backgroundColor: "white",
        borderBottomWidth: 0.5,
        borderBottomColor: "grey",
    },
    header: {
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
        height: '100%',
        width: '100%'
    },
    advanceSearchView: {
        marginTop: 20
    },
    advanceSearchInputbox: {
        width: '85%',
        height: 40,
        borderWidth: 1.5,
        borderRadius: 5,
        backgroundColor: '#eff2f5',
        borderColor: '#F75626',
        alignSelf: 'center',
        paddingLeft: 15,
        paddingRight: 15
    },
    tagButton: {
        height: 30,
        marginTop: 10,
        borderColor: '#3F51B5',
        borderWidth: 2.5,
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        marginHorizontal: 5
    },
    tagButtonText: {
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#363636',
        paddingHorizontal: 15
    },
    tagButtonClickedText: {
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        borderRadius: 5,
        backgroundColor: "#3F51B5",
        paddingHorizontal: 15
    },
    tagsView: {
        marginTop: '8%'
    },
    headingLabel: {
        marginBottom: 10,
        marginLeft: '8%',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#F75626'
    },
    allTags: {
        flexDirection: 'row',
        width: '83%',
        display: 'flex',
        flexWrap: 'wrap',
        alignSelf: 'center'
    },
    titleView: {
        display: "flex",
        paddingVertical: 15,
        backgroundColor: "#F75626",
    },
    titleText: {
        fontWeight: "bold",
        fontSize: 18,
        alignSelf: 'center',
        color: "white",
    },
    dateView: {
        marginTop: '10%',
    },
    searchButtonText: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    searchButton: {
        height: 35,
        width: '40%',
        marginTop: '8%',
        backgroundColor: '#3F51B5',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        marginHorizontal: 5
    }
});
import React, { createRef } from 'react';
import { StyleSheet, View, Text, Image, LogBox, TouchableHighlight, Linking, FlatList, ActivityIndicator, Dimensions, Modal, Pressable, TextInput, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment';
import { IMAGE_PATH } from '../../utils/constants';
import { LoginContext } from '../../context/context';
import { API } from '../../services/apiService';
import { EvilIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { RFPercentage } from "react-native-responsive-fontsize";
import CalendarPicker from 'react-native-calendar-picker';

//getting font size for different dimensions
const fontSize = Dimensions.get('window').width <= 320 ? 2.4 : 2
export default class Events extends React.Component {
    static contextType = LoginContext
    state = {
        eventsdata: [],
        noData: false,
        activityIndicator: false,
        page: 2,
        loading: false,
        isListEnd: false,
        filterpage: 1,
        modalVisible: false,
        selectedCoin: '',
        selectedCategory: '',
        setCoinSuggestions: null,
        coinSearchLoading: false,
        setCategorySuggestions: null,
        categorySearchLoading: false,
        calenderModal: false,
        selectedStartDate: null,
        selectedEndDate: null,
        ref: createRef(null),
        coinrenderData: null,
        coinItem: null,
        coinLoading: false,
        noCoinData: false,
        coininputvalue: null,
        coinValue: null,
        setCoinImage: null,
        coinImage: null,
        categoryrenderData: null,
        categoryItem: null,
        categoryinputvalue: null,
        categoryValue: null,
        categoryLoading: false,
        noCategoryData: false
    }
    async componentDidMount() {
        const data = this.context
        if (data.eventData) {
            this.setState({
                eventsdata: data.eventData
            })
        }
        if (!data.eventData) {
            let params = {
                date_from: moment().format('YYYY-MM-DD')
            }
            this.setState({ activityIndicator: true })
            const eventsResult = await API.request('eventsFilter', undefined, 'POST', null, null, null, null, params);
            if (!eventsResult) {
                this.setState({ noData: true })
            } else {
                this.setState({ eventsdata: eventsResult })
            }
            this.setState({ activityIndicator: false })
        }
        const { setScreenLoading } = this.context
        setScreenLoading(false)
        //The moment converter of date is not recogninzed in ISO format.
        LogBox.ignoreLogs(['./normalizeText does not contain a default export']);
        LogBox.ignoreLogs(['Deprecation warning: value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.'])
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
    Loading = async () => {
        if (!this.state.loading && !this.state.isListEnd) {
            this.setState({ loading: true });
            let finalStartDate = this.state.selectedStartDate ? moment(this.state.selectedStartDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
            let finalEndDate = this.state.selectedEndDate && moment(this.state.selectedEndDate).format('YYYY-MM-DD')
            let params = {
                coin_id: this.state.coinItem ? this.state.coinItem : null,
                category_id: this.state.categoryItem ? this.state.categoryItem : null,
                date_from: finalStartDate,
                date_to: finalEndDate,
                page_num: this.state.page
            }
            if (params.coin_id || params.category_id || params.date_from || params.date_to) {
                let filterdata = await API.request('eventsFilter', undefined, 'POST', null, null, null, null, params);
                let totalData = filterdata.length > 0 && filterdata.map((val) => {
                    return (
                        {
                            title: val.title,
                            date_event: val.date_event,
                            description: {
                                en: val.description && val.description.en
                            },
                            vote_count: val.vote_count,
                            view_count: val.view_count,
                            created_date: val.created_date,
                            original_source: val.original_source,
                            source: val.source,
                            categories: val.categories,
                            coins: this.state.coinItem ? val.coins.filter((val) => val.id == this.state.coinItem) : val.coins
                        }
                    )
                })
                if (totalData.length > 0) {
                    this.setState({
                        page: this.state.page + 1,
                        eventsdata: this.state.eventsdata.concat(totalData),
                    });
                } else {
                    this.setState({
                        isListEnd: true,
                    });
                }
            }
            else {
                let params = {
                    date_from: moment().format('YYYY-MM-DD'),
                    page_num: this.state.page
                }
                const eventsResult = await API.request('eventsFilter', undefined, 'POST', null, null, null, null, params);
                if (eventsResult.length > 0) {
                    this.setState({
                        page: this.state.page + 1,
                        eventsdata: this.state.eventsdata.concat(eventsResult),
                    });
                } else {
                    this.setState({
                        isListEnd: true,
                    });
                }
            }
        }
        this.setState({ loading: false })
    };
    newevents = async () => {
        let params = {
            date_from: moment().format('YYYY-MM-DD'),
            page_num: 1
        }
        const eventsResponse = await API.request('eventsFilter', undefined, 'POST', null, null, null, null, params);
        this.setState({
            eventsdata: eventsResponse,
            selectedStartDate: null,
            selectedEndDate: null,
            coinItem: null,
            categoryItem: null,
            isListEnd: false,
            coininputvalue: null,
            coinValue: null,
            setCoinImage: null,
            coinImage: null,
            categoryinputvalue: null,
            categoryValue: null,
            selectedStartDate: null,
            selectedEndDate: null
        })
        this.props.navigation.navigate('events')
    }
    pastevents = () => {
        this.props.navigation.navigate('pastevents')
    }
    renderFooter = () => {
        return (
            <View style={style.footer}>
                {this.state.loading ? (
                    <ActivityIndicator color="black" style={{ margin: 15 }} />
                ) : null}
            </View>
        );
    };
    onSearch = async () => {
        const { setScreenLoading } = this.context
        let finalStartDate = this.state.selectedStartDate ? moment(this.state.selectedStartDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
        let finalEndDate = this.state.selectedEndDate ? moment(this.state.selectedEndDate).format('YYYY-MM-DD') : null
        let params = {
            coin_id: this.state.coinItem ? this.state.coinItem : null,
            category_id: this.state.categoryItem ? this.state.categoryItem : null,
            date_from: finalStartDate,
            date_to: finalEndDate,
            page_num: 1
        }
        let filterdata = await API.request('eventsFilter', undefined, 'POST', null, null, null, null, params);
        let totalData = filterdata.length > 0 && filterdata.map((val) => {
            return (
                {
                    title: val.title,
                    date_event: val.date_event,
                    description: {
                        en: val.description && val.description.en,
                    },
                    vote_count: val.vote_count,
                    view_count: val.view_count,
                    created_date: val.created_date,
                    source: val.source,
                    categories: val.categories,
                    coins: this.state.coinItem ? val.coins.filter((val) => val.id == this.state.coinItem) : val.coins
                }
            )
        })
        this.setState({ eventsdata: totalData })
        this.setState({ modalVisible: false })
        setScreenLoading(false)
    }
    onChangeCategoryTextFunction = (q) => {
        this.setState({
            categoryrenderData: null,
            categoryLoading: true,
            noCategoryData: false
        })
        if (q) {
            this.setState({ loading: true })
            API.request('fetchCategories', undefined, 'GET', null, null, null, null)
                .then(result => {
                    const filterCategories = result.filter((val) => val.name.toLowerCase().startsWith(q.toLowerCase()))
                    const sortCategories = filterCategories.sort((initial, final) => initial.name - final.name)
                    const suggestions = sortCategories.map((item) => ({
                        id: item.id.toString(),
                        title: item.name
                    }))
                    this.setState({
                        categoryrenderData: suggestions,
                        categoryLoading: false
                    })
                    if (suggestions.length == 0) {
                        this.setState({
                            noCategoryData: true
                        })
                    }
                }
                )
        }
        else {
            this.setState({
                categoryrenderData: null,
                categoryLoading: null
            })
        }
    }
    onChangeCoinTextFunction = (q) => {
        this.setState({ coinrenderData: null, coinLoading: true, noCoinData: false })
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
                        symbol: item.symbol
                    }));
                    this.setState({
                        coinrenderData: data,
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
                coinrenderData: null,
                coinLoading: null
            })
        }
    }
    render() {
        const { eventsdata, noData, activityIndicator, selectedStartDate, selectedEndDate, calenderModal } = this.state;
        const { setScreenLoading } = this.context
        const startDate = selectedStartDate ? selectedStartDate.toString() : '';
        const endDate = selectedEndDate ? selectedEndDate.toString() : '';
        const emptyData = () => {
            return (
                <View style={style.noFiltersData}>
                    <Text style={style.noFilterDataText}>No Events Available</Text>
                </View>
            )
        }
        if (noData) {
            return (
                <View>
                    <Text style={style.error}>Data down time, please try again later... </Text>
                </View>
            )
        }
        else if (activityIndicator) {
            return (
                <View>
                    <ActivityIndicator style={style.loading} size='large' color='#0000ff' ></ActivityIndicator>
                </View>
            )
        }
        else {
            return (
                <View style={style.eventsContainer}>
                    <View style={style.filterContainer}>
                        <View style={style.filtersText}>
                            <Text onPress={() => this.props.navigation.navigate('highlights')} style={[style.HighlightsText, { fontSize: RFPercentage(fontSize) }]}>Highlights</Text>
                            <Text onPress={this.newevents} style={[style.neweventsText, { fontSize: RFPercentage(fontSize) }]}>Upcoming Events</Text>
                            <Text onPress={this.pastevents} style={[style.pasteventsText, { fontSize: RFPercentage(fontSize) }]}>Past Events</Text>
                        </View>
                        <View style={style.centeredView}>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={this.state.modalVisible}
                                onRequestClose={() => {
                                    this.setState({ modalVisible: false });
                                }}
                            >
                                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                                    <View style={style.centeredView}>
                                        <View style={style.modalView}>
                                            <View style={style.headerlabelsContainer}>
                                                <View style={style.headerlabels}>
                                                    <Text style={style.filtersHeading}> Advanced Filters</Text>
                                                    <EvilIcons onPress={() => { this.setState({ modalVisible: false, coininputvalue: this.state.coinValue, coinImage: this.state.setCoinImage, coinrenderData: null, categoryrenderData: null }); setScreenLoading(false) }} name='close' size={24} color='black' />
                                                </View>
                                                <View style={style.dropDownAndText}>
                                                    <Text style={style.labels}></Text>
                                                    <View style={style.commonTextInput}>
                                                        <View style={style.ImageAndTextInput}>
                                                            <View style={style.ImageView}>
                                                                <Image style={style.imageTag} source={{ uri: this.state.coinImage }} />
                                                            </View>
                                                            <TextInput onBlur={() => { this.setState({ coininputvalue: this.state.coinValue.length, coinImage: this.state.setCoinImage, coinrenderData: null }); }} value={this.state.coininputvalue} placeholder={'Select Coins'} style={style.coinTextInput} onChangeText={(text) => this.onChangeCoinTextFunction(text)} onFocus={() => { this.setState({ coinItem: null, coininputvalue: null, coinImage: null }) }} autoCorrect={false} />
                                                            <View style={style.coinValueDeleteIcon}>
                                                                {this.state.coininputvalue ? <Entypo onPress={() => this.setState({ coinValue: null, coininputvalue: null, coinImage: null, setCoinImage: null, coinItem: null })} name="cross" size={20} color="gray" /> : null}
                                                            </View>
                                                        </View>
                                                        {this.state.coinLoading ? <View style={style.loadingView}><Text>Loading...</Text><ActivityIndicator size={25} color='blue' /></View> : null}
                                                        {this.state.coinrenderData ? <View style={style.suggestionsContainer}>
                                                            <ScrollView keyboardShouldPersistTaps={'handled'} >
                                                                {this.state.noCoinData ? <View style={style.noDataView}><Text style={style.noDataText} >NO DATA AVAILABLE</Text></View> : <View></View>}
                                                                {this.state.coinrenderData && this.state.coinrenderData.map((val, item) => {
                                                                    return (
                                                                        <View key={item} >
                                                                            <Pressable onPress={() => { this.setState({ coinItem: val.id, coininputvalue: val.title, setCoinImage: val.image, coinValue: val.title, coinrenderData: null, coinImage: val.image }); Keyboard.dismiss() }}>
                                                                                <View style={[style.coinSuggestionsView, { backgroundColor: item % 2 == 0 ? 'white' : '#e6e6e6' }]}>
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
                                                </View>
                                                <View style={style.dropDownAndText}>
                                                    <Text style={style.labels}></Text>
                                                    <View style={style.commonTextInput}>
                                                        <View style={{ display: 'flex', flexDirection: 'row' }} >
                                                            <TextInput onBlur={() => this.setState({ categoryinputvalue: this.state.categoryValue })} value={this.state.categoryinputvalue} placeholder={'Select Category'} style={style.categorytextInput} onChangeText={(text) => this.onChangeCategoryTextFunction(text)} onFocus={() => { this.setState({ categoryItem: null, categoryinputvalue: null }) }} autoCorrect={false} />
                                                            <View style={style.categoryValueDeleteIcon}>
                                                                {this.state.categoryinputvalue ? <Entypo onPress={() => this.setState({ categoryValue: null, categoryinputvalue: null, categoryItem: null })} name="cross" size={20} color="gray" /> : null}
                                                            </View>
                                                        </View>
                                                        {this.state.categoryLoading ? <View style={style.loadingView}><Text>loading...<Text></Text></Text><ActivityIndicator size={25} color='blue' /></View> : null}
                                                        {this.state.categoryrenderData ? <View style={style.suggestionsContainer}>
                                                            <ScrollView keyboardShouldPersistTaps={'handled'} >
                                                                {this.state.noCategoryData ? <View style={style.noDataView}><Text style={style.noDataText} >NO DATA AVAILABLE</Text></View> : <View></View>}
                                                                {this.state.categoryrenderData && this.state.categoryrenderData.map((val, item) => {
                                                                    return (
                                                                        <View key={item} >
                                                                            <Pressable onPress={() => { this.setState({ categoryItem: val.id, categoryinputvalue: val.title, categoryValue: val.title, categoryrenderData: null }); Keyboard.dismiss() }}>
                                                                                <Text style={[style.CategorySuggestionsText, { backgroundColor: item % 2 == 0 ? 'white' : '#e6e6e6' }]} >{val.title}</Text>
                                                                            </Pressable>
                                                                        </View>
                                                                    )
                                                                })}
                                                            </ScrollView>
                                                        </View> : null}
                                                    </View>
                                                </View>
                                                <Text style={style.labels}></Text>
                                                <Modal
                                                    animationType="slide"
                                                    transparent={true}
                                                    visible={this.state.calenderModal}
                                                    onRequestClose={() => {
                                                        this.setSate({ calenderModal: false });
                                                    }}
                                                >
                                                    <View style={style.calendarCenteredView}>
                                                        <View style={style.calendarModalView}>
                                                            <View style={style.datesheaderlabels}>
                                                                <Text style={style.calenderHeading}>Select Dates</Text>
                                                                <EvilIcons onPress={() => { this.setState({ calenderModal: false }) }} name='close' size={24} color='black' />
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
                                                                onPress={() => this.setState({ calenderModal: false })}
                                                            >
                                                                <Text style={style.selectTextStyle}>select</Text>
                                                            </Pressable>
                                                        </View>
                                                    </View>
                                                </Modal>
                                                <Pressable
                                                    onPress={() => this.setState({ calenderModal: true })}
                                                >
                                                    <View style={style.CalendarViewStyle}>
                                                        {endDate ? <View style={style.datesView}>
                                                            <Text style={style.datesText}>{moment(startDate).format('MMMM-DD')} to {moment(endDate).format('MMMM-DD')}</Text>
                                                            <Entypo onPress={() => { this.setState({ selectedStartDate: null, selectedEndDate: null }) }} name='cross' size={20} color='gray' />
                                                        </View> :
                                                            <Text style={style.selectDate}>Select Date</Text>}
                                                    </View>
                                                </Pressable>
                                                <Text onPress={this.onSearch} style={style.search}>Search</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </Modal>
                            <Pressable
                                style={style.advancedFilterButton}
                                onPress={() => { this.props.navigation.navigate("advanceSearch") }}
                            >
                                <FontAwesome5 name="searchengin" size={25} color="white" />
                                <Text style={style.advanceFilterTextStyle}> Advanced Search</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={style.eventsDataList}>
                        <FlatList
                            data={eventsdata.length > 0 && eventsdata}
                            numColumns={2}
                            keyboardShouldPersistTap="always"
                            onEndReached={() => this.Loading()}
                            keyExtractor={(item, index) => index.toString()}
                            ListFooterComponent={this.renderFooter}
                            onEndReachedThreshold={0.5}
                            ListEmptyComponent={emptyData}
                            renderItem={({ item, index }) => {
                                return (
                                    <View key={index} style={style.dataContainer}>
                                        <View style={style.eventsList}>
                                            <View style={style.imageAndSymbol}>
                                                <Image style={style.imageById} source={{ uri: IMAGE_PATH.imageurl + `${item.coins[0].id}_normal.png` }} />
                                                <Text ellipsizeMode='tail' numberOfLines={1} style={style.titleText}>{item.coins[0].name} ({item.coins[0].symbol})</Text>
                                            </View>
                                            <Text style={style.eventDate}>{moment(`${item.date_event}`).format('DD MMMM YYYY')}</Text>
                                            {item.description ? <Text numberOfLines={2} style={style.descriptionText}>{item.description.en}</Text> : null}
                                            <TouchableHighlight style={style.source} onPress={() => { Linking.openURL(`${item.original_source}`) }} underlayColor='lightblue'><Text style={style.sourceText}>Read more</Text></TouchableHighlight>
                                            <View style={style.viewsAndVotes}>
                                                <View style={style.viewsAndVotesRow}>
                                                    <Text style={style.votes}>Votes: </Text>
                                                    <Text style={style.viewsAndVotesValue}>{item.vote_count}</Text>
                                                </View>
                                                <View style={style.viewsAndVotesRow}>
                                                    <Text style={style.views}>Views: </Text>
                                                    <Text style={style.viewsAndVotesValue}>{item.view_count}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <Text style={style.eventCreatedDate}>Added on - {moment(`${item.created_date}`).format('DD MMMM YYYY')}</Text>
                                    </View>
                                )
                            }}
                        />
                    </View>
                </View>

            );

        }
    }
}
const style = StyleSheet.create({
    viewsAndVotesRow: {
        flexDirection: 'row'
    },
    viewsAndVotesValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'green'
    },
    footer: {
        height: 50,
        width: '100%',
        backgroundColor: 'white'
    },
    modalView: {
        marginTop: 10,
        margin: 20,
        backgroundColor: "#fffafa",
        borderRadius: 20,
        borderWidth: 0.5,
        paddingTop: 35,
        paddingLeft: 20,
        paddingRight: 30,
        alignItems: "center",
        shadowColor: "#000",
        height: 380,
        elevation: 30,
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
    button: {
        padding: 5,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: '#5142a9',
        height: 30,
        width: 100
    },
    buttonClose: {
        backgroundColor: "#3F51B5",
        borderRadius: 50
    },
    advanceFilterTextStyle: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
        marginLeft: '3%'
    },
    advancedFilterButton: {
        flexDirection: 'row',
        width: 190,
        height: 33,
        backgroundColor: '#3F51B5',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    headerlabelsContainer: {
        width: '100%'
    },
    headerlabels: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: 'lightgrey',
        height: 50,
        borderBottomWidth: 1
    },
    labels: {
        height: 30,
        paddingTop: 10,
        paddingLeft: 25,
        fontSize: 15,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    filtersHeading: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#F75626'
    },
    CalendarViewStyle: {
        width: '85%',
        height: 40,
        paddingTop: 10,
        backgroundColor: '#eff2f5',
        borderBottomColor: '#F75626',
        borderBottomWidth: 1,
        marginLeft: '6%',
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
    selectTextStyle: {
        width: 100,
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white'

    },
    selectDate: {
        fontSize: 15,
        paddingLeft: 40,
        color: 'grey'
    },
    filterContainer: {
        paddingBottom: 10,
        backgroundColor: 'white',
        height: 100
    },
    filterHeading: {
        height: 20,
        marginTop: 10,
        fontWeight: 'bold',
        marginLeft: '2%',
        fontSize: 15
    },
    search: {
        marginTop: 23,
        height: 35,
        width: '35%',
        backgroundColor: '#3F51B5',
        textAlign: 'center',
        alignSelf: 'flex-end',
        marginRight: '9%',
        paddingTop: 6,
        marginBottom: 5,
        borderRadius: 50,
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold'
    },
    DropDownPicker: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '3%',
        marginBottom: '2%'
    },
    filtersText: {
        width: '96%',
        display: 'flex',
        flexDirection: 'row',
        marginTop: '2%',
        marginLeft: '2%',
        height: 40
    },
    pasteventsText: {
        width: '33%',
        height: 30,
        marginRight: '0.3%',
        borderColor: 'black',
        borderWidth: 0.8,
        textAlign: 'center',
        borderColor: 0.8,
        paddingTop: 4
    },
    neweventsText: {
        width: '33%',
        height: 30,
        borderWidth: 0.5,
        borderColor: 'black',
        marginRight: '0.4%',
        textAlign: 'center',
        paddingTop: 4,
        color: 'white',
        backgroundColor: '#F75626'
    },
    HighlightsText: {
        width: '33%',
        marginRight: '0.4%',
        height: 30,
        borderColor: 'black',
        borderWidth: 0.8,
        textAlign: 'center',
        paddingTop: 4
    },
    eventsDataList: {
        paddingTop: '2%',
        height: '100%',
        width: '97%',
        marginLeft: '2%',
        backgroundColor: 'white',
        paddingBottom: 240
    },
    dataContainer: {
        borderRadius: 5,
        paddingBottom: 0,
        fontWeight: "bold",
        height: 170,
        backgroundColor: 'white',
        elevation: 5,
        borderColor: 'black',
        borderWidth: 0.6,
        width: '49%',
        marginBottom: '2%',
        marginRight: '1.3%',
    },
    eventDate: {
        fontSize: 11,
        fontWeight: 'bold',
        color: 'green',
        marginTop: 4,
        textAlign: 'center'
    },
    views: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#8c8c8c'
    },
    votes: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#8c8c8c'
    },
    viewsAndVotes: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
        paddingLeft: 10,
        paddingRight: 10
    },
    eventCreatedDate: {
        height: 24,
        fontWeight: 'bold',
        padding: 4,
        textAlign: 'center',
        width: '100%',
        fontSize: 12,
        alignSelf: 'center',
        color: 'white',
        borderBottomStartRadius: 2,
        borderBottomEndRadius: 2,
        backgroundColor: '#3F51B5',
    },
    imageAndSymbol: {
        width: '80%',
        display: 'flex',
        flexDirection: 'row',
        marginTop: 8,
        marginLeft: '5%',
        justifyContent: 'center',
    },
    imageById: {
        marginLeft: '10%',
        width: 25,
        height: 25,
        borderRadius: 12,
        marginRight: 2
    },
    titleText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 2,
        marginTop: 4
    },
    descriptionText: {
        fontSize: 12,
        color: '#525252',
        fontWeight: 'bold',
        paddingLeft: 10,
        marginTop: 7,
        paddingRight: 10
    },
    source: {
        height: 20,
        width: '50%',
        textAlign: 'center',
        marginTop: 8,
        fontSize: 10,
        alignSelf: 'center',
        color: 'white',
        borderRadius: 50,
        backgroundColor: '#3F51B5',
    },
    sourceText: {
        marginTop: '1%',
        color: 'white',
        textAlign: 'center',
        fontSize: 12.5,
        fontWeight: 'bold'
    },
    eventsList: {
        height: 145
    },
    eventsContainer: {
        flex: 1
    },
    noFiltersData: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        marginTop: '30%'
    },
    noFilterDataText: {
        fontSize: 20
    },
    coinSuggestionsView: {
        height: 50,
        backgroundColor: 'white',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 0.6,
        borderColor: 'lightgrey',
        elevation: 10
    },
    coinSuggestionsImage: {
        height: 30,
        width: 30,
        marginLeft: 15,
        marginTop: 10
    },
    coinSuggestionsText: {
        color: 'black',
        marginLeft: 15,
        marginTop: 15
    },
    CategorySuggestionsText: {
        height: 50,
        paddingLeft: 20,
        paddingTop: 20,
        backgroundColor: 'white',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 0.6,
        borderColor: 'lightgrey',
        elevation: 10
    },
    commonTextInput: {
        marginLeft: '6%',
        position: 'relative',
        width: '85%'
    },
    ImageAndTextInput: {
        display: 'flex',
        flexDirection: 'row'
    },
    ImageView: {
        height: 35,
        borderBottomWidth: 1,
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
    coinTextInput: {
        height: 35,
        width: '78%',
        borderBottomWidth: 1,
        borderBottomColor: '#F75626',
        paddingLeft: 5,
        backgroundColor: '#eff2f5'
    },
    suggestionsContainer: {
        position: 'absolute',
        width: '100%',
        marginTop: 38,
        height: 150,
        zIndex: 1
    },
    categorytextInput: {
        height: 35,
        width: '90%',
        paddingLeft: 40,
        borderBottomColor: '#F75626',
        borderBottomWidth: 1,
        backgroundColor: '#eff2f5'
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
    noDataText: {
        textAlign: 'center',
        paddingTop: 10
    },
    coinValueDeleteIcon: {
        width: '10%',
        height: 35,
        backgroundColor: '#eff2f5',
        paddingTop: 5,
        borderBottomColor: '#F75626',
        borderBottomWidth: 1
    },
    categoryValueDeleteIcon: {
        width: '10%',
        height: 35,
        borderBottomColor: '#F75626',
        borderBottomWidth: 1,
        backgroundColor: '#eff2f5',
        paddingTop: 5
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
    }
});
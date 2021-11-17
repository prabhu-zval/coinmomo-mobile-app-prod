import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Text, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { AntDesign, Entypo } from '@expo/vector-icons';
import { API } from '../../services/apiService'
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as _ from 'lodash'
import { LoginContext } from '../../context/context'
import { IMAGE_PATH } from '../../utils/constants';
import { TouchableHighlight } from "react-native-gesture-handler";

let communityDataObj
let tagsDataObj
const ForumSearch = (props) => {
    const [title, setTitle] = useState('')
    const [titleLabel, setTitleLabel] = useState(false)
    const [titleArrow, setTitleArrow] = useState(false)
    const [titleData, setTitleData] = useState([])
    const [titleDataObj, setTitleDataObj] = useState([])
    const [categoryLoading, setCategoryLoading] = useState(false)
    const [noCategoryData, setNoCategoryData] = useState(false)
    const [categoryInputValue, setCategoryInputValue] = useState(null)
    const [categoryRenderData, setCategoryRenderData] = useState(null)
    const [categoryLabel, setCategoryLabel] = useState(false)
    const [categoryArrow, setCategoryArrow] = useState(false)
    const [communityLoading, setCommunityLoading] = useState(false)
    const [noCommunityData, setNoCommunityData] = useState(false)
    const [communityInputValue, setCommunityInputValue] = useState(null)
    const [communityRenderData, setCommunityRenderData] = useState(null)
    const [communityArrow, setCommunityArrow] = useState(false)
    const [communityLabel, setCommunityLabel] = useState(false)
    const [tagsLabel, setTagsLabel] = useState(false)
    const [mapData, settagsData] = useState([])
    const [data, setdata] = useState([])
    const [tagsArrow, setTagsArrow] = useState(false)
    const [tagInputValue, setTagInputValue] = useState('')
    const [tagsLoading, setTagsLoading] = useState(false)
    const [noTagsData, setNoTagsData] = useState(false)
    const [dateInputValue, setDateInputValue] = useState(null)
    const [dateRenderData, setDateRenderData] = useState([])
    const [dateLabel, setDateLabel] = useState(false)
    const [dateArrow, setDateArrow] = useState(false)
    const { titleValue, setTitleValue, communityValueItem, setCommunityValueItem, dateValueItem, setDatevalueItem, categoryValueItem, setCategoryvalueItem, tagsValue, setTagsValue, setSortTitle, setSortCategory, setSortCommunity, setSortTags, setSortDate } = useContext(LoginContext)

    useEffect(() => {
        (async () => {
            setTitle(titleValue)
            setCategoryInputValue(categoryValueItem)
            setCommunityInputValue(communityValueItem)
            setTagInputValue(tagsValue)
            setDateInputValue(dateValueItem)
            communityDataObj = await API.request('fetchCommunity', undefined, 'GET', null, null, null, null);
            tagsDataObj = await API.request('findTags', undefined, 'GET', null, null, null, null, null)
            let titleObj = await API.request('fetchTitle', undefined, 'GET', null, null, null, null)
            setTitleDataObj(titleObj)
        })()
    }, [])

    const onChangeCategory = async (categoryName) => {
        setCategoryLoading(true)
        setNoCategoryData(false)
        setCategoryArrow(true)
        let categoryData = await AsyncStorage.getItem('categoryData')
        categoryData = await JSON.parse(categoryData)
        setCategoryRenderData(categoryData)
        if (categoryName) {
            const filterCategories = categoryData.filter((val) => val.name.toLowerCase().startsWith(categoryName.toLowerCase()))
            const sortCategories = filterCategories.sort((initial, final) => initial.name - final.name)
            const suggestions = sortCategories.map((item) => ({
                id: item.id.toString(),
                name: item.name
            }))
            setCategoryRenderData(suggestions)
            setCategoryLoading(false)
            if (suggestions.length == 0) {
                setNoCategoryData(true)
            }
        } else {
            setCategoryLoading(false)
            setCategoryArrow(false)
        }
    }

    const onChangeTitle = (titleName) => {
        setTitle(titleName)
        setTitleData(titleDataObj)
        if (titleName) {
            let titleObj = titleDataObj.filter((val) => {
                if (val.title.toLowerCase().indexOf(titleName.toLowerCase()) != -1 && titleName != '') {
                    return 1
                }
            })
            titleObj = [{ title: '' }, ...titleObj]
            titleObj[0].title = titleName
            if (titleObj.length > 1) {
                if (titleObj[0].title == titleObj[1].title) {
                    titleObj.splice(0, 1)
                    setTitleData(titleObj)
                }
                else {
                    setTitleData(titleObj)
                }
            }
            else {
                setTitleData(titleObj)
            }
        }
        if (titleName == '') {
            setTitleValue(titleName)
            setTitleData(titleDataObj)
        }
    }
    const onBlurTitle = () => {
        if (!title) {
            setTitleLabel(false)
        }
        setTitleArrow(false)
        setTitle(titleValue)
        setTitleData([])
    }
    const onChangeCommunity = async (communityName) => {
        setCommunityRenderData(communityDataObj)
        setCommunityLoading(true)
        setNoCommunityData(false)
        setCommunityArrow(true)
        if (communityName) {
            const filterCategories = communityDataObj && communityDataObj.filter((val) => val.toLowerCase().startsWith(communityName.toLowerCase()))
            const sortCategories = filterCategories.sort((initial, final) => initial.name - final.name)
            let suggestions = sortCategories.map((item) => item)
            setCommunityRenderData(suggestions)
            setCommunityLoading(false)
            if (suggestions.length == 0) {
                setNoCommunityData(true)
            }
        } else {
            setCommunityLoading(false)
            setCommunityArrow(false)
        }
    }
    const onCommunitySelect = (name, id) => {
        setCommunityInputValue(name);
        setCommunityRenderData(null);
        setCommunityValueItem(name)
        setCommunityArrow(false)
        Keyboard.dismiss();
    }
    const onBlurCommunity = () => {
        if (!communityInputValue) {
            setCommunityLabel(false)
        }
        setCommunityRenderData([])
        setNoCommunityData(false)
        setCommunityArrow(false)
        setNoCommunityData(false)
        setCommunityInputValue(communityValueItem)
    }
    const addTags = async (tagName) => {
        setTagInputValue(tagName)
        setTagsLabel(true)
        setNoTagsData(false)
        setTagsLoading(true)
        let tagsObj = tagsDataObj
        if (tagName) {
            setdata(tagsObj)
            let tagsData = data && data.filter((val) => val.toLowerCase().startsWith(tagName.toLowerCase()))
            settagsData(tagsData)
            setTagsLoading(false)
            if (tagsData.length == 0) {
                setNoTagsData(true)
            }
        } else {
            setdata(tagsObj)
            setTagsLabel(true)
            setdata(tagsObj),
                settagsData(tagsObj)
            setTagsLoading(false)
            setNoTagsData(false)
        }
    }
    const onTagSelect = async (tagName, id) => {
        setTagInputValue(tagName)
        setTagsValue(tagName)
        setTagsArrow(false)
        setTagsLabel(true)
        Keyboard.dismiss()
        settagsData([])
    }
    const onBlurTags = () => {
        setTagInputValue(tagsValue)
        settagsData([])
        if (!tagInputValue) {
            setTagsLabel(false)
        }
        setTagsArrow(false)
    }
    const onSelectCateogry = (name, id) => {
        setCategoryInputValue(name);
        setCategoryRenderData(null);
        setCategoryArrow(false);
        setCategoryvalueItem(name);
        Keyboard.dismiss();
    }
    const onBlurCategory = () => {
        setCategoryRenderData(null)
        if (!categoryValueItem) {
            setCategoryLabel(false)
        }
        setCategoryInputValue(categoryValueItem)
    }
    const onChangeDate = () => {
        let trending = ["24hour", "7days", "1month"]
        setDateRenderData(trending)
    }
    const onBlurDate = () => {
        if (dateInputValue == null) {
            setDateLabel(false)
        }
        setDateArrow(false)
        setDateInputValue(dateValueItem)
        setDateRenderData([])
    }
    const onSearch = () => {
        setSortTitle(title)
        setSortCategory(categoryInputValue)
        setSortCommunity(communityInputValue)
        setSortDate(dateInputValue)
        tagInputValue ? setSortTags([tagInputValue]) : setSortTags([])
        props.navigation.navigate('forum')
    }
    const onClear = () => {
        setSortTitle(null)
        setSortCategory(null)
        setSortCommunity(null)
        setSortDate(null)
        setSortTags([])
        setTitleValue(null)
        setCategoryvalueItem(null)
        setCommunityValueItem(null)
        setTagsValue(null)
        setDatevalueItem(null)
        props.navigation.navigate('forum')
    }
    return (
        <TouchableWithoutFeedback
            onPress={() => { Keyboard.dismiss(); setCategoryRenderData(null); setCommunityRenderData(null), settagsData([]), setCategoryArrow(false), setCommunityArrow(false), setTagsArrow(false) }}>
            <View style={style.searchContainer}>
                <View style={style.threadIconAndText}>
                    <View style={style.threadView}><Image style={style.coimmomoLogo} source={IMAGE_PATH.logo} /></View>
                </View>
                <View style={style.IconAndText}>
                    <Text style={style.coinName}>Advance Search</Text>
                </View>
                <View style={style.titleAndTextInput}>
                    {titleLabel ? <Text style={style.label}>Search by title</Text> : <Text style={style.label}></Text>}
                    <View style={style.commonTextInput}>
                        <View style={style.textInputs}>
                            <TextInput maxLength={150} onBlur={() => { onBlurTitle() }} value={title} placeholder={titleLabel ? '' : 'Search by title'} style={titleLabel ? style.titleLabelInput : style.titletextInput} onChangeText={(text) => { onChangeTitle(text) }} onFocus={() => { setTitleLabel(true); setTitleArrow(true); setTitle(null); onChangeTitle() }} autoCorrect={false} />
                            <View style={titleLabel ? style.titleDeleteInput : style.titleDelete}>
                                {titleValue ? <Entypo onPress={() => { setTitle(''); setTitleValue(''); setTitleLabel(false) }} name="cross" size={20} color="gray" /> : null}
                            </View>
                            <View style={titleLabel ? style.titleArrowInput : style.titleArrow}>
                                {!titleArrow ? <AntDesign onPress={() => { setTitleLabel(true); setTitleArrow(true); onChangeTitle() }} name="down" size={16} color="grey" /> : <AntDesign onPress={() => { setTitleLabel(false); setTitleArrow(false); setTitleData([]) }} name="up" size={16} color="grey" />}
                            </View>
                        </View>
                    </View>
                    {titleData.length > 0 ? <View style={style.titleSuggestionContainer}>
                        <ScrollView keyboardShouldPersistTaps={'handled'} >
                            {titleData.length > 0 && titleData.map((val, index) => {
                                return (
                                    <View key={index} >
                                        <TouchableHighlight underlayColor='blue' autoCorrect={false} onPress={() => { setTitle(val.title); setTitleValue(val.title); setTitleArrow(false); setTitleData([]); Keyboard.dismiss(); }}>
                                            <Text style={[style.titleSuggestionsText, { backgroundColor: index % 2 == 0 ? '#e6e6e6' : 'white' }]}>{val.title}</Text>
                                        </TouchableHighlight>
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </View> : null}
                </View>
                <View style={style.titleAndTextInput}>
                    {categoryLabel ? <Text style={style.label}>Search by category</Text> : <Text style={style.label}></Text>}
                    <View style={style.commonTextInput}>
                        <View style={style.textInputs}>
                            <TextInput onBlur={() => { onBlurCategory() }} value={categoryInputValue} placeholder={categoryLabel ? '' : 'Search by category'} style={categoryLabel ? style.categoryLabelInput : style.categorytextInput} onChangeText={(text) => onChangeCategory(text)} onFocus={() => { setCategoryLabel(true); setCategoryInputValue(null); onChangeCategory() }} autoCorrect={false} />
                            <View style={categoryLabel ? style.categoryDeleteInput : style.categoryDelete}>
                                {categoryInputValue ? <Entypo onPress={() => { setCategoryInputValue(null); setCategoryLabel(false); setCategoryvalueItem(null); }} name="cross" size={20} color="gray" /> : null}
                            </View>
                            <View style={categoryLabel ? style.categoryArrowInput : style.categoryArrow}>
                                {!categoryArrow ? <AntDesign onPress={() => { setCategoryLabel(true); setCategoryArrow(true); onChangeCategory() }} name="down" size={16} color="grey" /> : <AntDesign onPress={() => { setCategoryLabel(false); setCategoryArrow(false); setCategoryRenderData(null); setCategoryInputValue(null) }} name="up" size={16} color="grey" />}
                            </View>
                        </View>
                        {categoryLoading ? <View style={style.loadingView}><Text style={{ backgroundColor: 'lightgray' }}>loading...<Text></Text></Text><ActivityIndicator size={25} color='blue' /></View> : null}
                        {categoryRenderData ? <View style={style.suggestionsContainer}>
                            <ScrollView keyboardShouldPersistTaps={'handled'} >
                                {noCategoryData ? <View style={style.noDataView}><Text style={style.noDataText} >NO DATA AVAILABLE</Text></View> : <View></View>}
                                {categoryRenderData && categoryRenderData.map((val, item) => {
                                    return (
                                        <View key={item} >
                                            <TouchableHighlight underlayColor='blue' onPress={() => { onSelectCateogry(val.name, val.id) }}>
                                                <Text style={[style.commonSuggestionsText, { backgroundColor: item % 2 == 0 ? '#e6e6e6' : 'white' }]} >{val.name}</Text>
                                            </TouchableHighlight>
                                        </View>
                                    )
                                })}
                            </ScrollView>
                        </View> : null}
                    </View>
                </View>
                <View style={style.titleAndTextInput}>
                    {communityLabel ? <Text style={style.label}>Search by Community</Text> : <Text style={style.label}></Text>}
                    <View style={style.commonTextInput}>
                        <View style={style.textInputs}>
                            <TextInput onBlur={() => { onBlurCommunity() }} value={communityInputValue} placeholder={communityLabel ? '' : 'Search by community'} style={communityLabel ? style.communityInput : style.communitytextInput} onChangeText={(text) => onChangeCommunity(text)} onFocus={() => { setCommunityLabel(true); setCommunityInputValue(null), onChangeCommunity(), setCommunityArrow(true) }} autoCorrect={false} />
                            <View style={communityLabel ? style.communityDeleteInput : style.communityDelete}>
                                {communityInputValue ? <Entypo onPress={() => { setCommunityInputValue(null); setCommunityLabel(false); setCommunityValueItem(null) }} name="cross" size={20} color="gray" /> : null}
                            </View>
                            <View style={communityLabel ? style.communityArrowInput : style.communityArrow}>
                                {!communityArrow ? <AntDesign onPress={() => { setCommunityArrow(true); setCommunityLabel(true); onChangeCommunity() }} name="down" size={16} color="grey" /> : <AntDesign onPress={() => { setCommunityLabel(false); setCommunityArrow(false); setCommunityRenderData(null); setCommunityInputValue(null) }} name="up" size={16} color="grey" />}
                            </View>
                        </View>
                        {communityLoading ? <View style={style.loadingView}><Text>loading...<Text></Text></Text><ActivityIndicator size={25} color='blue' /></View> : null}
                        {communityRenderData ? <View style={style.suggestionsContainer}>
                            <ScrollView keyboardShouldPersistTaps={'handled'} >
                                {noCommunityData ? <View style={style.noDataView}><Text style={style.noDataText} >NO DATA AVAILABLE</Text></View> : <View></View>}
                                {communityRenderData && communityRenderData.map((val, item) => {
                                    return (
                                        <View key={item} >
                                            <TouchableHighlight underlayColor='blue' onPress={() => { onCommunitySelect(val) }}>
                                                <Text style={[style.commonSuggestionsText, { backgroundColor: item % 2 == 0 ? '#e6e6e6' : 'white' }]}>{val}</Text>
                                            </TouchableHighlight>
                                        </View>
                                    )
                                })}
                            </ScrollView>
                        </View> : null}
                    </View>
                </View>
                <View style={style.titleAndTextInput}>
                    {tagsLabel ? <Text style={style.label}>Search by tags</Text> : <Text style={style.label}></Text>}
                    <View style={style.textInputs}>
                        <TextInput value={tagInputValue} onFocus={() => { settagsData([]); setTagsLabel(true); setTagsArrow(true); settagsData(data); addTags() }} onBlur={() => { onBlurTags() }} placeholder={'Search by tags'} onChangeText={(text) => addTags(text)} style={tagsLabel ? style.addTagsViewLabel : style.addTagsView} />
                        <View style={tagsLabel ? style.categoryDeleteInput : style.categoryDelete}>
                            {tagInputValue ? <Entypo onPress={() => { setTagInputValue(null); setTagsValue(null); setTagsLabel(false); setTagsArrow(false); settagsData([]) }} name="cross" size={20} color="gray" /> : null}
                        </View>
                        <View style={tagsLabel ? style.tagsArrowLabel : style.tagsArrow}>
                            {!tagsArrow ? <AntDesign onPress={() => { settagsData(data); setTagsLabel(true); addTags(); setTagsArrow(true) }} name="down" size={16} color="grey" /> : <AntDesign onPress={() => { setTagsLabel(false); setTagsArrow(false); settagsData([]) }} name="up" size={16} color="grey" />}
                        </View>
                    </View>
                    {tagsLoading ? <View style={style.loadingView}><Text>loading...<Text></Text></Text><ActivityIndicator size={25} color='blue' /></View> : null}
                    {noTagsData ? <View style={style.noDataView}><Text style={style.noDataText} >NO DATA AVAILABLE</Text></View> : null}
                    {mapData.length > 0 ? <View style={style.tagsSuggestionsContainer}>
                        <ScrollView keyboardShouldPersistTaps={'handled'} >
                            {mapData.length > 0 && mapData.map((val, item) => {
                                return (
                                    <View key={item} >
                                        <TouchableHighlight underlayColor='blue' onPress={() => { onTagSelect(val) }}>
                                            <Text style={[style.commonSuggestionsText, { backgroundColor: item % 2 == 0 ? '#e6e6e6' : 'white' }]}>{val}</Text>
                                        </TouchableHighlight>
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </View> : null}
                </View>

                <View style={style.titleAndTextInput}>
                    {dateLabel ? <Text style={style.label}>Search by trending</Text> : <Text style={style.label}></Text>}
                    <View style={style.commonTextInput}>
                        <View style={style.textInputs}>
                            <TextInput onBlur={() => { onBlurDate() }} value={dateInputValue} placeholder={dateLabel ? '' : 'Search by trending'} style={dateLabel ? style.categoryLabelInput : style.categorytextInput} onChangeText={(text) => onChangeDate(text)} onFocus={() => { setDateLabel(true); setDateInputValue(null); onChangeDate(); setDateArrow(true) }} autoCorrect={false} />
                            <View style={dateLabel ? style.categoryDeleteInput : style.categoryDelete}>
                                {dateInputValue ? <Entypo onPress={() => { setDateInputValue(null); setDateLabel(false); setDatevalueItem(null); Keyboard.dismiss() }} name="cross" size={20} color="gray" /> : null}
                            </View>
                            <View style={dateLabel ? style.categoryArrowInput : style.categoryArrow}>
                                {!dateArrow ? <AntDesign onPress={() => { setDateLabel(true); setDateArrow(true); onChangeDate() }} name="down" size={16} color="grey" /> : <AntDesign onPress={() => { setDateLabel(false); setDateArrow(false); setDateRenderData([]); setDateInputValue(null) }} name="up" size={16} color="grey" />}
                            </View>
                        </View>
                        {dateRenderData.length > 0 ? <View style={style.suggestionsContainer}>
                            <ScrollView keyboardShouldPersistTaps={'handled'} keyboardDismissMode={'interactive'} >
                                {dateRenderData.length > 0 && dateRenderData.map((val, item) => {
                                    return (
                                        <View key={item} >
                                            <TouchableHighlight underlayColor='blue' onPress={() => { setDateInputValue(val); setDatevalueItem(val); setDateRenderData([]); setDateArrow(false); Keyboard.dismiss() }}>
                                                <Text style={[style.commonSuggestionsText, { backgroundColor: item % 2 == 0 ? '#e6e6e6' : 'white' }]} >{val}</Text>
                                            </TouchableHighlight>
                                        </View>
                                    )
                                })}
                            </ScrollView>
                        </View> : null}
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity activeOpacity={.9} onPress={() => onSearch()} style={style.searchView}>
                        <Text style={style.searchText}>Search</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.9} onPress={() => onClear()} style={style.searchView}>
                        <Text style={style.searchText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
const style = StyleSheet.create({
    bottomOptions: {
        marginLeft: '5%',
        width: '90%',
        display: 'flex',
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    threadIconAndText: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '3%',
        paddingBottom: 5,
        height: 70,
        backgroundColor: 'white',
        paddingTop: 25,
        borderBottomWidth: 0.5,
        borderBottomColor: 'black',
    },
    threadView: {
        zIndex: -1,
        position: 'absolute',
        width: '100%',
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    coimmomoLogo: {
        width: 150,
        height: 40
    },
    searchContainer: {
        backgroundColor: 'white',
        height: '100%',
        width: '100%'
    },
    searchView: {
        display: 'flex',
        marginTop: '10%',
        alignSelf: 'center',
        width: '35%',
        marginLeft: '10%',
    },
    searchText: {
        marginTop: 20,
        fontSize: 15,
        fontWeight: 'bold',
        backgroundColor: '#3F51B5',
        borderRadius: 50,
        color: 'white',
        padding: 10,
        textAlign: 'center'
    },
    coinName: {
        marginTop: 12,
        marginLeft: 5,
        fontSize: 20,
        color: 'white',
        zIndex: -1,
        position: 'absolute',
        width: '100%',
        fontWeight: 'bold',
        textAlign: 'center',
        justifyContent: 'center',
    },
    IconAndText: {
        height: 55,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: '#F75626'
    },
    titleAndTextInput: {
        width: '100%',
        height: 75,
        marginTop: '3%',
        paddingLeft: '5%',
        paddingRight: '5%',
        backgroundColor: 'green'
    },
    suggestionsContainer: {
        width: '100%',
        height: 150,
        zIndex: 1,
        elevation: 20,
    },
    addTitleTextInput: {
        borderBottomWidth: 1,
        borderColor: '#F75626',
        marginLeft: '3%',
        height: 40,
        width: "94%",
        paddingLeft: '5%'
    },
    textInputs: {
        display: 'flex',
        flexDirection: 'row'
    },
    titleLabelInput: {
        height: 40,
        width: '80%',
        paddingLeft: '5%',
        borderWidth: 1.5,
        borderRightWidth: 0,
        borderColor: '#F75626',
        backgroundColor: 'white',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    },
    titletextInput: {
        height: 40,
        width: '80%',
        paddingLeft: '5%',
        borderBottomWidth: 1.5,
        borderColor: '#F75626',
        backgroundColor: 'white'
    },
    titleDeleteInput: {
        width: '10%',
        borderWidth: 1.5,
        borderColor: '#F75626',
        borderLeftWidth: 0,
        borderRightWidth: 0,
        height: 40,
        paddingTop: 10,
        paddingLeft: '3%',
        backgroundColor: 'white'
    },
    titleDelete: {
        width: '10%',
        borderBottomWidth: 1.5,
        borderColor: '#F75626',
        height: 40,
        paddingTop: 13,
        paddingLeft: '3%',
        backgroundColor: 'white'
    },
    titleArrowInput: {
        width: '10%',
        borderWidth: 1.5,
        borderColor: '#F75626',
        borderLeftWidth: 0,
        height: 40,
        paddingTop: 15,
        paddingLeft: '3%',
        backgroundColor: 'white',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5
    },
    titleArrow: {
        width: '10%',
        borderBottomWidth: 1.5,
        borderColor: '#F75626',
        height: 40,
        paddingTop: 15,
        paddingLeft: '3%',
        backgroundColor: 'white'
    },
    titleSuggestionContainer: {
        width: '100%',
        height: 150,
        zIndex: 1,
        elevation: 20,
    },
    titleSuggestionsText: {
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 5,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: 'grey',
        elevation: 10,
        color: 'black'
    },
    titleCharacters: {
        paddingTop: 1,
        marginLeft: 2,
        color: 'grey'
    },

    textInputs: {
        display: 'flex',
        flexDirection: 'row'
    },
    renderTagsView: {
        display: 'flex',
        height: 30,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'lightgrey',
        marginLeft: 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 2,
        borderRadius: 5
    },
    Icon: {
        width: 40,
        paddingLeft: 10
    },
    titleAndTextInput: {
        width: '100%',
        height: 75,
        marginTop: '3%',
        paddingLeft: '5%',
        paddingRight: '5%'
    },
    label: {
        color: 'gray',
        fontSize: 15,
        fontWeight: 'normal',
        marginBottom: '2%',
        height: 23
    },
    titleInputBox: {
        width: '90%',
        height: 40,
        borderWidth: 1.5,
        borderColor: '#F75626',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRightWidth: 0,
        borderRadius: 5,
        paddingLeft: '5%'
    },
    titleStarInputBox: {
        width: '10%',
        height: 40,
        borderWidth: 1.5,
        borderColor: '#F75626',
        borderRadius: 5,
        borderLeftWidth: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        paddingLeft: '5%'
    },
    titleTextInput: {
        width: '90%',
        height: 40,
        borderBottomWidth: 1.5,
        borderColor: '#F75626',
        paddingLeft: '5%',
        paddingRight: '1%'
    },
    titleStarTextInput: {
        width: '10%',
        height: 40,
        borderBottomWidth: 1.5,
        borderColor: '#F75626',
        paddingLeft: '5%'
    },
    suggestionsContainer: {
        position: 'absolute',
        width: '100%',
        marginTop: 45,
        height: 150,
        zIndex: 1,
        elevation: 20,
    },
    tagsSuggestionsContainer: {
        width: '100%',
        height: 150,
        zIndex: 1,
        elevation: 20
    },
    categorytextInput: {
        height: 40,
        width: '80%',
        paddingLeft: '5%',
        borderBottomWidth: 1.5,
        borderColor: '#F75626',
        backgroundColor: 'white'
    },
    categoryLabelInput: {
        height: 40,
        width: '80%',
        paddingLeft: '5%',
        borderWidth: 1.5,
        borderRightWidth: 0,
        borderColor: '#F75626',
        backgroundColor: 'white',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    },
    categoryArrow: {
        width: '10%',
        borderBottomWidth: 1.5,
        borderColor: '#F75626',
        height: 40,
        paddingTop: 15,
        paddingLeft: '3%',
        backgroundColor: 'white'
    },
    categoryDeleteInput: {
        width: '10%',
        borderWidth: 1.5,
        borderColor: '#F75626',
        borderLeftWidth: 0,
        borderRightWidth: 0,
        height: 40,
        paddingTop: 10,
        paddingLeft: '3%',
        backgroundColor: 'white',
    },
    categoryDelete: {
        width: '10%',
        borderBottomWidth: 1.5,
        borderColor: '#F75626',
        height: 40,
        paddingTop: 13,
        paddingLeft: '3%',
        backgroundColor: 'white'
    },
    categoryArrowInput: {
        width: '10%',
        borderWidth: 1.5,
        borderColor: '#F75626',
        borderLeftWidth: 0,
        height: 40,
        paddingTop: 15,
        paddingLeft: '3%',
        backgroundColor: 'white',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5
    },
    communitytextInput: {
        height: 40,
        width: '80%',
        paddingLeft: '5%',
        borderBottomWidth: 1.5,
        backgroundColor: 'white',
        borderColor: '#F75626',
    },
    communityArrow: {
        width: '10%',
        borderBottomWidth: 1.5,
        height: 40,
        paddingTop: 15,
        paddingLeft: '3%',
        backgroundColor: 'white',
        borderColor: '#F75626',
    },
    communityInput: {
        height: 40,
        width: '80%',
        paddingLeft: '5%',
        borderWidth: 1.5,
        borderRightWidth: 0,
        backgroundColor: 'white',
        borderColor: '#F75626',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    },
    communityArrowInput: {
        width: '10%',
        borderWidth: 1.5,
        borderLeftWidth: 0,
        height: 40,
        paddingTop: 15,
        paddingLeft: '3%',
        backgroundColor: 'white',
        borderColor: '#F75626',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5
    },
    communityDeleteInput: {
        width: '10%',
        borderWidth: 1.5,
        borderColor: '#F75626',
        borderLeftWidth: 0,
        borderRightWidth: 0,
        height: 40,
        paddingTop: 10,
        paddingLeft: '3%',
        backgroundColor: 'white',
    },
    communityDelete: {
        width: '10%',
        borderBottomWidth: 1.5,
        borderColor: '#F75626',
        height: 40,
        paddingTop: 13,
        paddingLeft: '3%',
        backgroundColor: 'white'
    },
    noDataView: {
        width: '100%',
        display: 'flex',
        backgroundColor: 'lightgray',
        height: 40,
        textAlign: 'center',
        justifyContent: 'center',
        borderWidth: 0.4,
    },
    loadingView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        marginTop: 50,
        backgroundColor: 'lightgray',
        height: 60,
        paddingTop: 10,
        borderWidth: 0.5
    },
    noDataText: {
        textAlign: 'center',
        paddingTop: 10
    },
    commonSuggestionsText: {
        height: 50,
        paddingLeft: 20,
        paddingTop: 20,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 0.6,
        borderColor: 'lightgrey',
        elevation: 10,
        color: 'black'
    },
    addTagsView: {
        height: 'auto',
        width: '80%',
        paddingLeft: '5%',
        borderBottomWidth: 1.5,
        flexWrap: 'wrap',
        borderColor: '#F75626',
        flexDirection: 'row',
        zIndex: 0,
    },
    addTagsViewLabel: {
        height: 'auto',
        width: '80%',
        paddingLeft: '5%',
        borderWidth: 1.5,
        borderRightWidth: 0,
        flexWrap: 'wrap',
        borderColor: '#F75626',
        flexDirection: 'row',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        zIndex: 0
    },
    addTags: {
        width: 0,
        maxWidth: '100%',
        marginLeft: '7%',
        backgroundColor: 'transparent',
        flexGrow: 1,
        zIndex: 1
    },
    tagsArrow: {
        width: '10%',
        borderBottomWidth: 1.5,
        borderColor: '#F75626',
        paddingLeft: '3%',
        paddingTop: '2%'
    },
    tagsLabel: {
        width: '10%',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderColor: '#F75626'
    },
    tagsArrowLabel: {
        width: '10%',
        borderWidth: 1.5,
        borderLeftWidth: 0,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        borderColor: '#F75626',
        paddingLeft: '3%',
        paddingTop: '2%'
    }
});
export default ForumSearch
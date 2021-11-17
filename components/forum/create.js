import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons';
import { API } from '../../services/apiService'
import { IMAGE_PATH } from '../../utils/constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as _ from 'lodash'
import { TouchableHighlight } from "react-native-gesture-handler";

let communityDataObj
let tagsDataObj
let titleDataObj
const ForumCreate = (props) => {
    const [categoryLoading, setCategoryLoading] = useState(false)
    const [noCategoryData, setNoCategoryData] = useState(false)
    const [categoryInputValue, setCategoryInputValue] = useState(null)
    const [categoryRenderData, setCategoryRenderData] = useState(null)
    const [categoryItem, setcategoryItem] = useState(null)
    const [categoryValueItem, setCategoryvalueItem] = useState(null)
    const [communityLoading, setCommunityLoading] = useState(false)
    const [noCommunityData, setNoCommunityData] = useState(false)
    const [communityInputValue, setCommunityInputValue] = useState(null)
    const [communityValueItem, setCommunityValueItem] = useState(null)
    const [communityRenderData, setCommunityRenderData] = useState(null)
    const [communityID, setCommunityID] = useState('')
    const [categoryArrow, setCategoryArrow] = useState(false)
    const [communityArrow, setCommunityArrow] = useState(false)
    const [tagsArrow, setTagsArrow] = useState(false)
    const [titleLabel, setTitleLabel] = useState(false)
    const [categoryLabel, setCategoryLabel] = useState(false)
    const [communityLabel, setCommunityLabel] = useState(false)
    const [tagsLabel, setTagsLabel] = useState(false)
    const [tagsIds, setTagsIds] = useState([])
    const [mapData, settagsData] = useState([])
    const [renderTags, setRender] = useState([])
    const [length, setLength] = useState(0)
    const [title, setTitle] = useState('')
    const [titleValue, setTitleValue] = useState('')
    const [titleError, setTitleError] = useState('')
    const [data, setdata] = useState([])
    const [tagInputValue, setTagInputValue] = useState('')
    const [titleData, setTitleData] = useState([])
    const [urlValue, setUrlValue] = useState(null)
    const [urlLabel, setUrlLabel] = useState(false)
    const [checkUrl, setCheckurl] = useState(false)
    const [urlError, setUrlError] = useState(false)

    useEffect(() => {
        (async () => {
            communityDataObj = await API.request('fetchCommunity', undefined, 'GET', null, null, null, null);
            tagsDataObj = await API.request('findTags', undefined, 'GET', null, null, null, null, null)
            titleDataObj = await API.request('fetchTitle', undefined, 'GET', null, null, null, null, null)
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
    const onChangeCommunity = async (communityName) => {
        setCommunityRenderData(communityDataObj)
        setCommunityLoading(true)
        setNoCommunityData(false)
        setCommunityArrow(true)
        if (communityName) {
            const filterCategories = communityDataObj && communityDataObj.filter((val) => val.toLowerCase().startsWith(communityName.toLowerCase()))
            const sortCategories = filterCategories.sort((initial, final) => initial.name - final.name)
            let suggestions = sortCategories.map((item) => item)
            suggestions = ['', ...suggestions]
            suggestions[0] = communityName
            if (suggestions.length > 1) {
                if (suggestions[0] == suggestions[1]) {
                    suggestions.splice(0, 1)
                    setCommunityRenderData(suggestions)
                    setCommunityLoading(false)
                }
                else {
                    setCommunityRenderData(suggestions)
                    setCommunityLoading(false)
                }
            }
            else {
                setCommunityRenderData(suggestions)
                setCommunityLoading(false)
            }
            if (suggestions.length == 0) {
                setNoCommunityData(true)
                setCommunityLoading(false)

            }
        } else {
            setCommunityRenderData(communityDataObj)
            setCommunityLoading(false)
            setCommunityArrow(false)
        }

    }
    const addTags = async (tagName) => {
        setTagInputValue(tagName)
        setTagsLabel(true)
        let tagsObj = tagsDataObj
        tagsObj = tagsObj && tagsObj.filter(function (el) {
            return renderTags.indexOf(el) < 0;
        });
        if (tagName) {
            setdata(tagsObj)
            let tagsData = data && data.filter((val) => val.toLowerCase().startsWith(tagName.toLowerCase()))
            tagsData = ['', ...tagsData]
            tagsData[0] = tagName
            if (tagsData.length > 1) {
                let index = tagsData.map((obj) => obj).slice(1, tagsData.length).indexOf(tagsData[0])

                if (index != -1) {
                    tagsData.splice(-1, 1)
                    settagsData(tagsData)
                }
                else {
                    settagsData(tagsData)
                }
            }
            else {
                settagsData(tagsData)
            }
        } else {
            setdata(tagsObj)
            setTagsLabel(true)
            setdata(tagsObj),
                settagsData(tagsObj)
        }
    }
    const addTitle = async (title) => {
        if (title) setLength(title.length)
        setTitle(title)
        setTitleData(titleDataObj)
        if (title) {
            setTitleError('')
            let titleObj = titleDataObj.filter((val) => {
                if (val.title.toLowerCase().indexOf(title.toLowerCase()) != -1 && title != '') {
                    return 1
                }
                else {
                    return false
                }
            })
            titleObj = [{ title: '' }, ...titleObj]
            titleObj[0].title = title
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
        if (title == '') {
            setTitleValue(title)
            setTitleData(titleDataObj)
            setLength(0)
            setTitleError('')
        }
    }
    const onClickContinue = () => {
        if (!title) {
            setTitleError('Title is required')
            return
        }
        if (urlValue && checkUrl) {
            setUrlError(true)
            return
        }
        let threadDataObj = {
            title: title,
            category: categoryItem,
            community: communityInputValue,
            tags: renderTags,
            socialLink: urlValue
        }
        props.navigation.navigate('textEditor', threadDataObj)
    }
    const onCommunitySelect = (name, id) => {
        setCommunityInputValue(name);
        setCommunityRenderData(null);
        setCommunityValueItem(name)
        setCommunityArrow(false)
        Keyboard.dismiss();
    }
    const onTagSelect = async (name, id) => {
        if (renderTags.length <= 4) {
            if (renderTags.includes(name)) {
                return
            }
            setRender(renderTags.concat(name))
        };
        setTagInputValue('')
        setTagsArrow(false)
        Keyboard.dismiss()
        settagsData([])
    }
    const onSelectCateogry = (name, id) => {
        setCategoryInputValue(name);
        setCategoryRenderData(null);
        setcategoryItem(name);
        setCategoryArrow(false);
        setCategoryvalueItem(name); Keyboard.dismiss();
    }
    const onBlurCategory = () => {
        setCategoryRenderData(null)
        if (!categoryValueItem) {
            setCategoryLabel(false)
        }
        setCategoryInputValue(categoryValueItem)
    }
    const onBlurCommunity = () => {
        if (!communityValueItem) {
            setCommunityLabel(false)
        }
        setCommunityInputValue(communityValueItem)
    }
    const onBlurTags = () => {
        if (!renderTags.length) {
            setTagsLabel(false)
        }
        settagsData([])
    }
    const onBlurTitle = () => {
        if (!title) {
            setTitleLabel(false)
        }
        setTitleData([])
        setTitleError('')
    }
    const onChangeUrl = (text) => {
        setUrlValue(text)
        var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);
        if (text.match(regex)) {
            setCheckurl(false)
        }
        else {
            setCheckurl(true)
        }
        if (text == '') {
            setCheckurl(false)
        }
    }
    const onBlurUrl = () => {
        if (!urlValue) {
            setUrlLabel(false)
        }
    }
    const onSelectTitle = async (id, title) => {
        if (id) {
            const threadsData = await API.request('thread', undefined, 'POST', null, null, null, null, null, null);
            let selectData = threadsData.filter((val) => val.title == title)
            selectData = Object.assign({}, selectData)
            props.navigation.navigate('forumConversation', { conversationDetails: selectData["0"] })
            setTitle(null);
            setTitleValue(null);
            setLength(title.length);
            Keyboard.dismiss()
        }
        else {
            setTitle(title);
            setTitleValue(title);
            setTitleData([]);
            setLength(title.length);
            Keyboard.dismiss()
        }
    }
    return (
        <TouchableWithoutFeedback
            onPress={() => { Keyboard.dismiss(); setCategoryRenderData(null); setCommunityRenderData(null), settagsData([]), setCategoryArrow(false), setCommunityArrow(false), setTagsArrow(false) }}>
            <View style={style.moreComponent}>
                <View style={style.threadIconAndText}>
                    <View style={style.threadView}><Image style={style.coimmomoLogo} source={IMAGE_PATH.logo} /></View>
                </View>
                <View style={style.borderTop}>
                    <Text style={style.newThreadText}>New Thread</Text>
                </View>
                <View style={style.headingPage}>
                    <Text style={style.startText}>* indicates required</Text>
                </View>
                <View style={style.titleAndTextInput}>
                    {titleLabel ? <View style={style.addTitleView}>
                        <Text style={style.label}>Add Title</Text>
                        <Text style={style.titleCharacters}>(Max Characters {150 - length})</Text>
                    </View> : <View style={style.noTitle}></View>}
                    <View style={style.textInputs}>
                        <TextInput maxLength={150} value={titleValue} onBlur={() => { onBlurTitle() }} onChangeText={(text) => { setTitleValue(text); addTitle(text) }} style={titleLabel ? style.titleInputBox : style.titleTextInput} placeholder={titleLabel ? '' : 'Add Title'} onFocus={() => { setTitleLabel(true); addTitle() }} />
                        <View style={titleLabel ? style.titleStarInputBox : style.titleStarTextInput}><Text style={style.starInput}>*</Text></View>
                    </View>
                    {!title && titleError ? <Text style={style.titleError}>{titleError}</Text> : null}
                    {titleData && titleData.length > 0 ? <View style={style.titleSuggestionContainer}>
                        <ScrollView keyboardShouldPersistTaps={'handled'} >
                            {titleData.length > 0 && titleData.map((val, index) => {
                                return (
                                    <View key={index} >
                                        <TouchableHighlight underlayColor='blue' autoCorrect={false} onPress={() => onSelectTitle(val._id, val.title)}>
                                            <Text style={[style.titleSuggestionsText, { backgroundColor: index % 2 == 0 ? '#e6e6e6' : 'white' }]}>{val.title}</Text>
                                        </TouchableHighlight>
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </View> : null}
                </View>
                <View style={style.titleAndTextInput}>
                    {categoryLabel ? <Text style={style.label}>Category</Text> : <Text style={style.label}></Text>}
                    <View style={style.commonTextInput}>
                        <View style={style.textInputs}>
                            <TextInput onBlur={() => { onBlurCategory() }} value={categoryInputValue} placeholder={categoryLabel ? '' : 'Category'} style={categoryLabel ? style.categoryLabelInput : style.categorytextInput} onChangeText={(text) => onChangeCategory(text)} onFocus={() => { setCategoryLabel(true); setCategoryInputValue(null); setcategoryItem(null), onChangeCategory() }} autoCorrect={false} />
                            <View style={categoryLabel ? style.categoryDeleteInput : style.categoryDelete}>
                                {categoryInputValue ? <Entypo onPress={() => { setCategoryInputValue(null); setCategoryLabel(false); setCategoryvalueItem(null); setcategoryItem(null) }} name="cross" size={20} color="gray" /> : null}
                            </View>
                            <View style={categoryLabel ? style.categoryArrowInput : style.categoryArrow}>
                                {!categoryArrow ? <AntDesign onPress={() => { setCategoryLabel(true); setCategoryArrow(true); onChangeCategory() }} name="down" size={16} color="grey" /> : <AntDesign onPress={() => { setCategoryLabel(false); setCategoryArrow(false); setCategoryRenderData(null); setCategoryInputValue(null) }} name="up" size={16} color="grey" />}
                            </View>
                        </View>
                        {categoryLoading ? <View style={style.loadingView}><Text>loading...<Text></Text></Text><ActivityIndicator size={25} color='blue' /></View> : null}
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
                    {communityLabel ? <Text style={style.label}>Community</Text> : <Text style={style.label}></Text>}
                    <View style={style.commonTextInput}>
                        <View style={style.textInputs}>
                            <TextInput onBlur={() => { onBlurCommunity() }} value={communityInputValue} placeholder={communityLabel ? '' : 'Community'} style={communityLabel ? style.communityInput : style.communitytextInput} onChangeText={(text) => onChangeCommunity(text)} onFocus={() => { setCommunityLabel(true); setCommunityInputValue(null), onChangeCommunity() }} autoCorrect={false} />
                            <View style={communityLabel ? style.communityDeleteInput : style.communityDelete}>
                                {communityInputValue ? <Entypo onPress={() => { setCommunityInputValue(null); setCommunityLabel(false); setCommunityValueItem(null); setCommunityID('') }} name="cross" size={20} color="gray" /> : null}
                            </View>
                            <View style={communityLabel ? style.communityArrowInput : style.communityArrow}>
                                {!communityArrow ? <AntDesign onPress={() => { setCommunityLabel(true); setCommunityArrow(true); onChangeCommunity('a') }} name="down" size={16} color="grey" /> : <AntDesign onPress={() => { setCommunityLabel(false); setCommunityArrow(false); setCommunityRenderData(null); setCommunityInputValue(null) }} name="up" size={16} color="grey" />}
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
                                                <Text style={style.commonSuggestionsText}>{val}</Text>
                                            </TouchableHighlight>
                                        </View>
                                    )
                                })}
                            </ScrollView>
                        </View> : null}
                    </View>
                </View>
                <View style={style.titleAndTextInput}>
                    {tagsLabel ? <Text style={style.label}>Add Tags (max Tags {5 - renderTags.length})</Text> : <Text style={style.label}></Text>}
                    <View style={style.textInputs}>
                        <View style={tagsLabel ? style.addTagsViewLabel : style.addTagsView}>
                            {renderTags.map((val, index) => {
                                return (
                                    <View key={index} style={style.renderTagsView}>
                                        <Text>{val}</Text>
                                        <Entypo onPress={() => { let ren = renderTags.filter((value) => value != val); setRender(ren); let removeTags = tagsIds.filter((value) => value.name != val); setTagsIds(removeTags); setdata(data.concat({ name: val })); if (renderTags.length == 1) { setTagsLabel(false) } }} name="cross" size={24} color='grey' />
                                    </View>
                                )
                            })}
                            <TextInput value={tagInputValue} onFocus={() => { settagsData([]); setTagsLabel(true); setTagsArrow(true); settagsData(data); addTags() }} onBlur={() => { onBlurTags() }} placeholder={'Add Tags'} onChangeText={(text) => addTags(text)} style={style.addTags} />
                        </View>
                        <View style={tagsLabel ? style.tagsArrowLabel : style.tagsArrow}>
                            {!tagsArrow ? <AntDesign onPress={() => { settagsData(data); setTagsLabel(true); addTags(); setTagsArrow(true) }} name="down" size={16} color="grey" /> : <AntDesign onPress={() => { setTagsLabel(false); setTagsArrow(false); settagsData([]) }} name="up" size={16} color="grey" />}
                        </View>
                    </View>
                    {mapData.length > 0 ? <View style={style.tagsSuggestionsContainer}>
                        <ScrollView keyboardShouldPersistTaps={'handled'} >
                            {mapData.length > 0 && mapData.map((val, item) => {
                                return (
                                    <View key={item} >
                                        <TouchableHighlight underlayColor='blue' onPress={() => { onTagSelect(val) }}>
                                            <Text style={style.commonSuggestionsText}>{val}</Text>
                                        </TouchableHighlight>
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </View> : null}
                </View>
                <View style={style.titleAndTextInput}>
                    {urlLabel ? <View style={style.urlError}><Text style={style.label}>Social Profile Link</Text></View> : <Text style={style.label}></Text>}
                    <View style={style.commonTextInput}>
                        <View style={style.textInputs}>
                            <TextInput onBlur={() => { onBlurUrl() }} value={urlValue} placeholder={urlLabel ? '' : 'Social Profile Link'} style={urlLabel ? style.categoryLabelInput : style.categorytextInput} onChangeText={(text) => onChangeUrl(text)} onFocus={() => { setUrlLabel(true); setUrlValue(null); setUrlError(false) }} autoCorrect={false} />
                            <View style={urlLabel ? style.categoryDeleteInput : style.categoryDelete}>
                            </View>
                            <View style={urlLabel ? style.categoryArrowInput : style.categoryArrow}>
                            </View>
                        </View>
                        {urlError ? <Text style={{ color: 'red' }}>(Please enter Valid url)</Text> : null}
                    </View>
                </View>
                <View style={style.bottomContinueButton}>
                    <Text onPress={() => onClickContinue()} style={style.continueText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={24} color="white" />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
const style = StyleSheet.create({
    addTitleStar: {
        color: 'red',
        fontSize: 25,
        fontWeight: 'bold',
        paddingLeft: 5,
        marginBottom: '3%',
        marginRight: '2%'
    },
    titleSuggestionContainer: {
        width: '100%',
        height: 150,
        zIndex: 1,
        elevation: 20
    },
    titleSuggestionsText: {
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 5,
        width: '100%',
        borderWidth: 0.5,
        borderColor: 'grey',
        elevation: 20,
        color: 'black'
    },
    newThreadText: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center',
        marginLeft: 5,
    },
    borderTop: {
        backgroundColor: '#F75626',
        height: 55,
        width: '100%'
    },
    startText: {
        color: 'red',
        paddingTop: 10,
        fontSize: 15,
        alignSelf: 'flex-start',
        marginLeft: 10
    },
    addTitleView: {
        display: 'flex',
        flexDirection: 'row',
        height: 30
    },
    titleCharacters: {
        paddingTop: 1,
        marginLeft: 2,
        color: 'grey'
    },
    noTitle: {
        display: 'flex',
        flexDirection: 'row',
        height: 30
    },
    textInputs: {
        display: 'flex',
        flexDirection: 'row'
    },
    starInput: {
        fontSize: 20,
        color: 'red'
    },
    titleError: {
        color: 'red',
        paddingTop: 5
    },
    renderTagsView: {
        display: 'flex',
        height: 30,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'lightgrey',
        marginLeft: 2,
        marginTop: 4,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 2,
        borderRadius: 5
    },
    continueText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginRight: 5
    },
    moreComponent: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    },
    threadIconAndText: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '3%',
        paddingRight: '3%',
        paddingBottom: 5,
        height: 70,
        backgroundColor: 'white',
        paddingTop: 25,
        borderBottomWidth: 0.5,
        borderBottomColor: 'black',
    },
    Icon: {
        width: 40,
        paddingLeft: 10
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
    headingPage: {
        width: '95%',
        height: 30,
        flexDirection: 'row',
        justifyContent: 'flex-end',
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
        marginBottom: '1%',
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
        backgroundColor: 'white',
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
        backgroundColor: 'white',
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
        backgroundColor: '#ededed',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 0.6,
        borderColor: 'lightgrey',
        elevation: 10,
        color: 'black'
    },
    bottomContinueButton: {
        marginTop: '8%',
        width: '50%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 5,
        height: 45,
        backgroundColor: '#3F51B5',
        marginBottom: '3%',
        borderRadius: 25,
        alignItems: 'center',
        alignSelf: 'center'
    },
    addTagsView: {
        height: 'auto',
        width: '90%',
        borderBottomWidth: 1.5,
        flexWrap: 'wrap',
        borderColor: '#F75626',
        flexDirection: 'row',
        zIndex: 0,
    },
    addTagsViewLabel: {
        height: 'auto',
        width: '90%',
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
        paddingLeft: '5%',
        padding: 5,
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
    },
    urlError: {
        display: 'flex',
        flexDirection: 'row'
    },
});
export default ForumCreate
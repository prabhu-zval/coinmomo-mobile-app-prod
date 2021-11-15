import React, { useState, useContext, useEffect, createRef, useRef } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Modal, TextInput, ActivityIndicator, Pressable, LogBox, ScrollView, ImageBackground } from 'react-native';
import { API } from '../../services/apiService';
import { LoginContext } from '../../context/context';
import { IMAGE_PATH } from '../../utils/constants';
import { TouchableWithoutFeedback } from 'react-native';
import { set } from 'lodash';

export default function createPortfolio(props) {
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [portfolio, setPortfolio] = useState('')
    const [edit, setEdit] = useState('')
    const [error, setError] = useState('')
    const [activityIndicator, setActivityIndicator] = useState(false)
    const [activityIndication, setActivityIndication] = useState(false);
    const { portfolioData, setPortfolioData, userSigninId, setShowData } = useContext(LoginContext)
    const toggleMenu = (name) => setVisible(name);
    const [CreateModal, setCreateModal] = React.useState(true);
    const [Visible, setVisible] = React.useState(false);
    const [length, setLength] = useState(0)
    const [titleLabel, setTitleLabel] = useState(false)
    const image = { uri: "https://wp-asset.groww.in/wp-content/uploads/2020/07/11203020/For-blog_Monitor-Stocks-02.jpg" };

    useEffect(() => {
        (async () => {
            if (!portfolioData.length) {
                setActivityIndicator(true)
                let userPortfolios = await API.request('findPortfolio', undefined, 'POST', null, null, null, null, {
                    user_id: userSigninId
                })
                LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop.'])
                setActivityIndicator(false)
                setPortfolioData(userPortfolios)
            }
        })()
    }, [])
    const onAddPortfolio = async () => {
        setActivityIndication(true)
        let params = {
            name: portfolio,
            user_id: userSigninId,
        }
        const add = await API.request('addPortfolio', undefined, 'POST', null, null, null, null, null, params)
        if (add.code) {
            setError('Name already exist!')
            return
        }
        setShowData([])
        let data = await JSON.parse(JSON.stringify(add)).ops[0]
        setPortfolioData((prev) => [...prev, data])
        props.navigation.navigate("portfolioAssets", { portfolio_name: portfolio, portfolio_id: data._id })
        setActivityIndication(false)
        setModalVisible(!modalVisible)
    }
    let isCreatePortfolio = null;
    isCreatePortfolio = props.route.params.isCreatePortfolio;
    if (isCreatePortfolio) {
        return (
            <TouchableWithoutFeedback onPress={() => { setTitleLabel(false) }}>
                <View style={style.portfolios}>
                    {activityIndication ? <View style={style.activityIndicationView}>
                        <View style={style.loading}></View>
                        <ActivityIndicator style={style.activityIndication} size='large' color='blue'></ActivityIndicator>
                    </View> : null}
                    <View style={style.threadIconAndText}>
                        <View style={style.threadView}><Image style={style.coimmomoLogo} source={IMAGE_PATH.logo} /></View>
                    </View>
                    <View style={style.container}>
                        <ImageBackground source={image} resizeMode="cover" style={style.image}>
                            <View style={{ flex: 1, backgroundColor: 'white', opacity: .8 }}>
                                <View style={style.titleAndTextInput}>
                                    {titleLabel ? <View style={style.addTitleView}>
                                        <Text style={style.label}> Create Portfolio</Text>
                                        <Text style={style.titleCharacters}>*(Max Characters {150 - length})</Text>
                                    </View> : <View style={style.noTitle}></View>}
                                    <View style={style.textInputs}>
                                        <TextInput maxLength={150} onChangeText={(text) => { setPortfolio(text) }} style={titleLabel ? style.titleInputBox : style.titleTextInput} placeholder={titleLabel ? 'Enter your portfolio name' : 'Enter your portfolio name'} onFocus={() => setTitleLabel(true)} />
                                        <View style={titleLabel ? style.titleStarInputBox : style.titleStarTextInput}><Text style={style.starInput}></Text></View>
                                    </View></View>
                                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: '5%' }}>
                                    <TouchableOpacity activeOpacity={0.9} style={style.button2}>
                                        <Text style={style.buttonText2} onPress={() => { props.navigation.navigate("listingPage") }} >Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={0.9} style={style.button1} onPress={() => { onAddPortfolio() }}>
                                        <Text style={style.buttonText1} >Create</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    else {
        return (
            <TouchableWithoutFeedback onPress={() => { setTitleLabel(false) }}>
                <View style={style.portfolios}>
                    <View style={style.threadIconAndText}>
                        <View style={style.threadView}><Image style={style.coimmomoLogo} source={IMAGE_PATH.logo} /></View>
                    </View>
                    <View style={style.container}>
                        <ImageBackground source={image} resizeMode="cover" style={style.image}>
                            <View style={{ flex: 1, backgroundColor: 'white', opacity: .8 }}>
                                <View>
                                    <Modal
                                        animationType='none'
                                        visible={Visible}
                                        transparent={true}
                                        onRequestClose={() => {
                                            setVisible(!Visible);
                                            setCreateModal(!CreateModal);
                                        }}
                                    >
                                        <View style={style.titleAndTextInput}>
                                            {titleLabel ? <View style={style.addTitleView}>
                                                <Text style={style.label}> Create Portfolio</Text>
                                                <Text style={style.titleCharacters}>*(Max Characters {150 - length})</Text>
                                            </View> : <View style={style.noTitle}></View>}
                                            <View style={style.textInputs}>
                                                <TextInput maxLength={150} onChangeText={(text) => { setPortfolio(text) }} style={titleLabel ? style.titleInputBox : style.titleTextInput} placeholder={titleLabel ? 'Enter your portfolio name' : 'Enter your portfolio name'} onFocus={() => setTitleLabel(true)} />

                                                <View style={titleLabel ? style.titleStarInputBox : style.titleStarTextInput}><Text style={style.starInput}></Text></View>
                                            </View></View>
                                        <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: '5%' }}>
                                            <TouchableOpacity activeOpacity={0.9} style={style.button2}>
                                                <Text style={style.buttonText2} onPress={() => { setVisible(false), setCreateModal(true), setTitleLabel(false) }} >Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity activeOpacity={0.9} style={style.button1} onPress={() => { onAddPortfolio() }}>
                                                <Text style={style.buttonText1} >Create</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Modal>
                                </View>
                                <Modal
                                    animationType='none'
                                    visible={CreateModal}
                                    transparent={true}
                                    onRequestClose={() => {
                                        props.navigation.navigate('home')
                                    }}
                                >
                                    <View style={style.buttonContainer}>
                                        <TouchableOpacity activeOpacity={0.9} style={style.button}>
                                            <Text style={style.buttonText} onPress={() => { setVisible(true), setCreateModal(false) }}>Create New Portfolio</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Modal>
                            </View>
                        </ImageBackground>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
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
    titleStarInputBox: {
        width: '10%',
        height: 40,
        borderWidth: 1.5,
        borderColor: 'orange',
        borderRadius: 5,
        borderLeftWidth: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        paddingLeft: '5%'
    },
    titleStarTextInput: {
        width: '10%',
        height: 40,
        borderBottomWidth: 1.5,
        borderColor: 'orange',
        paddingLeft: '5%'
    },
    titleTextInput: {
        width: '85%',
        height: 40,
        borderBottomWidth: 1.5,
        borderColor: 'orange',
        paddingLeft: '5%',
        paddingRight: '1%',
    },
    titleInputBox: {
        width: '85%',
        height: 40,
        borderWidth: 1.5,
        borderColor: 'orange',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRightWidth: 0,
        borderRadius: 5,
        paddingLeft: '5%',
    },
    textInputs: {
        display: 'flex',
        flexDirection: 'row'
    },
    titleCharacters: {
        paddingTop: 1,
        marginLeft: '16%',
        color: 'grey'
    },
    noTitle: {
        display: 'flex',
        flexDirection: 'row',
        height: 30
    },
    label: {
        color: '#5e5e5e',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: '2%',
        height: 23
    },
    addTitleView: {
        display: 'flex',
        flexDirection: 'row',
        height: 30
    },
    titleAndTextInput: {
        width: '85%',
        height: 75,
        marginTop: '23%',
        paddingLeft: '5%',
        paddingRight: '5%',
        alignSelf: 'center',
        marginLeft: '5%'
    },
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
    },
    overlay: {
        height: '40%',
        width: '100%',
        alignSelf: 'center',
        top: '60%',
        backgroundColor: '#5142a9',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40
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
    newThreadText: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center',
        marginLeft: 5,
    },
    borderTop: {
        backgroundColor: '#5142a9',
        height: 55,
        width: '100%'
    },
    buttonContainer: {
        alignItems: 'center',
        paddingTop: 7,
        paddingBottom: 7,
        display: 'flex',
        bottom: '50%',
        display: 'flex',
        position: 'absolute',
        width: '60%',
        marginLeft: '16%'
    },
    button: {
        height: 45,
        width: '85%',
        backgroundColor: '#3F51B5',
        borderRadius: 50,
        elevation: 10
    },
    button1: {
        height: 32,
        width: '20%',
        backgroundColor: '#3F51B5',
        borderRadius: 50,
        marginLeft: 25,
        elevation: 5,
    },
    button2: {
        height: 32,
        width: '20%',
        backgroundColor: 'white',
        borderRadius: 50,
        elevation: 5,
        borderWidth: .2,
        borderColor: '#5e5e5e'
    },
    buttonText: {
        marginTop: '4%',
        color: 'white',
        fontSize: 18,
        paddingLeft: 10,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    buttonText1: {
        marginTop: '5%',
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    buttonText2: {
        marginTop: '5%',
        color: '#5e5e5e',
        fontSize: 15,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    portfolios: {
        height: '100%', zIndex: -1
    },
    scrollList: {
        paddingBottom: 70
    },
    editButton: {
        marginTop: 20,
        marginRight: 10,
        height: 25,
        width: 35
    },
    deleteButton: {
        marginTop: 20,
        marginRight: 10,
        height: 25,
        width: 25
    },
    icons: {
        flexDirection: "row",
        display: 'flex',
        justifyContent: 'space-around'
    },
    name: {
        marginTop: '3.5%',
        marginLeft: '2%',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18
    },
    listView: {
        flexDirection: "row",
        display: 'flex',
        justifyContent: 'space-between',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 0.5,
        height: 65,
        overflow: 'visible',
        backgroundColor: 'white'
    },
    activityIndicatorView: {
        display: 'flex',
        justifyContent: 'center'
    },
    activityIndicator: {
        marginTop: 50
    },
    modalText: {
        fontSize: 14
    },
    deleteButtonClose: {
        backgroundColor: '#8fc73d',
        padding: 5,
        borderRadius: 4,
        width: 80,
        marginTop: 50
    },
    delete: {
        borderRadius: 4,
        color: 'black'
    },
    text: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center",
        paddingTop: 5
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    bothButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },
    deleteCenteredView: {
        flex: 1,
        marginTop: '55%',
        alignItems: 'center'
    },
    deleteModalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        height: 170,
        width: '72%',
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
    visibleModalView: {
        backgroundColor: 'white',
        borderRadius: 6,
        paddingTop: 10,
        height: 40,
        width: '20%',
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
        backgroundColor: "#8fc73d",
        borderRadius: 6,
        height: 30,
        marginTop: '10%',
        width: '55%'
    },
    addPortfolioButtonClose: {
        backgroundColor: "#8fc73d",
        borderRadius: 6,
        height: 30,
        marginTop: '10%',
        width: '55%'
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        paddingTop: 5
    },
    yesOrNo: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
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
    quantityContainer: {
        marginTop: 20,
        width: '80%'
    },
    addTransaction: {
        fontWeight: 'bold',
        fontSize: 18
    },
    transactionHeaderlabels: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%'
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        paddingTop: 35,
        height: 200,
        width: '90%',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    addPortfolioModalView: {
        backgroundColor: "white",
        borderRadius: 20,
        paddingTop: 35,
        height: 220,
        width: '90%',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 55
    },
    visibleCenteredView: {
        flex: 1,
        marginTop: '14%',
        marginLeft: '4%'
    },
    Icon: {
        width: 40,
        paddingLeft: 10
    },
    portfolioHeader: {
        fontSize: 18,
        color: 'black',
        zIndex: -1,
        fontWeight: 'bold',
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 25
    },
    IconAndText: {
        marginTop: 25,
        height: 60,
        paddingTop: 20,
        display: 'flex',
        borderBottomWidth: 0.7,
        borderBottomColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white'
    },
    Icons: {
        width: 90,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
})
import React, { useState, useContext, useEffect, createRef, useRef } from 'react';
import { TouchableHighlight, View, StyleSheet, Image, Text, TouchableOpacity, Modal, TextInput, ActivityIndicator, Pressable, LogBox, ScrollView, ImageBackground } from 'react-native';
import { AntDesign, Entypo, MaterialIcons, EvilIcons, Feather, MaterialCommunityIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { API } from '../../services/apiService';
import { LoginContext } from '../../context/context';
import { IMAGE_PATH } from '../../utils/constants';
import { TouchableNativeFeedback } from 'react-native';
import moment from 'moment';

export default function ListingPage(props) {
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [visible, setVisible] = useState('');
    const [portfolio, setPortfolio] = useState('')
    const [edit, setEdit] = useState('')
    const [popupBackground, setPopupBackground] = useState(false);
    const [activityIndication, setActivityIndication] = useState(false);
    const [error, setError] = useState('')
    const [activityIndicator, setActivityIndicator] = useState(false)
    const { portfolioData, setPortfolioData, userSigninId, setShowData, setDrawerBgColor } = useContext(LoginContext)
    const toggleMenu = (name) => setVisible(name);
    const image = { uri: "https://wp-asset.groww.in/wp-content/uploads/2020/07/11203020/For-blog_Monitor-Stocks-02.jpg" };

    useEffect(() => {
        (async () => {
            if (!userSigninId) {
                props.navigation.navigate('home')
            }
            if (!portfolioData.length) {
                setActivityIndicator(true)
                const userPortfolios = await API.request('findPortfolio', undefined, 'POST', null, null, null, null, {
                    user_id: userSigninId
                })
                LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop.'])
                setActivityIndicator(false)
                setPortfolioData(userPortfolios)
            }
        })()
    }, [userSigninId])
    const onDeletePortfolio = async () => {
        setDeleteModalVisible(false)
        setPopupBackground(false)
        setActivityIndication(true)
        let params = {
            name: portfolio,
            id: edit
        }
        const Edit = await API.request('deletePortfolio', undefined, 'POST', null, null, null, null, null, params)
        let currentCoinData = portfolioData.filter((data) => data._id == edit)
        currentCoinData = currentCoinData[0]
        let showDataCopy = portfolioData
        showDataCopy.splice(portfolioData.indexOf(currentCoinData), 1)
        setPortfolioData(() => [...showDataCopy])
        if (portfolioData.length == 0) {
            props.navigation.navigate('createPortfolio', { isCreatePortfolio })
        }
        setActivityIndication(false)
    }
    let isCreatePortfolio = true;
    let getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    return (
        <View style={style.portfolios}>
            {popupBackground ? <View style={style.popupBackground}></View> : null}
            {activityIndication ? <View style={style.activityIndicationView}>
                <View style={style.loading}></View>
                <ActivityIndicator style={style.activityIndication} size='large' color='blue'></ActivityIndicator>
            </View> : null}
            <View style={style.threadIconAndText}>
                <TouchableOpacity style={style.menu} onPress={() => { props.navigation.openDrawer(); setDrawerBgColor("portfolio") }}>
                    <Entypo name="menu" size={30} color="black" />
                </TouchableOpacity>
                <View style={style.threadView}><Image style={style.coimmomoLogo} source={IMAGE_PATH.logo} /></View>
            </View>
            <ImageBackground source={image} resizeMode="cover" style={style.image}>
                <View style={style.img}>
                    <View style={style.buttonContainer}>
                        <View style={style.button}>
                            <FontAwesome5 name="plus" size={19} color="white" style={style.title} />
                            <TouchableOpacity activeOpacity={.9} onPress={() => props.navigation.navigate('createPortfolio', { isCreatePortfolio })}>
                                <Text style={style.buttonText}>Create New Portfolio</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={style.activityIndicatorView}>
                        {activityIndicator ? <ActivityIndicator style={style.activityIndicator} size='large' color='blue'></ActivityIndicator> : null}
                    </View>
                    <ScrollView>
                        {portfolioData.length > 0 && portfolioData.map((val, index) => (
                            <TouchableNativeFeedback onPress={() => { setShowData([]); props.navigation.navigate("portfolioAssets", { portfolio_id: val._id, portfolio_name: val.name }) }}>
                                <View style={style.container} key={val._id}>
                                    <View style={{ flexDirection: 'column', justifyContent: 'center', width: '10%' }}>
                                        <Text style={[style.conversationUserImg, { backgroundColor: getRandomColor() }]}></Text>
                                    </View>
                                    <View style={{ width: '78%' }}>
                                        <Text style={style.contentArea}>{val.name}</Text>
                                        <Text style={style.dateArea}>{moment(`${val.current_date_time}`).format('DD MMMM YYYY')}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', justifyContent: 'center', width: '7%' }}>
                                        <MaterialCommunityIcons onPress={() => { setPopupBackground(true); setDeleteModalVisible(true); toggleMenu(''); toggleMenu(val.name); setVisible(true); setPortfolio(val.name); setEdit(val._id); }} name="delete-forever" size={26} color="red" />
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        ))
                        }
                    </ScrollView>
                    <View>
                        <Modal
                            animationType="none"
                            transparent={true}
                            visible={deleteModalVisible}
                            onRequestClose={() => {
                                setDeleteModalVisible(!deleteModalVisible);
                            }}
                        >
                            <View style={style.centerView}>
                                <View style={style.deleteCenteredView}>
                                    <View style={style.deleteModalView}>
                                        <Text style={style.modalText}>Do you want to delete this portfolio ?</Text>
                                        <View style={{ height: '40%', width: '80%' }}>
                                            <Text ellipsizeMode='tail' numberOfLines={2} style={{ fontWeight: 'bold', color: 'red', marginTop: 5, alignSelf: 'center' }}>{portfolio}</Text>
                                        </View>
                                        <View style={style.buttonInner}>
                                            <TouchableOpacity activeOpacity={0.9}
                                                style={[style.deleteButtonClose]}
                                                onPress={() => { onDeletePortfolio(); }}
                                            >
                                                <Text style={style.yesOrNo}>Yes</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity activeOpacity={0.9}
                                                style={[style.deleteButtonClose]}
                                                onPress={() => { setDeleteModalVisible(!deleteModalVisible); setPopupBackground(false); }}
                                            >
                                                <Text style={style.yesOrNo}>No</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}
const style = StyleSheet.create({
    menu: {
        marginLeft: '5%'
    },
    img: {
        flex: 1,
        backgroundColor: 'white',
        opacity: .8
    },
    title: {
        marginTop: '4.5%',
        marginLeft: '9%'
    },
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
    activityIndicatorView: {
        display: 'flex',
        justifyContent: 'center'
    },
    activityIndicator: {
        marginTop: 50
    },
    centerView: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
    deleteCenteredView: {
        flex: 1,
        marginTop: '65%',
        alignItems: 'center',
    },
    deleteModalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingTop: 40,
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
        elevation: 10
    },
    modalText: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    deleteButtonClose: {
        backgroundColor: '#3F51B5',
        padding: 5,
        borderRadius: 50,
        width: 80,
        marginTop: 15
    },
    yesOrNo: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    buttonInner: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%'
    },
    buttonContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: '3%',
        marginTop: '4%'
    },
    button: {
        flexDirection: 'row',
        height: 45,
        backgroundColor: '#253ab0',
        borderRadius: 50,
        elevation: 10
    },
    buttonText: {
        marginTop: '5%',
        color: 'white',
        fontSize: 18,
        paddingLeft: '2%',
        paddingRight: '1%',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    image: {
        flex: 1,
    },
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        width: '88%',
        backgroundColor: 'white',
        marginTop: '2.5%',
        marginBottom: '2.5%',
        padding: 25,
        justifyContent: 'space-between',
        alignSelf: 'center',
        borderRadius: 10,
        elevation: 5,
        opacity: .9,
    },
    contentArea: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#2e2e2e',
        width: '100%',
        height: '70%'
    },
    dateArea: {
        marginTop: 3,
        fontSize: 13,
        fontWeight: 'bold',
        color: '#666666',
        width: '100%',
        height: '50%'
    },
    portfolios: {
        height: '100%',
        width: '100%',
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
        borderBottomColor: 'grey',
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
    conversationUserImg: {
        borderRadius: 50,
        width: 25,
        height: 25,
        alignSelf: 'flex-start',
    },
})
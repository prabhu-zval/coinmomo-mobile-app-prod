import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableHighlight } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { IMAGE_PATH } from '../../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';
import { API } from '../../services/apiService';
import { LoginContext } from "../../context/context";

export default function SigninRequest(props) {
    const { setUserLogin, setUserSigninId, userSigninId, setLoginLoading, setUserDetails } = useContext(LoginContext)

    useEffect(() => {
        (async () => {
            if (userSigninId) {
                props.props.navigation.navigate("home");
            }
        })()
    }, [userSigninId])
    const onPressGoogleSignin = async () => {
        setLoginLoading(true)
        try {
            const result = await Google.logInAsync({
                androidClientId: "979008837894-qm7odjf41loq23gjv9jpar79m0setp50.apps.googleusercontent.com",
                osClientId: '210636253663-dq4rc5i92vr6q2a5110ass0sr2vkrk3v.apps.googleusercontent.com',
                androidStandaloneAppClientId: "979008837894-qm7odjf41loq23gjv9jpar79m0setp50.apps.googleusercontent.com",
                iosStandaloneAppClientId: '210636253663-dq4rc5i92vr6q2a5110ass0sr2vkrk3v.apps.googleusercontent.com',
                scopes: ["profile", "email"],
                //host.exp.exponent -->change it in gcp to work in simulator
                redirectUrl: 'com.aab.coinmomo:/oauth2redirect/google',
            })
            if (result.type == 'success') {
                let userData = {
                    type: 'google',
                    id: result.user.id,
                    email: result.user.email,
                    familyName: result.user.familyName,
                    givenName: result.user.givenName,
                    name: result.user.name,
                    photoUrl: result.user.photoUrl
                }
                let google_auth = {
                    auth_obj: JSON.stringify(userData)
                }
                const googledata = await API.request('signup', undefined, 'POST', null, null, null, null, null, google_auth)
                await AsyncStorage.setItem('UserLogin', JSON.stringify(googledata))
                let user = await AsyncStorage.getItem('UserLogin')
                user = JSON.parse(user)
                if (user && user.length > 0) {
                    setUserLogin(true)
                    let data = await AsyncStorage.getItem('UserLogin')
                    data = await JSON.parse(data)
                    setUserSigninId(data[0].id)
                    let userData = {}
                    userData['id'] = data[0].id
                    userData['name'] = data[0].name
                    userData['image'] = data[0].photoUrl,
                        userData['type'] = data[0].type
                    userData['email'] = data[0].email
                    userData["current_date_time"] = data[0].current_date_time
                    setUserDetails(userData)
                    let userPortfolios = await API.request('findPortfolio', undefined, 'POST', null, null, null, null, {
                        user_id: data[0].id
                    })
                    props.props.navigation.navigate(props.props.route.params ? props.props.route.params.forum ? 'forumCreate' : 'home' : (userPortfolios && userPortfolios.length) > 0 ?
                        'listingPage' : 'createPortfolio', { isCreatePortfolio: false })
                    setLoginLoading(false)
                }
            }
            else {
                console.log('cancelled')
                setLoginLoading(false)
            }
        }
        catch (e) {
            console.log("error", e)
        }
    }
    const onPressFacebookSignin = async () => {
        setLoginLoading(true)
        try {
            await Facebook.initializeAsync({
                appId: '4303715056357543',
            });
            const {
                type,
                token,
            } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile'],
            });
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                const data = await response.json()
                let facebook_auth = {
                    auth_obj: JSON.stringify({ type: 'facebook', id: data.id, name: data.name })
                }
                const fbdata = await API.request('signup', undefined, 'POST', null, null, null, null, null, facebook_auth)
                await AsyncStorage.setItem('UserLogin', JSON.stringify(fbdata))
                const user = await AsyncStorage.getItem('UserLogin')
                if (user && user.length > 0) {
                    setUserLogin(true)
                    let data = await AsyncStorage.getItem('UserLogin')
                    data = await JSON.parse(data)
                    setUserSigninId(data[0].id)
                    let userData = {}
                    userData['id'] = data[0].id
                    userData['name'] = data[0].name
                    userData['type'] = data[0].type
                    userData["current_date_time"] = data[0].current_date_time
                    setUserDetails(userData)
                    let userPortfolios = await API.request('findPortfolio', undefined, 'POST', null, null, null, null, {
                        user_id: data[0].id
                    })
                    props.props.navigation.navigate(props.props.route.params ? props.props.route.params.forum ? 'forumCreate' : 'home' : (userPortfolios && userPortfolios.length) > 0 ?
                        'listingPage' : 'createPortfolio', { isCreatePortfolio: false })
                    setLoginLoading(false)
                }
            }
            else {
                setLoginLoading(false)
            }
        } catch ({ message }) {
            console.log(message)
            setLoginLoading(false)
        }
    }
    return (
        <View style={style.signinRequest}>
            <View style={style.coinmomoIcon}>
                <Image style={style.coinmomoLogo} source={IMAGE_PATH.logo} />
            </View>
            <View style={style.text}>
                <Text style={style.welcomeText}>Welcome User</Text>
                <Text style={style.signText}>Sign in to view your profile</Text>
            </View>
            <View style={style.socialLogin}>
                <TouchableHighlight underlayColor="#ff7376" onPress={onPressGoogleSignin} style={style.googleloginView} >
                    <View style={style.google} >
                        <Entypo style={style.googleIcon} name="google--with-circle" size={40} color="white" />
                        <Text style={style.iconText}>Google</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor='#ADD8E6' onPress={onPressFacebookSignin} style={style.facebookloginView}>
                    <View style={style.facebook} >
                        <Entypo name="facebook-with-circle" style={style.faceBookIcon} size={40} color="white" />
                        <Text style={style.iconText}>Facebook</Text>
                    </View>
                </TouchableHighlight>
            </View>
        </View>
    );
}
const style = StyleSheet.create({
    signinRequest: {
        position: 'relative',
        height: '100%'
    },
    signinRequestHeader: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 25,
        backgroundColor: 'white',
        paddingTop: 25,
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#dcdcdc'
    },
    Icons: {
        width: 90,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    signinButton: {
        height: 40,
        marginLeft: 25,
        marginRight: 25,
        backgroundColor: '#8fc73d',
        textAlign: 'center',
        paddingTop: 10,
        color: 'white',
    },
    coinmomoIcon: {
        marginTop: '25%',
        alignItems: 'center'
    },
    coinmomoLogo: {
        width: 285,
        height: 75
    },
    text: {
        marginTop: 25,
        marginLeft: 15
    },
    welcomeText: {
        fontSize: 25,
        marginBottom: 10
    },
    signText: {
        fontSize: 15
    },
    socialLogin: {
        marginTop: '5%',
        display: 'flex',
        flexDirection: 'column',
        height: 195,
        width: '90%',
        marginLeft: 15
    },
    facebookloginView: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.8,
        borderColor: 'lightblue',
        height: 60,
        marginBottom: '2%',
        backgroundColor: '#3b5998',
        elevation: 20,
        borderRadius: 20
    },
    twitterloginView: {
        borderWidth: 0.8,
        borderColor: 'lightblue',
        height: 60,
        marginBottom: '2%',
        backgroundColor: '#00aced',
        elevation: 20,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    googleloginView: {
        borderWidth: 0.8,
        borderColor: 'lightblue',
        height: 60,
        marginBottom: '2%',
        backgroundColor: '#c32f10',
        elevation: 20,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    google: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: 130,
    },
    facebook: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: 130,
    },
    twitter: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        width: 130,
    },
    googleIcon: {
        marginRight: '7%'
    },
    faceBookIcon: {
        marginRight: '7%'
    },
    TwitterIcon: {
        marginRight: '7%'
    },
    iconText: {
        color: 'white',
        fontSize: 20
    },
    loginHeader: {
        marginTop: '10%',
        color: '#212633',
        textAlign: 'center',
        fontSize: 22,
        marginBottom: '10%'
    },
    close: {
        height: 30,
        fontSize: 20
    }
});
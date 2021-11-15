import React, { useContext } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import SigninRequest from '../signinRequest/signinRequest';
import { LoginContext } from '../../context/context';

export default function Portfolio(props) {
    const { loginLoading } = useContext(LoginContext)
    return (
        <View>
            {loginLoading ? <View style={style.loading}><ActivityIndicator size={24} color='blue' /><Text style={style.loadingText}>Loading.....</Text></View> : null}
            <SigninRequest props={props} />
        </View>
    );
}
const style = StyleSheet.create({
    loading: {
        position: 'relative',
        paddingTop: '50%',
        height: '100%',
        backgroundColor: 'white'
    },
    loadingText: {
        color: 'blue',
        fontSize: 20,
        textAlign: 'center'
    }
})
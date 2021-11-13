import React from 'react';
import WebView from 'react-native-webview';
import { StyleSheet, View } from 'react-native';

export default function Chart(props) {
    return (
        <View style={style.container}>
            <WebView
                originWhitelist={['*']}
                source={{
                    html: `<script src="https://widgets.coingecko.com/coingecko-coin-converter-widget.js"></script>
                    <coingecko-coin-converter-widget  coin-id=${props.propName.props.route.params.id} currency="usd" background-color="#ffffff" font-color="#4c4c4c" locale="en"></coingecko-coin-converter-widget>`
                }}
                scalesPageToFit={false}
                bounces={false}
                javaScriptEnabled
                style={style.Converter}
                automaticallyAdjustContentInsets={false}
            />
        </View>
    )
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }, Converter: {
        backgroundColor: 'white',
        minHeight: 600
    }
})
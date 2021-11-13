import React from 'react';
import WebView from 'react-native-webview';
import { StyleSheet, View } from 'react-native';

export default function CoinExchanges(props) {
    return (
        <View style={style.container}>
            <WebView
                originWhitelist={['*']}
                source={{
                    html: `<script src="https://widgets.coingecko.com/coingecko-coin-market-ticker-list-widget.js"></script>
                    <coingecko-coin-market-ticker-list-widget coin-id=${props.propName.props.route.params.id} currency="usd" locale="en"></coingecko-coin-market-ticker-list-widget>`
                }}
                scalesPageToFit={false}
                bounces={false}
                javaScriptEnabled
                style={style.exchanges}
                automaticallyAdjustContentInsets={false}
            />
        </View>
    )
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: 150,
        paddingTop: 15
    },
    exchanges: {
        backgroundColor: 'white',
        height: '100%',
    }
})
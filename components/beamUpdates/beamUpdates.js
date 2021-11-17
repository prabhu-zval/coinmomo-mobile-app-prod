import React from 'react';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

export default function BeamUpdates() {
    return (
        <View style={style.container}>
            <WebView
                originWhitelist={['*']}
                source={{
                    html: `<script src="https://widgets.coingecko.com/coingecko-beam-widget.js"></script>
                    <coingecko-beam-widget  type="all" height="480" locale="en"></coingecko-beam-widget>`
                }}
                scalesPageToFit={false}
                bounces={false}
                javaScriptEnabled
                style={style.beamUpdates}
                automaticallyAdjustContentInsets={false}
            />
        </View>
    );
}
const style = StyleSheet.create({
    beamUpdates: {
        backgroundColor: 'white'
    },
    container: {
        height: '82%',
    }
})
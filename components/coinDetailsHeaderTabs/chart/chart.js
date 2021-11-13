import React, { useState, useEffect } from 'react';
import WebView from 'react-native-webview';
import { StyleSheet, View, Linking, TouchableOpacity, Text, ScrollView } from 'react-native';
import { API } from '../../../services/apiService';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

export default function Chart(props) {
    let SYMBOL = props.propName.props.route.params.symbol.toUpperCase() + 'USD';
    const [communityLinks, setCommunityLinks] = useState(null)
    useEffect(() => {
        (async () => {
            const allLinks = await API.request('links', undefined, 'GET', props.propName.props.route.params.id)
            setCommunityLinks(allLinks.links)
        })()
    }, [])
    return (
        <View style={style.container}>
            <ScrollView nestedScrollEnabled={true}>
                <WebView
                    originWhitelist={['*']}
                    source={{
                        html: `<iframe  width="100%" height="100%" src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_946c2&amp;symbol=${SYMBOL}&amp;interval=D&amp;hidesidetoolbar=0&amp;symboledit=1&amp;saveimage=1&amp;toolbarbg=f1f3f6&amp;studies=%5B%5D&amp;theme=light&amp;style=1&amp;timezone=Etc%2FUTC&amp;showpopupbutton=1&amp;studies_overrides=%7B%7D&amp;overrides=%7B%7D&amp;enabled_features=%5B%5D&amp;disabled_features=%5B%5D&amp;showpopupbutton=1&amp;locale=in&amp;utm_source=coinmomo.com&amp;utm_medium=widget&amp;utm_campaign=chart&amp;utm_term=${SYMBOL}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
                    }}
                    style={{ marginTop: 20 }}
                    scalesPageToFit={false}
                    bounces={false}
                    javaScriptEnabled
                    style={style.exchanges}
                    automaticallyAdjustContentInsets={false}
                />
                <View style={style.linksContainer}>
                    <View style={style.website}>
                        <TouchableOpacity onPress={() => { Linking.openURL(`${communityLinks.homepage[0]}`) }}>
                            <AntDesign style={style.linkIcon} name="link" size={24} color="white" />
                            <Text style={style.linkName} >Website</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={style.website}>
                        <TouchableOpacity onPress={() => { Linking.openURL(`${communityLinks.homepage[0]}`) }}>
                            <AntDesign style={style.linkIcon} name="twitter" size={24} color="white" />
                            <Text style={style.linkName}>Twitter</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={style.website}>
                        <TouchableOpacity onPress={() => { Linking.openURL(`${communityLinks.homepage[0]}`) }}>
                            <FontAwesome style={style.linkIcon} name="facebook" size={24} color="white" />
                            <Text style={style.linkName}>Fb</Text>
                        </TouchableOpacity>
                    </View> */}
                    <View style={style.website}>
                        <TouchableOpacity onPress={() => { Linking.openURL(`${communityLinks.subreddit_url}`) }}>
                            <FontAwesome style={style.linkIcon} name="reddit" size={24} color="white" />
                            <Text style={style.linkName}>Reddit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
const style = StyleSheet.create({
    linkIcon: {
        textAlign: 'center',
        backgroundColor: '#F75626',
        borderRadius: 50,
        height: 50,
        width: 50,
        paddingTop: 13,
        borderColor: 'white',
        borderWidth: 1.5
    },
    linksContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-around",
        height: 100,
        backgroundColor: '#FFFFFF',
        elevation: 15,
        borderColor: 'white',
        borderWidth: 1,
        width: '100%',
        paddingLeft: 5,
        paddingRight: 5,
        alignSelf: 'center',
        marginTop: 40
    },
    Chart: {
        height: 350
    },
    linkName: {
        color: '#F75626',
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 5,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 10,
        height: '100%'
    },
    website: {
        marginBottom: 20,
        marginTop: 13
    },
    exchanges: {
        backgroundColor: 'white',
        height: 400,
        marginTop: 20
    }
});






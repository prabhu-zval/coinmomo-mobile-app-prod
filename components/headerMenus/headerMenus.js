import React, { useEffect, useContext } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { LoginContext } from '../../context/context';
import Cryptocurrency from '../cryptocurrency/cryptocurrency';
import Derivatives from '../derivatives/derivatives';
import Exchanges from '../exchanges/exchanges';
import { Dimensions, LogBox } from "react-native";
// import Events from '../events/events';
// import Chart from '../coinDetailsHeaderTabs/chart/chart';
// import Details from '../coinDetailsHeaderTabs/details/details';
// import Converter from '../coinDetailsHeaderTabs/converter/converter'
// import CoinEvents from '../coinDetailsHeaderTabs/coinEvents/coinEvents';
// import CoinExchanges from '../coinDetailsHeaderTabs/coinExchanges/coinExchanges'
// import Blogs from '../blogs/blogs'
// import BeamUpdates from '../beamUpdates/beamUpdates'
// import BuyTab from '../transactionTabs/buyTab/buyTab';
// import SellTab from '../transactionTabs/sellTab/sellTab';
// import TransferTab from '../transactionTabs/transferTab/transferTab';
// import BuyTransaction from '../coinTransactionTabs/buyTransaction';
// import SellTransaction from '../coinTransactionTabs/sellTransaction';
// import TransferTransaction from '../coinTransactionTabs/transferTransaction';

const deviceWidth = Dimensions.get('window').width;
const Tab = createMaterialTopTabNavigator();

function HeaderMenus() {
    useEffect(() => {
        LogBox.ignoreLogs(["Accessing the 'state' property of the 'route' object is not supported. If you want to get the focused route name, use the 'getFocusedRouteNameFromRoute' helper instead: https://reactnavigation.org/docs/screen-options-resolution/#setting-parent-screen-options-based-on-child-navigators-state"])
    })
    const [fontSize, setFontSize] = React.useState(15)
    React.useEffect(() => {
        if (deviceWidth <= 320) {
            setFontSize(8)
        } else if (deviceWidth <= 360) {
            setFontSize(10)
        } else if (deviceWidth <= 412 || deviceWidth <= 393) {
            setFontSize(11)
        } else {
            setFontSize(12)
        }
    });
    return (
        <Tab.Navigator
            initialRouteName="Cryptocurrency"
            tabBarOptions={{
                activeTintColor: '#F75626',
                inactiveTintColor: 'black',
                scrollEnabled: true,
                labelStyle: { fontSize: fontSize, fontWeight: 'bold' },
                style: { borderColor: '#dcdcdc', marginTop: 10, borderBottomWidth: 1, borderTopWidth: 1 },
                indicatorStyle: { borderBottomWidth: 2, borderBottomColor: '#F75626' }
            }}
        >
            <Tab.Screen
                name="Cryptocurrency"
                component={Cryptocurrency}
                options={{ tabBarLabel: 'Currency' }}
            />
            <Tab.Screen
                name="exchanges"
                component={Exchanges}
                options={{ tabBarLabel: 'Exchanges' }}
            />
            <Tab.Screen
                name="derivatives"
                component={Derivatives}
                options={{ tabBarLabel: 'Derivatives' }}
            />
            {/* <Tab.Screen
        name="events"
        component={Events}
        options={{ tabBarLabel: 'Events' }}
      /> */}
        </Tab.Navigator>
    );
}
function CoinDetailsHeaderTabs(props) {
    const [fontSize, setFontSize] = React.useState(15)
    React.useEffect(() => {
        if (deviceWidth <= 320) {
            setFontSize(8)
        } else if (deviceWidth <= 360) {
            setFontSize(10)
        } else if (deviceWidth <= 412 || deviceWidth <= 393) {
            setFontSize(11)
        } else {
            setFontSize(12)
        }
    });
    return (
        <Tab.Navigator
            initialRouteName="Exchanges"
            tabBarOptions={{
                activeTintColor: '#F75626',
                inactiveTintColor: 'black',
                scrollEnabled: true,
                labelStyle: { fontSize: fontSize, fontWeight: 'bold' },
                style: { borderColor: '#dcdcdc', marginTop: 10, borderBottomWidth: 1, borderTopWidth: 1 },
                indicatorStyle: { borderBottomWidth: 2, borderBottomColor: '#F75626' }
            }}
        >
            <Tab.Screen
                name="Exchanges"
                children={() => <CoinExchanges propName={props} />}
                options={{ tabBarLabel: 'Exchanges' }}
            />
            <Tab.Screen
                name="Converter"
                children={() => <Converter propName={props} />}
                options={{ tabBarLabel: 'Converter' }}
            />
            <Tab.Screen
                name="Chart"
                children={() => <Chart propName={props} />}
                options={{ tabBarLabel: 'Chart' }}
            />
            <Tab.Screen
                name="Details"
                children={() => <Details propName={props} />}
                options={{ tabBarLabel: 'Details' }}
            />
            <Tab.Screen
                name="Events"
                children={() => <CoinEvents propName={props} />}
                options={{ tabBarLabel: 'Events' }}
            />

        </Tab.Navigator>
    )
}
function ExploreHeaderTabs() {
    const [fontSize, setFontSize] = React.useState(15)
    React.useEffect(() => {
        if (deviceWidth <= 320) {
            setFontSize(8)
        } else if (deviceWidth <= 360) {
            setFontSize(10)
        } else if (deviceWidth <= 412 || deviceWidth <= 393) {
            setFontSize(11)
        } else {
            setFontSize(12)
        }
    });
    return (
        <Tab.Navigator
            initialRouteName="Blogs"
            tabBarOptions={{
                activeTintColor: '#F75626',
                inactiveTintColor: 'black',
                labelStyle: { fontSize: fontSize, fontWeight: 'bold' },
                style: { borderColor: '#dcdcdc', marginTop: 10, borderBottomWidth: 1, borderTopWidth: 1 },
                indicatorStyle: { borderBottomWidth: 2, borderBottomColor: '#F75626' }
            }}
        >
            {/* <Tab.Screen
        name="Blogs"
        component={Blogs}
        options={{ tabBarLabel: 'Blogs' }}
      /> */}
            <Tab.Screen
                name="Details"
                component={BeamUpdates}
                options={{ tabBarLabel: 'Beam Updates' }}
            />
        </Tab.Navigator>
    )
}
function TransactionTabs(props) {
    let { setCurrentTab, setQuantity, setFee, setNotes, setQuantityError, setCoinName, assetsCoin, assetsCoinImage, assetsCoinId } = useContext(LoginContext)
    const [fontSize, setFontSize] = React.useState(15)
    const setAllFields = () => {
        setQuantity('')
        setFee('')
        setNotes('')
        setQuantityError(false)
        setCoinName({ coinName: assetsCoin, coinId: assetsCoinId, image: assetsCoinImage })
    }
    React.useEffect(() => {
        if (deviceWidth <= 320) {
            setFontSize(8)
        } else if (deviceWidth <= 360) {
            setFontSize(10)
        } else if (deviceWidth <= 412 || deviceWidth <= 393) {
            setFontSize(11)
        } else {
            setFontSize(12)
        }
    });
    return (
        <Tab.Navigator
            initialRouteName="Buy"
            swipeEnabled={false}
            tabBarOptions={{
                activeTintColor: '#F75626',
                inactiveTintColor: 'black',
                scrollEnabled: false,
                labelStyle: { fontSize: fontSize, fontWeight: 'bold' },
                style: { borderColor: '#dcdcdc', marginTop: 10, borderBottomWidth: 1, borderTopWidth: 1 },
                indicatorStyle: { borderBottomWidth: 2, borderBottomColor: '#F75626' }
            }}
        >
            <Tab.Screen
                name="Buy"
                listeners={{
                    tabPress: e => {
                        setCurrentTab('Buy')
                        setAllFields()
                    }
                }}
                children={() => <BuyTab props={props} />}
                options={{ tabBarLabel: 'Buy' }}
            />
            <Tab.Screen
                name="Sell"
                listeners={{
                    tabPress: e => {
                        setCurrentTab('Sell')
                        setAllFields()
                    }
                }}
                children={() => <SellTab props={props} />}
                options={{ tabBarLabel: 'Sell' }}
            />
            <Tab.Screen
                name="Transfer"
                listeners={{
                    tabPress: e => {
                        setCurrentTab('Transfer In')
                        setAllFields()
                    }
                }}
                children={() => <TransferTab props={props} />}
                options={{ tabBarLabel: 'Transfer' }}
            />
        </Tab.Navigator>
    )
}
function CoinTransactionTabs(props) {
    let { setCurrentTab, setQuantity, setFee, setNotes, setQuantityError, currentprice, setPricePerCoin } = useContext(LoginContext)
    const [fontSize, setFontSize] = React.useState(15)

    const setAllFields = () => {
        setQuantity('')
        setFee('')
        setNotes('')
        setQuantityError(false)
        setPricePerCoin(currentprice)
    }
    React.useEffect(() => {
        if (deviceWidth <= 320) {
            setFontSize(8)
        } else if (deviceWidth <= 360) {
            setFontSize(10)
        } else if (deviceWidth <= 412 || deviceWidth <= 393) {
            setFontSize(11)
        } else {
            setFontSize(12)
        }
    });
    return (
        <Tab.Navigator
            initialRouteName="Buy"
            tabBarOptions={{
                activeTintColor: '#F75626',
                inactiveTintColor: 'black',
                scrollEnabled: false,
                labelStyle: { fontSize: fontSize, fontWeight: 'bold' },
                style: { borderColor: '#dcdcdc', marginTop: 10, borderBottomWidth: 1, borderTopWidth: 1 },
                indicatorStyle: { borderBottomWidth: 2, borderBottomColor: '#F75626' }
            }}
        >
            <Tab.Screen
                name="Buy"
                listeners={{
                    tabPress: e => {
                        setCurrentTab('Buy')
                        setAllFields()
                    }
                }}
                children={() => <BuyTransaction props={props} />}
                options={{ tabBarLabel: 'Buy' }}
            />
            <Tab.Screen
                name="Sell"
                listeners={{
                    tabPress: e => {
                        setCurrentTab('Sell')
                        setAllFields()
                    }
                }}
                children={() => <SellTransaction props={props} />}
                options={{ tabBarLabel: 'Sell' }}
            />
            <Tab.Screen
                name="Transfer"
                listeners={{
                    tabPress: e => {
                        setCurrentTab('Transfer In')
                        setAllFields()
                    }
                }}
                children={() => <TransferTransaction props={props} />}
                options={{ tabBarLabel: 'Transfer' }}
            />
        </Tab.Navigator>
    )
}
export { HeaderMenus, CoinDetailsHeaderTabs, ExploreHeaderTabs, TransactionTabs, CoinTransactionTabs }
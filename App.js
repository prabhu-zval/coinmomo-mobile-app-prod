import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './components/home/home';
import SplashScreen from './components/splashScreen/splashScreen';
import { Provider } from './context/context';
import Search from './components/search/search';
import DrawerIndex from './components/drawer/drawerIndex';
import Highlights from './components/events/Highlights';
import Pastevents from './components/events/Pastevents';
import AdvanceSearch from './components/events/advanceSearch';
import MainEvents from './components/events/mainEvents';
import PopularIndexes from './components/events/highlightsViewAll';
import SearchResult from './components/events/searchResult';
import Index from './components/events';
import Portfolio from './components/portfolio';
import CreatePortfolio from './components/userPortfolio/createPortfolio'
import PortfolioTransactions from './components/portfolio/transactions';
import ListingPage from './components/userPortfolio/listingPage'
import PortfolioAssets from './components/portfolio/assets';
import CoinDetailsPage from './components/coinDetailsPage/coinDetailsPage';

const Drawer = createDrawerNavigator();
function DrawerRouteHome() {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerIndex {...props} />}>
      <Drawer.Screen options={{ headerShown: false }} name="Home" component={Home} />
    </Drawer.Navigator>
  );
}
function DrawerRoutePortfolio() {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerIndex {...props} />}>
      <Drawer.Screen options={{ headerShown: false }} name="Portfolio" component={ListingPage} />
    </Drawer.Navigator>
  );
}
function DrawerRouteExplore() {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerIndex {...props} />}>
      <Drawer.Screen options={{ headerShown: false }} name="Explore" component={Explore} />
    </Drawer.Navigator>
  );
}
function DrawerRouteForum() {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerIndex {...props} />}>
      <Drawer.Screen options={{ headerShown: false }} name="Forum" component={Forum} />
    </Drawer.Navigator>
  );
}
const Stack = createNativeStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen"
        headerMode='none'
        screenOptions={{
          headerTitleAlign: 'center',
          headerShown: false,
          animationEnabled: false,
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#f4f4f4',
          headerTitleStyle: {
            fontWeight: 'bold'
          }
        }}>
        <Stack.Screen name='SplashScreen' component={SplashScreen} />
        <Stack.Screen name='explore' component={DrawerRouteExplore} />
        <Stack.Screen name='home' component={DrawerRouteHome} />
        <Stack.Screen name='listingPage' component={DrawerRoutePortfolio} />
        <Stack.Screen name='forum' component={DrawerRouteForum} />
        <Stack.Screen name='search' component={Search} />
        <Stack.Screen name='mainEvents' component={MainEvents} />
        <Stack.Screen name='highlightsViewAll' component={PopularIndexes} />
        <Stack.Screen name='searchResult' component={SearchResult} />
        <Stack.Screen name='index' component={Index} />
        <Stack.Screen name='advanceSearch' component={AdvanceSearch} />
        <Stack.Screen name='highlights' component={Highlights} />
        <Stack.Screen name='pastevents' component={Pastevents} />
        <Stack.Screen name='portfolio' component={Portfolio} />
        <Stack.Screen name='transactionOverview' component={PortfolioTransactions} />
        <Stack.Screen name='createPortfolio' component={CreatePortfolio} />
        <Stack.Screen name='portfolioAssets' component={PortfolioAssets} />
        <Stack.Screen name='coinDetailsPage' component={CoinDetailsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default () => {
  return (
    <Provider>
      <App />
    </Provider >
  )
}
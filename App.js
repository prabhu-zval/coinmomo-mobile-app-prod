import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './components/home/home';
import SplashScreen from './components/splashScreen/splashScreen';
import { Provider } from './context/context';

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
        <Stack.Screen name='home' component={Home} />
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
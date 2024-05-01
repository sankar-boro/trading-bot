import './firebaseInit';
import 'react-native-gesture-handler';
import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import Colors from './src/constants/Colors';
import TrendingScreen from './src/screens/TrendingScreen';
import WalletScreen from './src/screens/WalletScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import ChartScreen from './src/screens/ChartScreen';
import SignupScreen from './src/screens/SignupScreen';
import LoginScreen from './src/screens/LoginScreen';
import PasswordResetScreen from './src/screens/PasswordResetScreen';
import {LoadingContextProvider} from './src/context/LoadingContext';
import {AuthProvider} from './src/context/AuthContext';
import {ActivityIndicator, StatusBar, Text, View} from 'react-native';
import TradeScreen from './src/screens/TradeScreen';
import AlertScreen from './src/screens/AlertScreen';
import {Dimensions} from 'react-native';
import PickSymbolScreen from './src/screens/PickSymbolScreen';
import {AskReview} from './src/util/util';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';

const TabsNavigator = createBottomTabNavigator();

const Stack = createStackNavigator();

function Tabs() {
  return (
    <TabsNavigator.Navigator
      screenOptions={{
        tabBarShowLabel: false,
      }}>
      <TabsNavigator.Screen
        name="Trending"
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcon name="chart-waterfall" size={30} color="#2d2d2d" />
          ),
        }}
        component={TrendingScreen}
      />
      <TabsNavigator.Screen
        name="Wallet"
        options={{
          tabBarIcon: ({color, size}) => (
            <SimpleLineIcon name="wallet" size={30} color="#2d2d2d" />
          ),
        }}
        component={WalletScreen}
      />
      <TabsNavigator.Screen
        name="Alerts"
        options={{
          tabBarIcon: ({color, size}) => (
            <SimpleLineIcon name="bell" size={30} color="#2d2d2d" />
          ),
        }}
        component={AlertsScreen}
      />
      <TabsNavigator.Screen
        name="Profile"
        options={{
          tabBarIcon: ({color, size}) => (
            <AntIcon name="user" size={30} color="#2d2d2d" />
          ),
        }}
        component={ProfileScreen}
      />
    </TabsNavigator.Navigator>
  );
}

function Navigator() {
  const navigatorRef = useRef(null);
  const routeNameRef = useRef();

  return (
    <NavigationContainer
      ref={navigatorRef}
      onReady={() =>
        (routeNameRef.current = navigatorRef.current?.getCurrentRoute()?.name)
      }
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigatorRef?.current?.getCurrentRoute()?.name;
        routeNameRef.current = currentRouteName;
      }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Chart" component={ChartScreen} />
        <Stack.Screen name="Trade" component={TradeScreen} />
        <Stack.Screen name="Alert" component={AlertScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
        <Stack.Screen name="PickSymbolScreen" component={PickSymbolScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const {width, height} = Dimensions.get('screen');
const Size = Math.min(width * 0.8, height * 0.8);
export default function App() {
  return (
    <LoadingContextProvider>
      <AuthProvider>
        <StatusBar barStyle="dark-content" />
        <Navigator />
      </AuthProvider>
    </LoadingContextProvider>
  );
}

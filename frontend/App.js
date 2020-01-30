import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import LoadingScreen from "./screens/LoadingScreen";
import SigninScreen from "./screens/SigninScreen";
import TripStartScreen from "./screens/TripStartScreen";
/****** */
import TripRunningScreen from "./screens/TripRunningScreen";
import TripFinishedScreen from "./screens/TripFinishedScreen";
import TripHistoryScreen from "./screens/TripHistoryScreen";
import SettingsScreen from "./screens/SettingsScreen";

import * as firebase from "firebase";
import { firebaseConfig } from "./config";

firebase.initializeApp(firebaseConfig);

console.disableYellowBox = true;

const TripNavigator = createSwitchNavigator({
  TripStartScreen: TripStartScreen,
  TripRunningScreen: TripRunningScreen,
  TripFinishedScreen: TripFinishedScreen
});

const AppTabNavigator = createBottomTabNavigator({
  Home: {
    screen: TripNavigator,
    navigationOptions: {
      tabBarIcon: ({ tindColor }) => (
        <Ionicons name="ios-home" size={24} />
      )
    }
  },
  History: {
    screen: TripHistoryScreen,
    navigationOptions: {
      tabBarIcon: ({ tindColor }) => (
        <FontAwesome name="history" size={24} />
      )
    }
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      tabBarIcon: ({ tindColor }) => (
        <Ionicons name="ios-settings" size={24} />
      )
    }
  },
});

const RootNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  SigninScreen: SigninScreen,
  AppTabNavigator: AppTabNavigator
});

export default createAppContainer(RootNavigator);

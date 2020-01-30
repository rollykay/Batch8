import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

import firebase from "firebase";

export default class LoadingScreen extends React.Component {
  
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.navigate("AppTabNavigator", { user: user });
      } else {
        this.props.navigation.navigate("SigninScreen");
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

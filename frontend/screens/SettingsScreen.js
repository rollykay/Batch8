import React from "react";
import { StyleSheet, Text, View, Button, Image, Picker } from "react-native";
import * as firebase from "firebase";

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: firebase.auth().currentUser
    };
  }

  render() {
    return (
      <View style={styles.container}>
          <View><Text>Auto check-out</Text></View>
          <View><Text>Calculate fare</Text></View>
          <View><Text>Payment details</Text></View>
          <View><Text>Permissions</Text></View>
          <View><Text>Privacy Policy</Text></View>
        <Button
          title="Sign out"
          onPress={() => {
            console.log("Pressed sign out.");
            firebase
              .auth()
              .signOut()
              .then(() => {
                this.props.navigation.navigate("LoadingScreen", {});
              });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around"
  }
});

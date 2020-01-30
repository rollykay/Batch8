import React from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import * as firebase from "firebase";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class TripFinishedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: firebase.auth().currentUser,
      startTime: props.navigation.getParam("startTime"),
      startStation: props.navigation.getParam("startStation"),
      startLocation: props.navigation.getParam("startLocation"),
      endTime: props.navigation.getParam("endTime"),
      endStation: props.navigation.getParam("endStation"),
      endLocation: props.navigation.getParam("endLocation"),
      stationsDict: {}
    };
  }

  componentDidMount() {
    fetch("https://phoenix-253808.appspot.com/api/trips/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: this.state.user.uid,
        start_time: this.state.startTime,
        start_station: this.state.startStation.id,
        start_latitude: this.state.startLocation.coords.latitude,
        start_longitude: this.state.startLocation.coords.longitude,
        end_time: this.state.endTime,
        end_station: this.state.endStation.id,
        end_latitude: this.state.endLocation.coords.latitude,
        end_longitude: this.state.endLocation.coords.longitude,
        ticket: "SINGLE_TRIP_TICKET",
        ticket_price: 3.3
      })
    });
    // TODO: Check if it was successful
  }

  render() {
    const startStation = this.state.startStation;
    const endStation = this.state.endStation;
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.textBlue}>Trip ended</Text>
        </View>
        <View>
          <Image
            style={{ width: 150, height: 200 }}
            source={require("../screens/image/end.jpg")}
          ></Image>
        </View>

        <View>
          <Text>Thank you, {this.state.user.displayName}, for using MGO.</Text>
        </View>

        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Text style={styles.textGray}>{startStation.name}</Text>
          </View>
          <View>
            <Text style={styles.textGray}>{endStation.name}</Text>
          </View>
        </View>

        <View>
          <Text>
            Fare will be charged by the end of the day, considering all your
            trips through the day, to provide you with the best price.
          </Text>
        </View>

        <View style={styles.button}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("TripStartScreen", {})
            }
          >
            <Text style={styles.buttonText}>Start new trip</Text>
          </TouchableOpacity>
        </View>
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
  },
  button: {
    backgroundColor: "#FFD700",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 12,
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
    overflow: "hidden",
    padding: 12,
    textAlign: "center"
  },
  buttonText: {
    textAlign: "center"
  },
  textBlue: {
    color: "darkslateblue",
    fontWeight: "bold",
    fontSize: 30
  },
  textGray: {
    color: "dimgray",
    fontWeight: "bold",
    fontSize: 20
  },
  row: {
    flexDirection: "column",
    justifyContent: "space-between"
  }
});

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Picker,
  TouchableOpacity
} from "react-native";
import * as firebase from "firebase";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

export default class TripRunningScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: firebase.auth().currentUser,
      startTime: props.navigation.getParam("startTime"),
      startStation: props.navigation.getParam("startStation"),
      startLocation: props.navigation.getParam("startLocation"),
      stations: [],
      endLocation: {},
      receivedStations: false,
      endStation: {},
      endStationId: null
    };
  }

  udpateCurrentLocation() {
    const { status } = Permissions.askAsync(Permissions.LOCATION);
    Location.getCurrentPositionAsync({}).then(location => {
      console.log("Current location:");
      console.log(location);
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      const radius = 500;
      fetch(
        `https://phoenix-253808.appspot.com/api/trips/stations/v2/?lat=${latitude}&long=${longitude}&r=${radius}`
      )
        .then(response => response.json())
        .then(stations => {
          this.setState({
            stations: stations,
            endLocation: location,
            receivedStations: true
          });
        });
    });
  }

  componentWillMount() {
    console.log("Updating current location.");
    this.udpateCurrentLocation();
  }

  render() {
    return (
      <View style={styles.container}>
        {/*<View>
          <Text>Hello, {this.state.user.displayName}</Text>
        </View>*/}

        <View>
          <Text style={styles.textBlue}>On the way</Text>
        </View>
        <View>
          <Image
            style={{ width: 300, height: 200 }}
            source={require("../screens/image/ontheway.gif")}
          ></Image>
        </View>

        <View>
          <Text>From: {this.state.startStation.name}</Text>
        </View>

        <View>
          <Text>Started at: {this.state.startTime}</Text>
        </View>

        <View>
          <Picker
            selectedValue={this.state.endStationId}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({
                endStationId: itemValue,
                endStation: this.state.stations[itemIndex]
              });
              console.log("Selected end station: " + itemValue);
            }}
          >
            {this.state.stations.map(station => {
              return (
                <Picker.Item
                  key={station.id}
                  label={station.name}
                  value={station.id}
                />
              );
            })}
          </Picker>
        </View>

        <View>
          <Button
            title="Refresh stations"
            onPress={() => {
              console.log("Refresh button pressed.");
              this.udpateCurrentLocation();
            }}
          />
        </View>

        <View style={styles.buttonAlign}>
          <Image
            style={{ width: 150, height: 100 }}
            source={require("../screens/image/qr_code.png")}
          ></Image>
        </View>

        <View style={styles.buttonAlign}>
          <TouchableOpacity
            style={styles.button}
            disabled={this.state.receivedStations == false}
            onPress={() => {
              const endTime = new Date().toISOString();
              console.log("End time: " + endTime);
              this.props.navigation.navigate("TripFinishedScreen", {
                startTime: this.state.startTime,
                startStation: this.state.startStation,
                startLocation: this.state.startLocation,
                endTime: endTime,
                endStation: this.state.endStation,
                endLocation: this.state.endLocation
              });
            }}
          >
            <Text style={styles.buttonText}>End</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "space-around"
  },
  textBlue: {
    color: "darkslateblue",
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center"
  },
  button: {
    backgroundColor: "#FFD700",
    width: 200,
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
  buttonAlign: {
    alignItems: "center"
  }
});

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Image,
  Picker,
  TouchableOpacity
} from "react-native";

import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import * as firebase from "firebase";

export default class TripStartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: firebase.auth().currentUser,
      stations: [],
      startLocation: {},
      receivedStations: false,
      startStationId: null,
      startStation: {}
    };
  }

  udpateCurrentLocation() {
    Permissions.askAsync(Permissions.LOCATION)
      .then(status => Location.getCurrentPositionAsync({}))
      .then(location => {
        //console.log("Current location:");
        //console.log(location);
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
              startLocation: location,
              receivedStations: true
            });
          });
      });
  }

  componentDidMount() {
    this.udpateCurrentLocation();
  }

  render() {
    return (
      <View style={styles.container}>
        {/*<View>
          <Text>Hello {this.state.user.displayName}</Text>
        </View>*/}

        <View>
          <Text style={styles.textBlue}>Start your trip</Text>
        </View>
        <View style={styles.pictureTextAlign}>
          <View>
            <Image
              style={{ width: 200, height: 200 }}
              source={require("../screens/image/start.jpg")}
            ></Image>
          </View>
        </View>

        <View>
          <Text>You are now at:</Text>
          <Picker
            selectedValue={this.state.startStationId}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({
                startStationId: itemValue,
                startStation: this.state.stations[itemIndex]
              });
              //console.log(itemValue);
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

        {/*<View>
          <Button
            title="Refresh stations"
            onPress={() => {
              console.log("Refresh button pressed.");
              this.udpateCurrentLocation();
            }}
          />
        </View>*/}
        <View style={styles.buttonAlign}>
          <TouchableOpacity
            style={styles.button}
            disabled={this.state.receivedStations == false}
            onPress={() => {
              const startTime = new Date().toISOString();
              //console.log("Start time: " + startTime);
              this.props.navigation.navigate("TripRunningScreen", {
                startStation: this.state.startStation,
                startTime: startTime,
                startLocation: this.state.startLocation
              });
            }}
          >
            <Text style={styles.buttonText}>Start</Text>
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
  pictureTextAlign: {
    alignSelf: "flex-start"
  },
  buttonAlign: {
    alignItems: "center"
  }
});

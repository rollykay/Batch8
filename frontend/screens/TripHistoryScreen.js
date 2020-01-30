import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  ActivityIndicator
} from "react-native";
import * as firebase from "firebase";

export default class TripHistoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: firebase.auth().currentUser,
      trips: null,
      stationsDict: null
    };
  }

  componentWillMount() {
    const latitude = "48.1385963";
    const longitude = "11.5757336";
    const radius = 100000;
    fetch(
      `https://phoenix-253808.appspot.com/api/trips/stations/v2/?lat=${latitude}&long=${longitude}&r=${radius}`
    )
      .then(response => response.json())
      .then(stations => {
        stationsDict = {};
        stations.forEach(station => {
          stationsDict[station.id] = station;
        });
        this.setState({
          stationsDict: stationsDict
        });
      });

    fetch(
      "https://phoenix-253808.appspot.com/api/trips/?user_id=" +
        this.state.user.uid
    )
      .then(response => response.json())
      .then(trips => {
        this.setState({
          trips: trips
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  render() {
    if (this.state.stationsDict == null || this.state.trips == null) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View>
            <Text style={styles.textBlue}>History</Text>
          </View>
          <View style={styles.contentRow}>
            <View style={styles.cellTop}>
              <Text>From</Text>
            </View>
            <View style={styles.cellTop}>
              <Text>To</Text>
            </View>
            <View style={styles.cellCostTop}>
              <Text>Cost</Text>
            </View>
          </View>
          <FlatList
            data={this.state.trips}
            renderItem={({ item }) => (
              <View style={styles.contentRow}>
                <View style={styles.cell}>
                  <Text style={styles.stationText}>
                    {this.state.stationsDict[item.start_station].name}
                  </Text>
                  <Text style={styles.historyText}>
                    {new Date(item.start_time).toLocaleDateString()}
                  </Text>
                  <Text style={styles.historyText}>
                    {new Date(item.start_time).toLocaleTimeString()}
                  </Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.stationText}>
                    {this.state.stationsDict[item.end_station].name}
                  </Text>
                  <Text style={styles.historyText}>
                    {new Date(item.end_time).toLocaleDateString()}
                  </Text>
                  <Text style={styles.historyText}>
                    {new Date(item.end_time).toLocaleTimeString()}
                  </Text>
                </View>
                <View style={styles.cellCost}>
                  <Text style={styles.stationText}>{item.ticket_price}€</Text>
                </View>
              </View>
            )}
            keyExtractor={({ id }, index) => id + "1"}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "space-around"
  },
  head: { height: 40, backgroundColor: "#d3d3d3" },
  text: { margin: 6 },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#e6e6fa"
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#e6e6fa"
    //alignItems: "flex-start"
  },
  cell: {
    padding: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: 130,
    height: 100,
    backgroundColor: "#e6e6fa"
  },
  cellCost: {
    padding: 10,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    width: 75,
    height: 100,
    backgroundColor: "#e6e6fa"
  },
  cellTop: {
    padding: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: 130,
    height: 50,
    backgroundColor: "#e6e6fa"
  },
  cellCostTop: {
    padding: 10,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    width: 75,
    height: 50,
    backgroundColor: "#e6e6fa"
  },
  textBlue: {
    color: "darkslateblue",
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center"
  },
  historyText: {
    textAlign: "left"
  },
  stationText: {
    fontWeight: "bold",
    textAlign: "left"
  },

  cellDetails: {
    width: 50,
    height: 50,
    backgroundColor: "grey"
  }
});

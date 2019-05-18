import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Reminder from '../components/Reminder'
import Colors from '../constants/Colors';

export default class ReminderScreen extends React.Component {
  static navigationOptions = {
    title: 'Reminder',
    header: null
    // headerStyle: {
    //   backgroundColor: Colors.headerRed,
    //   height: 35
    // },
    // // headerTintColor: '#fff',
    // headerTitleStyle: {
    //   color: 'white',
    //   fontFamily: 'System',
    //   fontWeight: '800',
    //   fontSize: 26,
    //   marginRight: 120,
    //   paddingBottom: 20,
    //   textAlign: 'center'
    // },
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Create Reminder</Text>
        <Reminder/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingBottom: 190,
    backgroundColor: Colors.darkBackground
  },
  header: {
    padding: 6,
    paddingLeft: 10,
    color: 'white',
    backgroundColor: Colors.headerRed,
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 26
  }
});
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Reminder from '../components/Reminder'
import Colors from '../constants/Colors';
import DayHeader from '../components/DayHeader'

export default class ReminderScreen extends React.Component {
  static navigationOptions = {
    title: 'Reminder',
    header: null
  };

  handleHeaderIconPress = () => {
    this.props.navigation.navigate('TaskList');
  }

  render() {
    return (
      <View style={styles.container}>
        <DayHeader title="Details" noDate handleHeaderIconPress={this.handleHeaderIconPress}/>
        <Reminder navigation={this.props.navigation}/>
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
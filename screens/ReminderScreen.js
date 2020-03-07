import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Haptic } from 'expo'
import Reminder from '../components/Reminder'
import Colors from '../constants/Colors';
import DayHeader from '../components/DayHeader'

export default class ReminderScreen extends React.Component {
  static navigationOptions = {
    title: 'Reminder',
    header: null
  };

  navigateBack = () => {
    Haptic.impact('heavy');
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
        <DayHeader
          title="Details"
          noDate
          badgeText={this.props.navigation.getParam('backText')}
          handleHeaderIconPress={this.navigateBack}/>
        <Reminder navigation={this.props.navigation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBackground
  },
  header: {
    padding: 6,
    paddingLeft: 10,
    color: Colors.WHITE,
    backgroundColor: Colors.headerRed,
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 26
  }
});
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import SwipeUpDown from 'react-native-swipe-up-down';
import TaskList from '../components/TaskList';
import Colors from '../constants/Colors'

export default class TaskListScreen extends React.Component {
  static navigationOptions = {
    title: 'TaskList',
    header: null
  };

  render() {
    return (
      <View style={styles.container}>
        <TaskList navigation={this.props.navigation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBackground,
  },
});
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import SwipeUpDown from 'react-native-swipe-up-down';
import TaskList from '../components/TaskList';
import Colors from '../constants/Colors'

export default class TaskListScreen extends React.Component {
  static navigationOptions = {
    title: 'Tasks',
    header: null
  };

  render() {
    return (
      <View style={styles.container}>
        <TaskList navigate={this.props.navigation.navigate} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingBottom: 40,
    backgroundColor: Colors.darkBackground,
  },
});
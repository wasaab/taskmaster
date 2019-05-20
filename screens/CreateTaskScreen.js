import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Reminder from '../components/Reminder'
import Colors from '../constants/Colors';
import DayHeader from '../components/DayHeader'

export default class CreateTaskScreen extends React.Component {
  static navigationOptions = {
    title: 'CreateTask',
    header: null
  };

  handleHeaderIconPress = () => {
    this.props.navigation.navigate('TaskList');
  }

  render() {
    return (
      <View style={styles.container}>
        <DayHeader title="Create Task" noDate dayOffset={0} handleHeaderIconPress={this.handleHeaderIconPress} />
        {/* <Reminder/> */}
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
    color: 'white',
    backgroundColor: Colors.headerRed,
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 26
  }
});
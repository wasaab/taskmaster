import React from 'react';
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';
import TaskList from '../components/TaskList';
import Colors from '../constants/Colors';
import TaskManager from '../components/TaskManager';

const taskManager = new TaskManager();

export default class TimesheetScreen extends React.Component {
  static navigationOptions = {
    title: 'Timesheet',
    header: null,
  };

  constructor(props) {
    const dayIdx = taskManager.tasks.findIndex((daySection) => daySection.day === new Date().toLocaleDateString());

    super(props);
    this.dayIdx = dayIdx;
    this.state = {
      hoursLogged: `${taskManager.tasks[this.dayIdx].hoursLogged}`
    };
  };

  addToTotalHoursLogged = (taskID, hours) => {
    const totalHours = `${taskManager.tasks[this.dayIdx].data.reduce((dayHours, task, i) => {
      if (i === 1) { return Number(dayHours.hoursLogged) + Number(task.hoursLogged); }

      return dayHours + Number(task.hoursLogged);
    })}`;

    this.setState({ hoursLogged: totalHours });
    taskManager.tasks[this.dayIdx].hoursLogged = totalHours;
  }

  componentDidMount() {
    this.refs.hoursInput.focus();
  }

  navigateToTaskListScreen() {
    this.props.navigation.navigate('TaskList');
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <TaskList
          hoursLogged={this.state.hoursLogged}
          style={styles.taskList}
          pageRenderedIn="Timesheet"
          navigate={this.props.navigation.navigate}
          handleTimeInputBadgePress={this.handleTimeInputBadgePress}
          addToTotalHoursLogged={this.addToTotalHoursLogged}
        />
        <View style={styles.hoursLoggedContainer} onMagicTap={this.navigateToTaskListScreen}>
          <TextInput
            ref='hoursInput'
            style={styles.hoursLoggedInput}
            onChangeText={this.handleHoursLoggedInputChange}
            value={this.state.hoursLogged}
            keyboardType="numeric"
            clearTextOnFocus={true}
            autofocus={true}
            placeholder="0.00"
            keyboardAppearance="dark"
            maxLength={5}
            editable={false}
          />
          <Text style={styles.hoursLoggedMsg}>Hours logged today.</Text>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: Colors.darkBackground
  },
  hoursLoggedContainer: {
    height: 62,
    paddingTop: 10,
    alignItems: 'flex-start',
    // justifyContent: 'space-evenly',
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.transparentGrayBorder
  },
  hoursLoggedInput: {
    backgroundColor: 'white',
    color: 'black',
    borderColor: 'white',
    borderWidth: 1.5,
    borderRadius: 5,
    marginBottom: 10,
    // flex: 0.2,
    minWidth: 47,
    minHeight: 15,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 3,
    marginRight: 14,
    marginLeft: 11
  },
  hoursLoggedMsg: {
    color: 'white',
    flex: 0.8,
    flexWrap: 'wrap',
    width: '100%',
    height: 70,
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 20
  },
  taskList: {
  }
});

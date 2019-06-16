import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, RefreshControl, AsyncStorage, Animated, TouchableHighlight, KeyboardAvoidingView } from 'react-native';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements'
import Colors from '../constants/Colors'
import DayHeader from './DayHeader'
import ListItem from './ListItem';
import TaskManager from './TaskManager';
import KeyboardAwareSwipeListView from './KeyboardAwareSwipeListView';

const taskManager = new TaskManager();

export default class TaskList extends Component {

  constructor(props) {
    console.log('reconstructing task list');
    super(props);

    this.navigate = props.navigate;
    this.state = {
      activeTaskKey: '',
      pageRenderedIn: props.pageRenderedIn || 'TaskList',
      isTimesheet: props.pageRenderedIn === 'Timesheet',
      creatingTask: false,
    };

    this.taskIdToActiveSwipeDirection = {};
    this.rowSwipeAnimatedValues = {};

    taskManager.tasks.forEach((day) => {
        day.data.forEach((task) => {
          this.rowSwipeAnimatedValues[task.key] = new Animated.Value(0);
        });
    });
  }

  buildTask(title, blocker, completionPercentage, date, remindTime) {
    date = date || new Date();

    return {
      key: taskManager.getTaskId({ title: title, date: date.valueOf() }),
      title: title,
      blocker: blocker,
      completionPercentage: completionPercentage || 0,
      hoursLogged: 0,
      isComplete: false,
      date: date.valueOf(),
      remindTime: remindTime
    };
  }

  navigateBack = () => {
    this.navigate(this.state.pageRenderedIn === 'TaskList' ? 'Timesheet' : 'TaskList');
  }

  onRefresh = () => {
    this.navigateBack();
  }

  handleHeaderIconPress = () => {
    this.navigateBack();
  }

  determineDayDisplayStyle = () => {
    return { display: this.state.isTimesheet ? 'none' : 'flex' };
  }

  componentDidMount = () => {

  }

  closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
      delete this.taskIdToActiveSwipeDirection[rowKey];
    }
  }

  deleteSectionRow = (rowMap, taskID) => {
    this.closeRow(rowMap, taskID);

    setTimeout(() => {
      const { dayIdx, taskIdx } = taskManager.getTask(taskID);
      taskManager.tasks[dayIdx].data.splice(taskIdx, 1);
    }, 250)
  }

  onRowOpen = (rowKey, rowMap, toValue) => {
    this.closeRow(rowMap, rowKey);
  }

  onRowDidOpen = (taskID, rowMap, toValue) => {
    if (toValue < 0) {
      this.deleteSectionRow(rowMap, taskID);
    } else {
      const { task } = taskManager.getTask(taskID);

      task.isComplete = true;
    }
  }

  onSwipeValueChange = (swipeData) => {
    const { key, value } = swipeData;
    this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));

    const direction = value < 0 ? 'right' : 'left';

    if (this.taskIdToActiveSwipeDirection[key] === direction) { return; }

    this.taskIdToActiveSwipeDirection[key] = direction;
    this.setState({ taskIdToActiveSwipeDirection: this.taskIdToActiveSwipeDirection });
  }

  determineRowColor = (taskID, side) => {
    const activeSwipeDirection = this.taskIdToActiveSwipeDirection[taskID];

    return activeSwipeDirection ? getSwipeDirectionColor(activeSwipeDirection) : getSwipeDirectionColor(side);
  }

  handleTitleOrBlockerInputBlur = (taskID, title, blocker) => {
    const { task } = taskManager.getTask(taskID);

    if (task.title === title && task.blocker === blocker) { return; }

    task.title = title;
    task.blocker = blocker;

    taskManager.storeTasks();
  }

  handleBadgeInputBlur = (taskID, hours, completionPercentage) => {
    const { task } = taskManager.getTask(taskID);

    if (task.hoursLogged !== hours || task.completionPercentage !== completionPercentage) {
      if (this.state.isTimesheet) {
        task.hoursLogged = hours;
        this.props.addToTotalHoursLogged(taskID, hours);
      } else {
        task.completionPercentage = completionPercentage;
      }

      taskManager.storeTasks();
    }

    this.setState({ activeTaskKey: `${Math.floor(Math.random() * 10000)}` });
  }

  handleTimeInputBadgePress = (key) => {
    this.setState({ activeTaskKey: key });
  }

  renderTaskItem = (data, rowMap) => {
    return <TouchableHighlight onPress={_ => console.log('You touched me')} style={styles.rowFront} underlayColor={'#AAA'}>
      <ListItem
        title={data.item.title}
        blocker={data.item.blocker}
        completionPercentage={data.item.completionPercentage}
        isTimesheet={this.state.isTimesheet}
        isComplete={data.item.isComplete}
        today={data.section.day === new Date().toLocaleDateString()}
        hoursLogged={data.item.hoursLogged}
        currHoursLoggedInputValue={this.props.hoursLogged}
        activeTaskKey={this.state.activeTaskKey}
        taskID={data.item.key}
        handleTimeInputBadgePress={this.handleTimeInputBadgePress}
        handleBadgeInputBlur={this.handleBadgeInputBlur}
        handleTitleOrBlockerInputBlur={this.handleTitleOrBlockerInputBlur}
      />
    </TouchableHighlight>;
  }

  renderSwipeItems = (data, rowMap) => {
    return <View style={[styles.rowBack, { backgroundColor: this.determineRowColor(data.item.key) }]}>
      <TouchableOpacity style={[styles.leftSwipeItem, { backgroundColor: this.determineRowColor(data.item.key, 'left') }]}>
        <Animated.View style={{
          opacity: this.getOpacityFromSwipeVal(data.item.key),
          transform: [{
            scale: this.getScaleFromSwipeVal(data.item.key)
          }]
        }}>
          <Icon size={28} color='white' name="check-circle" type="materialicons" />
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.rightSwipeItem, { backgroundColor: this.determineRowColor(data.item.key, 'right') }]} onPress={_ => this.deleteSectionRow(rowMap, data.item.key)}>
        <Animated.View style={{
          opacity: this.getOpacityFromSwipeVal(data.item.key),
          transform: [{
            scale: this.getScaleFromSwipeVal(data.item.key)
          }]
        }}>
          <Icon size={28} color='white' name="delete" type="materialicons" />
        </Animated.View>
      </TouchableOpacity>
    </View>;
  }

  getScaleFromSwipeVal(key) {
    return this.rowSwipeAnimatedValues[key].interpolate({
      inputRange: [45, 90],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
  }

  getOpacityFromSwipeVal(key) {
    return this.rowSwipeAnimatedValues[key].interpolate({
      inputRange: [0, 89, 90],
      outputRange: [0.5, 0.5, 1]
    });
  }

  createTask = () => {
    this.setState({ creatingTask: true });

    setTimeout(() => {
      const task = this.buildTask('New Task', '');
      const today = new Date().toLocaleDateString();

      this.rowSwipeAnimatedValues[task.key] = new Animated.Value(0);
      taskManager.tasks.find((dayTasks) => dayTasks.day === today).data.unshift(task);
      this.setState({ creatingTask: false });
    }, 500)
  }

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareSwipeListView
          useSectionList
          sections={taskManager.tasks}
          renderSectionHeader={({ section: { day } }) => (
            <DayHeader day={day} isTimesheet={this.state.isTimesheet} hidden={this.state.isTimesheet && day !== new Date().toLocaleDateString()} handleHeaderIconPress={this.handleHeaderIconPress} />
          )}
          renderItem={this.renderTaskItem}
          renderHiddenItem={this.renderSwipeItems}
          leftOpenValue={90}
          rightOpenValue={-90}
          swipeToOpenPercent={100}
          stopLeftSwipe={307}
          stopRightSwipe={-307}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          friction={9}
          tension={38}
          onRowOpen={this.onRowOpen}
          onRowDidOpen={this.onRowDidOpen}
          onSwipeValueChange={this.onSwipeValueChange}
          disableLeftSwipe={this.state.isTimesheet}
          disableRightSwipe={this.state.isTimesheet}
          extraHeight={45}
          keyboardOpeningTime={0}
          onRefresh={this.createTask}
          refreshing={this.state.creatingTask}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darkBackground,
    flex: 1
  },
  rowFront: {

  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  rightSwipeItem: {
    alignItems: 'flex-end',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: '50%',
    right: 0,
    paddingRight: 10
  },
  leftSwipeItem: {
    alignItems: 'flex-start',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: '50%',
    left: 0,
    paddingLeft: 10
  },
});

function getSwipeDirectionColor(side) {
  return side ==='left' ? Colors.statusGreen : Colors.headerRed;
}
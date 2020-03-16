import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, RefreshControl, AsyncStorage, Animated, TouchableHighlight, KeyboardAvoidingView } from 'react-native';
import { Avatar, Badge, withBadge } from 'react-native-elements'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptic from 'expo-haptics';
import Colors from '../constants/Colors'
import DayHeader from './DayHeader'
import ListItem from './ListItem';
import TaskManager from './TaskManager';
import KeyboardAwareSwipeListView from './KeyboardAwareSwipeListView';
import { NavigationActions } from 'react-navigation';
const taskManager = new TaskManager();

export default class TaskList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tasks: taskManager.getTasks(),
      activeTaskKey: '',
      pageRenderedIn: props.pageRenderedIn || 'TaskList',
      isTimesheet: props.pageRenderedIn === 'Timesheet',
      creatingTask: false
    };

    this.taskIdToActiveSwipeDirection = {};
    this.rowSwipeAnimatedValues = {};

    maybeAddCreateTaskTip();
    this.state.tasks.forEach((day) => {
        day.data.forEach((task) => {
          this.rowSwipeAnimatedValues[task.key] = new Animated.Value(0);
        });
    });
  }

  navigateBack = () => {
    this.props.navigation.navigate(this.state.isTimesheet ? 'TaskList' : 'Timesheet');
  }

  handleHeaderIconPress = () => {
    Haptic.impactAsync('heavy');
    this.navigateBack();
  }

  determineDayDisplayStyle = () => {
    return { display: this.state.isTimesheet ? 'none' : 'flex' };
  }

  closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
      delete this.taskIdToActiveSwipeDirection[rowKey];
    }
  }

  addCreateTaskTip = (dayTasks) => {
    const task = taskManager.buildTask();

    task.isCreateTaskTip = true;
    dayTasks.push(task);
    this.setState({ activeTaskKey: task.key });
  }

  deleteSectionRow = (rowMap, taskID) => {
    this.closeRow(rowMap, taskID);

    setTimeout(() => {
      const { dayIdx, taskIdx } = taskManager.getTask(taskID);
      const day = this.state.tasks[dayIdx];

      day.data.splice(taskIdx, 1);

      if (0 === day.data.length) {
        if (day.day !== new Date().toLocaleDateString()) {
          this.state.tasks.splice(dayIdx, 1);
        } else {
          this.addCreateTaskTip(day.data);
        }
      }

      taskManager.storeTasks();
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
      taskManager.storeTasks();
    }
  }

  onSwipeValueChange = (swipeData) => {
    const { key, value } = swipeData;
    this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));

    const direction = getSwipeDirection(value);

    if (!direction || this.taskIdToActiveSwipeDirection[key] === direction) { return; }

    this.taskIdToActiveSwipeDirection[key] = direction;
    this.setState({ taskIdToActiveSwipeDirection: this.taskIdToActiveSwipeDirection });
  }

  componentDidMount = () => {
    // Workaround for KeyboardAwareSectionList bug with data refreshing
    setTimeout(() => taskManager.setTasks(this.state.tasks), 1)
  }

  determineRowColor = (taskID, side) => {
    const activeSwipeDirection = this.taskIdToActiveSwipeDirection[taskID];

    return activeSwipeDirection ?
     getSwipeDirectionColor(activeSwipeDirection) : getSwipeDirectionColor(side);
  }

  handleTitleOrBlockerInputBlur = (taskID, title, blocker) => {
    const { task, dayIdx, taskIdx } = taskManager.getTask(taskID);

    if (task.title === title && task.blocker === blocker) { return; }

    task.title = title;
    task.blocker = blocker;

    taskManager.storeTasks();
  }

  handleBadgeInputBlur = (taskID, hours, completionPercentage) => {
    const { task, dayIdx, taskIdx } = taskManager.getTask(taskID);

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
    if (data.item.isCreateTaskTip) {
      return (
        <View style={[styles.swipeDownTipContainer, this.determineDayDisplayStyle()]}>
          <MaterialCommunityIcons name="gesture-swipe-down" size={70} color={Colors.WHITE} />
          <Text style={styles.swipeDownTipText}>Create a task</Text>
        </View>
      );
    }

    return <ListItem
        title={data.item.title}
        blocker={data.item.blocker}
        completionPercentage={data.item.completionPercentage}
        hoursLogged={data.item.hoursLogged}
        isComplete={data.item.isComplete}
        reminder={data.item.reminder}
        taskID={data.item.key}
        activeTaskKey={this.state.activeTaskKey}
        isTimesheet={this.state.isTimesheet}
        today={data.section.day === new Date().toLocaleDateString()}
        handleTimeInputBadgePress={this.handleTimeInputBadgePress}
        handleBadgeInputBlur={this.handleBadgeInputBlur}
        handleTitleOrBlockerInputBlur={this.handleTitleOrBlockerInputBlur}
        navigation={this.props.navigation}/>
  }

  renderSwipeItems = (data, rowMap) => {
    if (data.item.isCreateTaskTip) { return; }

    return <View style={[styles.rowBack, { backgroundColor: this.determineRowColor(data.item.key) }]}>
      <TouchableOpacity style={[styles.leftSwipeItem, { backgroundColor: this.determineRowColor(data.item.key, 'left') }]}>
        <Animated.View style={{
          opacity: this.getOpacityFromSwipeVal(data.item.key),
          transform: [{
            scale: this.getScaleFromSwipeVal(data.item.key)
          }]
        }}>
          <MaterialIcons size={28} color={Colors.WHITE} name="check-circle" />
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.rightSwipeItem,
            { backgroundColor: this.determineRowColor(data.item.key, 'right') }]}
        onPress={_ => this.deleteSectionRow(rowMap, data.item.key)}>
        <Animated.View style={{
          opacity: this.getOpacityFromSwipeVal(data.item.key),
          transform: [{
            scale: this.getScaleFromSwipeVal(data.item.key)
          }]
        }}>
          <MaterialIcons size={28} color={Colors.WHITE} name="delete" />
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
      const task = taskManager.buildTask();
      const today = new Date().toLocaleDateString();
      const { day } = taskManager.findMostRecentDay();

      if (day.data.length === 0 || day.data[0].isCreateTaskTip) {
        day.data = [];
      }

      this.rowSwipeAnimatedValues[task.key] = new Animated.Value(0);
      day.data.unshift(task);
      this.setState({ creatingTask: false, activeTaskKey: task.key });
    }, 500)
  }

  createTaskControl = () => {
    if (this.state.isTimesheet) { return; }

    return (
      <RefreshControl
        title='Create task'
        titleColor={Colors.WHITE}
        tintColor={Colors.WHITE}
        onRefresh={this.createTask}
        refreshing={this.state.creatingTask}/>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareSwipeListView
          useSectionList
          sections={this.state.tasks}
          renderSectionHeader={({ section: { day } }) => (
            <DayHeader
              day={day}
              badgeText={this.state.isTimesheet ? 'TASKS' : 'TIME'}
              isTimesheet={this.state.isTimesheet}
              hidden={this.state.isTimesheet && day !== new Date().toLocaleDateString()}
              handleHeaderIconPress={this.handleHeaderIconPress}/>
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
          enableResetScrollToCoords={false}
          refreshControl={this.createTaskControl()}
        />
      </View>
    );
  }
}

function maybeAddCreateTaskTip() {
  const { day, dayIdx, isToday } = taskManager.findMostRecentDay();

  if (isToday && day.data.length !== 0) { return; }

  const task = taskManager.buildTask();

  task.isCreateTaskTip = true;

  if (isToday) {
    taskManager.getTasks()[dayIdx].data.push(task);
  } else {
    const today = new Date().toLocaleDateString();

    taskManager.getTasks().splice(dayIdx + 1, 0, taskManager.buildDay(today, task));
  }
}

function getSwipeDirectionColor(side) {
  return side ==='left' ? Colors.statusGreen : Colors.headerRed;
}

function getSwipeDirection(swipeValue) {
  if (swipeValue < -0.1) { return 'right'; }
  if (swipeValue > 0.1) { return 'left'; }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darkBackground,
    flex: 1
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
  swipeDownTipContainer: {
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 2,
    marginBottom: 2,
    backgroundColor: Colors.darkBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderStyle: 'dashed',
    borderWidth: 3,
    borderColor: Colors.WHITE
  },
  swipeDownTipText: {
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 20,
    color: Colors.WHITE,
    marginLeft: -50
  }
});
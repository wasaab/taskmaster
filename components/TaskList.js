import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, RefreshControl, AsyncStorage, Animated, TouchableHighlight } from 'react-native';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements'
import Swipeable from 'react-native-swipeable';
import { SwipeListView } from 'react-native-swipe-list-view';
import SwipeableListItem from './SwipeableListItem'
import Colors from '../constants/Colors'
import DayHeader from './DayHeader'
import ListItem from './ListItem';

export default class TaskList extends Component {

  constructor(props) {
    super(props);

    this.navigate = props.navigate;
    this.state = {
      activeTaskKey: '',
      dayCount: 0,
      taskCount: 0,
      tasks: [],
      pageRenderedIn: props.pageRenderedIn || 'TaskList',
      isTimesheet: props.pageRenderedIn === 'Timesheet',
      refreshing: false,
      todayHeader: props.pageRenderedIn === 'Timesheet' ? 'Timesheet -' : 'Today,',
      sectionListData: [],
      dayIdx: -1
    };

    this.taskIdToActiveSwipeDirection = {};
    this.rowSwipeAnimatedValues = {};
		Array(5).fill('').forEach((_, i) => {
        Array(5).fill('').forEach((_, j) => {
            this.rowSwipeAnimatedValues[`${i}.${j}`] = new Animated.Value(0);
        });
    });
    this.initTasks();

    this.state.sectionListData.push(this.buildDayList(getTodayPlusOffset(-1), "Yesterday,"), this.buildDayList(getTodayPlusOffset(0), this.state.todayHeader), this.buildDayList(getTodayPlusOffset(1), "Tomorrow,"));

    // console.log('sectionListData:', this.state.sectionListData);
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

  //Todo: Changing default to flex seems to help allow header to be styled. default is invalid but nothing thrown
  determineDayDisplayStyle = () => {
    return { display: this.state.isTimesheet ? 'none' : 'flex' };
  }

  componentDidMount = () => {
    // storeData();

    // setTimeout(() => {
    //   getData();
    // }, 3000);
  }

  //Todo: Use this for refresh behavior in sectionlist?
  refreshControl = () => {
    return (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh} />
    )
  }

  initTasks = () => {
    this.state.tasks.push(buildTask('Finish the application', 'React is tricky', 45, getTodayPlusOffset(-1)));
    this.state.tasks.push(buildTask('Finish the application', 'React is tricky', 45, getTodayPlusOffset(-1)));
    this.state.tasks.push(buildTask('Finish the application', 'React is tricky', 45, getTodayPlusOffset(-1)));

    this.state.tasks.push(buildTask('Make a create task screen', 'Clarification needed', 40));
    this.state.tasks.push(buildTask('Improve the reminder screen', 'Need mockup from Collin', 70));
    this.state.tasks.push(buildTask('Make a timesheet screen', 'Clarification needed', 83));
    this.state.tasks.push(buildTask('Make the task title wrap', 'Lots of static padding', 0));
    this.state.tasks.push(buildTask('Improve styling', 'I can\'t see', 27));

    this.state.tasks.push(buildTask('Finish the application', 'React is tricky', 45, getTodayPlusOffset(1)));
    this.state.tasks.push(buildTask('Finish the application', 'React is tricky', 45, getTodayPlusOffset(1)));
    this.state.tasks.push(buildTask('Finish the application', 'React is tricky', 45, getTodayPlusOffset(1)));
    this.state.tasks.push(buildTask('Finish the application', 'React is tricky', 45, getTodayPlusOffset(1)));

    // console.log(this.state.tasks);
  }

  buildDayList = (day, title) => {
    const targetDay = day.toLocaleDateString();
    const isToday = new Date().toLocaleDateString() === targetDay;

    // console.log('targetDay:', targetDay);
    // console.log('today:', new Date().toLocaleDateString());
    // console.log('isToday:', isToday);
    this.state.dayIdx++;
    return {
      title: title,
      day: day,
      isToday: isToday,
      data: this.state.tasks.filter((t) => new Date(t.date).toLocaleDateString() === targetDay)
        .map((task, taskIdx) => Object.assign({ key: `${this.state.dayIdx}.${taskIdx}`}, task))
    };
  }

  closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
      delete this.taskIdToActiveSwipeDirection[rowKey];
    }
  }

  deleteSectionRow = (rowMap, rowKey) => {
    this.closeRow(rowMap, rowKey);

    setTimeout(() => {
      var [section, row] = rowKey.split('.');
      const newData = [...this.state.sectionListData];
      const prevIndex = this.state.sectionListData[section].data.findIndex(item => item.key === rowKey);
      newData[section].data.splice(prevIndex, 1);
      this.setState({ sectionListData: newData });
    }, 250)
  }

  onRowOpen = (rowKey, rowMap, toValue) => {
    // console.log('This row opening', rowKey);
    this.closeRow(rowMap, rowKey);
  }

  onRowDidOpen = (rowKey, rowMap, toValue) => {
    // console.log('This row opened', rowKey);
    // console.log('val:', toValue);
    if (toValue < 0) {
      this.deleteSectionRow(rowMap, rowKey);
    } else {
      // Change background color of this row's percantage badge to show its complete
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
    // console.log('color?');
    // if (taskID === '2.3') {

    //   console.log('--------------------------------------------------------------')
    //   console.log('active swipe direction:', activeSwipeDirection);
    //   console.log('color:', activeSwipeDirection ? getSwipeDirectionColor(activeSwipeDirection) : getSwipeDirectionColor(side));
    // }
    return activeSwipeDirection ? getSwipeDirectionColor(activeSwipeDirection) : getSwipeDirectionColor(side);
  }

  handleInputBlur = (taskID, hours) => {
    if (this.state.isTimesheet) {
      this.props.addToTotalHoursLogged(taskID, hours);
    }

    this.setState({ activeTaskKey: `${Math.floor(Math.random() * 10000)}` });
  }

  handleTimeInputBadgePress = (key) => {
    this.setState({ activeTaskKey: key });
  }

  renderTaskItem = (data, rowMap) => {
    // console.log('data:', data.item);
    return <TouchableHighlight onPress={_ => console.log('You touched me')} style={styles.rowFront} underlayColor={'#AAA'}>
      <ListItem
        title={data.item.title}
        blocker={data.item.blocker}
        completionPercentage={data.item.completionPercentage}
        isTimesheet={this.state.isTimesheet}
        today={data.section.isToday}
        hoursLogged={data.item.hoursLogged}
        currHoursLoggedInputValue={this.props.hoursLogged}
        activeTaskKey={this.state.activeTaskKey}
        taskID={data.item.key}
        handleTimeInputBadgePress={this.handleTimeInputBadgePress}
        handleInputBlur={this.handleInputBlur}
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

  render() {
    return (
      <View style={styles.container}>
        <SwipeListView
          useSectionList
          sections={this.state.sectionListData}
          renderSectionHeader={({ section: { title, day, isToday } }) => (
            <DayHeader title={title} day={day} hidden={this.state.isTimesheet && !isToday} handleHeaderIconPress={this.handleHeaderIconPress} />
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
  //I can get this side aligned by changing alignItems to flex-start for left and flex-end for right, then playing with left and right props
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

async function storeData() {
  try {
    await AsyncStorage.setItem('tasks', '1 2 3 4 5')
  } catch (e) {
    console.error(e);
  }
}

async function getData() {
  try {
    const value = await AsyncStorage.getItem('tasks')
    if (value !== null) {
      // console.log('tasks:', value);
    }
  } catch (e) {
    console.error(e);
  }
}

function buildTask(title, blocker, completionPercentage, date, remindTime) {
  date = date || new Date();

  return {
    title: title,
    blocker: blocker,
    completionPercentage: completionPercentage,
    hoursLogged: 0,
    date: date.valueOf(),
    remindTime: remindTime
  };
}

function getTodayPlusOffset(offset = 0) {
  var day = new Date();
  day.setDate(day.getDate() + offset);

  return day;
}
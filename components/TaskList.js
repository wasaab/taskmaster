import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl, AsyncStorage } from 'react-native';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements'
import Swipeable from 'react-native-swipeable';
import SwipeableListItem from './SwipeableListItem'
import Colors from '../constants/Colors'
import DayHeader from './DayHeader'

export default class TaskList extends Component {

  constructor(props) {
    super(props);

    this.navigate = props.navigate;
    this.state = {
      dayCount: 0,
      taskCount: 0,
      tasks: [],
      hoursLogged: props.hoursLogged,
      pageRenderedIn: props.pageRenderedIn || 'TaskList',
      isTimesheet: props.pageRenderedIn === 'Timesheet',
      refreshing: false,
      currentlyOpenSwipeable: null,
      todayHeader: props.pageRenderedIn === 'Timesheet' ? 'Timesheet -' : 'Today,'
    };
    this.initTasks();
  }

  storeData = async () => {
    try {
      await AsyncStorage.setItem('tasks', '1 2 3 4 5')
    } catch (e) {
      console.error(e);
    }
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('tasks')
      if (value !== null) {
        // console.log('tasks:', value);
      }
    } catch (e) {
      console.error(e);
    }
  }

  _onRefresh = () => {
    this.navigate(this.state.pageRenderedIn === 'TaskList' ? 'Timesheet' : 'TaskList');
  }

  handleHeaderIconPress = () => {
    this.navigate(this.state.pageRenderedIn === 'TaskList' ? 'Timesheet' : 'TaskList');
  }

  handleScroll = () => {
    const { currentlyOpenSwipeable } = this.state;

    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter();
    }
  };

  //Todo: Changing default to flex seems to help allow header to be styled. default is invalid but nothing thrown
  determineDayDisplayStyle() {
    return { display: this.state.isTimesheet ? 'none' : 'flex' };
  }

  getTodayPlusOffset(offset = 0) {
    var day = new Date();
    day.setDate(day.getDate() + offset);

    return day;
  }

  buildTask(title, blocker, completionPercentage, date, remindTime) {
    date = date || new Date();

    return {
      title: title,
      blocker: blocker,
      completionPercentage: completionPercentage,
      date: date.valueOf(),
      remindTime: remindTime
    };
  }

  componentDidMount() {
    // this.storeData();

    // setTimeout(() => {
    //   this.getData();
    // }, 3000);
  }

  refreshControl() {
    return (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this._onRefresh} />
    )
  }

  initTasks = () => {
    this.state.tasks.push(this.buildTask('Finish the application', 'React is tricky', 45, this.getTodayPlusOffset(-1)));
    this.state.tasks.push(this.buildTask('Finish the application', 'React is tricky', 45, this.getTodayPlusOffset(-1)));
    this.state.tasks.push(this.buildTask('Finish the application', 'React is tricky', 45, this.getTodayPlusOffset(-1)));

    this.state.tasks.push(this.buildTask('Make a create task screen', 'Clarification needed', 40));
    this.state.tasks.push(this.buildTask('Improve the reminder screen', 'Need mockup from Collin', 70));
    this.state.tasks.push(this.buildTask('Make a timesheet screen', 'Clarification needed', 83));
    this.state.tasks.push(this.buildTask('Make the task title wrap', 'Lots of static padding', 0));
    this.state.tasks.push(this.buildTask('Improve styling', 'I can\'t see', 27));

    this.state.tasks.push(this.buildTask('Finish the application', 'React is tricky', 45, this.getTodayPlusOffset(1)));
    this.state.tasks.push(this.buildTask('Finish the application', 'React is tricky', 45, this.getTodayPlusOffset(1)));
    this.state.tasks.push(this.buildTask('Finish the application', 'React is tricky', 45, this.getTodayPlusOffset(1)));
    this.state.tasks.push(this.buildTask('Finish the application', 'React is tricky', 45, this.getTodayPlusOffset(1)));
  }

  buildDayList = (day, title, itemProps) => {
    const targetDay = day.toLocaleDateString();
    const isToday = new Date().toLocaleDateString() === targetDay;

    // console.log('targetDay:', targetDay);
    // console.log('today:', new Date().toLocaleDateString());
    // console.log('isToday:', isToday);
    return [
      <DayHeader key={`header${this.state.dayCount++}`} title={title} day={day} hidden={this.state.isTimesheet && !isToday} handleHeaderIconPress={this.handleHeaderIconPress} />,
      this.state.tasks.filter((t) => new Date(t.date).toLocaleDateString() === targetDay).map((task) =>
        <SwipeableListItem key={`task${this.state.taskCount++}`} {...task} {...itemProps} isTimesheet={this.state.isTimesheet} hoursLogged={this.state.hoursLogged} today={isToday} />
      )
    ];
  }

  getScrollViewProps = () => {
    return {
      onScroll: this.handleScroll,
      scrollEventThrottle: 5,
      style: styles.container,
      refreshControl:
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh} />
      ,
      stickyHeaderIndices: [0, 4, 10]
    }
  }

  render() {
    const { currentlyOpenSwipeable } = this.state;
    const itemProps = {
      onOpen: (event, gestureState, swipeable) => {
        console.log('open');
        if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
          currentlyOpenSwipeable.recenter();
        }

        this.setState({ currentlyOpenSwipeable: swipeable });
      },
      onClose: () => {
        console.log('closed');
        this.setState({ currentlyOpenSwipeable: null });
      },
      navigate: this.navigate
    };

    return (
      <ScrollView
        onScroll={this.handleScroll}
        scrollEventThrottle={5}
        style={styles.container}
        refreshControl={(
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh} />
        )}
        stickyHeaderIndices={[0, 4, 10]}
      >
        {this.buildDayList(this.getTodayPlusOffset(-1), "Yesterday,", itemProps)}
        {this.buildDayList(this.getTodayPlusOffset(0), this.state.todayHeader, itemProps)}
        {this.buildDayList(this.getTodayPlusOffset(1), "Tomorrow,", itemProps)}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  container: {
    flex: 1,
    // paddingBottom: 190,
    backgroundColor: Colors.darkBackground
  },
  chevron: {
    paddingTop: 4,
    paddingRight: 4,
    marginLeft: -6
  },
  dayHeader: {
    padding: 6,
    color: 'white',
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 24
  },
  dayHeaderContainer: {
    backgroundColor: Colors.headerRed,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  badgeContainer: {
    paddingTop: 8
  },
  badge: {
    flex: 0.2,
    borderRadius: 5,
    borderWidth: 1.5,
    backgroundColor: 'white',
    minWidth: 48,
    minHeight: 23
  },
  badgeText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800'
  }
});


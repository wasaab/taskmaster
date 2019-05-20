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
      pageRenderedIn: props.pageRenderedIn || 'TaskList',
      showTodayOnly: props.pageRenderedIn === 'Timesheet',
      refreshing: false,
      currentlyOpenSwipeable: null,
      todayHeader: props.pageRenderedIn === 'Timesheet' ? 'Timesheet -' : 'Today,'
    };
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
        console.log('tasks:', value);
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
    return { display: this.state.showTodayOnly ? 'none' : 'flex' };
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

  render() {
    const { currentlyOpenSwipeable } = this.state;
    const itemProps = {
      onOpen: (event, gestureState, swipeable) => {
        if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
          currentlyOpenSwipeable.recenter();
        }

        this.setState({ currentlyOpenSwipeable: swipeable });
      },
      onClose: () => this.setState({ currentlyOpenSwipeable: null }),
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
        stickyHeaderIndices={[0, 5, 11]}
      >
        <DayHeader title="Yesterday," dayOffset={-1} hidden={this.state.showTodayOnly} handleHeaderIconPress={this.handleHeaderIconPress} />
        <SwipeableListItem {...itemProps} hidden={this.state.showTodayOnly} />
        <SwipeableListItem {...itemProps} hidden={this.state.showTodayOnly} />
        <SwipeableListItem {...itemProps} hidden={this.state.showTodayOnly} />
        <SwipeableListItem {...itemProps} hidden={this.state.showTodayOnly} />
        <DayHeader title={this.state.todayHeader} dayOffset={0} handleHeaderIconPress={this.handleHeaderIconPress} />
        <SwipeableListItem {...itemProps} />
        <SwipeableListItem {...itemProps} />
        <SwipeableListItem {...itemProps} />
        <SwipeableListItem {...itemProps} />
        <SwipeableListItem {...itemProps} />
        <DayHeader title="Tomorrow," dayOffset={1} hidden={this.state.showTodayOnly} handleHeaderIconPress={this.handleHeaderIconPress}/>
        <SwipeableListItem {...itemProps} hidden={this.state.showTodayOnly} />
        <SwipeableListItem {...itemProps} hidden={this.state.showTodayOnly} />
        <SwipeableListItem {...itemProps} hidden={this.state.showTodayOnly} />
        <SwipeableListItem {...itemProps} hidden={this.state.showTodayOnly} />
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


import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl, AsyncStorage } from 'react-native';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements'
import Swipeable from 'react-native-swipeable';
import SwipeableListItem from './SwipeableListItem'
import Colors from '../constants/Colors'

export default class TaskList extends Component {

  constructor(props) {
    super(props);

    this.navigate = props.navigate;
    this.state = {
      pageRenderedIn: props.pageRenderedIn || 'TaskList',
      refreshing: false,
      currentlyOpenSwipeable: null,
      todayHeader: props.pageRenderedIn === 'Timesheet' ? 'Timesheet - Friday 17th' : 'Today, Friday 17th'
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
      if(value !== null) {
        console.log('tasks:', value);
      }
    } catch(e) {
      console.error(e);
    }
  }
W
  _onRefresh = () => {
    this.navigate(this.state.pageRenderedIn === 'TaskList' ? 'Timesheet' : 'TaskList');
  }

  handleScroll = () => {
    const {currentlyOpenSwipeable} = this.state;

    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter();
    }
  };

  determineDayDisplayStyle() {
    return { display: this.state.pageRenderedIn === 'TaskList' ? 'default' : 'none' };
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
      onRefresh={this._onRefresh}/>
    )
  }

  render() {
    const {currentlyOpenSwipeable} = this.state;
    const itemProps = {
      onOpen: (event, gestureState, swipeable) => {
        if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
          currentlyOpenSwipeable.recenter();
        }

        this.setState({currentlyOpenSwipeable: swipeable});
      },
      onClose: () => this.setState({currentlyOpenSwipeable: null}),
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
          onRefresh={this._onRefresh}/>
        )}
        // stickyHeaderIndices={[0]}
      >

        <View style={this.determineDayDisplayStyle()}>
          <Text style={styles.dayHeader}>Yesterday, Thursday 16th</Text>
          <SwipeableListItem {...itemProps}/>
          <SwipeableListItem {...itemProps}/>
          <SwipeableListItem {...itemProps}/>
          <SwipeableListItem {...itemProps}/>
        </View>
        <Text style={styles.dayHeader}>{this.state.todayHeader}</Text>
        <SwipeableListItem {...itemProps}/>
        <SwipeableListItem {...itemProps}/>
        <SwipeableListItem {...itemProps}/>
        <SwipeableListItem {...itemProps}/>
        <SwipeableListItem {...itemProps}/>
        <View style={this.determineDayDisplayStyle()}>
          <Text style={styles.dayHeader}>Tomorrow, Saturday 18th</Text>
          <SwipeableListItem {...itemProps}/>
          <SwipeableListItem {...itemProps}/>
          <SwipeableListItem {...itemProps}/>
          <SwipeableListItem {...itemProps}/>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingBottom: 190,
    backgroundColor: Colors.darkBackground
  },
  dayHeader: {
    padding: 6,
    color: 'white',
    backgroundColor: Colors.headerRed,
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 26
  }
});


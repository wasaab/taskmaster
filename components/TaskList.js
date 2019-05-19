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

  handleScroll = () => {
    const { currentlyOpenSwipeable } = this.state;

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
      // stickyHeaderIndices={[0]}
      >

        <View style={this.determineDayDisplayStyle()}>
          <View style={styles.dayHeaderContainer}>
            <Text style={styles.dayHeader}>Yesterday, Thurday 16th</Text>
            <View style={styles.flexRow}>
              <Badge
                value="TIME"
                status="primary"
                containerStyle={styles.badgeContainer}
                badgeStyle={[styles.badge, { borderColor: 'white' }]}
                textStyle={[styles.badgeText, { color: Colors.headerRed }]}
              />
              <Icon iconStyle={styles.chevron} name="chevron-right" type="materialicons" size={35} color="white" />
            </View>
          </View>
          <SwipeableListItem {...itemProps} />
          <SwipeableListItem {...itemProps} />
          <SwipeableListItem {...itemProps} />
          <SwipeableListItem {...itemProps} />
        </View>
        <View style={styles.dayHeaderContainer}>
          <Text style={styles.dayHeader}>{this.state.todayHeader}</Text>
          <View style={styles.flexRow}>
            <Badge
              value="TIME"
              status="primary"
              containerStyle={styles.badgeContainer}
              badgeStyle={[styles.badge, { borderColor: 'white' }]}
              textStyle={[styles.badgeText, { color: Colors.headerRed }]}
            />
            <Icon iconStyle={styles.chevron} name="chevron-right" type="materialicons" size={35} color="white" />
          </View>
        </View>
        <SwipeableListItem {...itemProps} />
        <SwipeableListItem {...itemProps} />
        <SwipeableListItem {...itemProps} />
        <SwipeableListItem {...itemProps} />
        <SwipeableListItem {...itemProps} />
        <View style={this.determineDayDisplayStyle()}>
          <View style={styles.dayHeaderContainer}>
            <Text style={styles.dayHeader}>Tomorrow, Saturday 18th</Text>
            <View style={styles.flexRow}>
              <Badge
                value="TIME"
                status="primary"
                containerStyle={styles.badgeContainer}
                badgeStyle={[styles.badge, { borderColor: 'white' }]}
                textStyle={[styles.badgeText, { color: Colors.headerRed }]}
              />
              <Icon iconStyle={styles.chevron} name="chevron-right" type="materialicons" size={35} color="white" />
            </View>
          </View>
          <SwipeableListItem {...itemProps} />
          <SwipeableListItem {...itemProps} />
          <SwipeableListItem {...itemProps} />
          <SwipeableListItem {...itemProps} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
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


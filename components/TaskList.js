import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements'
import Swipeable from 'react-native-swipeable';
import SwipeableListItem from './SwipeableListItem'
import Colors from '../constants/Colors'

export default class TaskList extends Component {

  constructor(props) {
    console.log('props:', props);
    super(props);
    this.navigate = props.navigate;
    this.state = {
      refreshing: false,
      currentlyOpenSwipeable: null,
      header: 'Today, May 17th'
    };
  }

  _onRefresh = () => {
    this.navigate('Home');
  }

  handleScroll = () => {
    const {currentlyOpenSwipeable} = this.state;

    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter();
    }
  };

  render() {
    const {currentlyOpenSwipeable} = this.state;
    const itemProps = {
      onOpen: (event, gestureState, swipeable) => {
        if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
          currentlyOpenSwipeable.recenter();
        }

        this.setState({currentlyOpenSwipeable: swipeable});
      },
      onClose: () => this.setState({currentlyOpenSwipeable: null})
    };

    return (
      <ScrollView
        onScroll={this.handleScroll}
        scrollEventThrottle={5}
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        // stickyHeaderIndices={[0]}
      >
        <Text style={styles.dayHeader}>{this.state.header}</Text>
        <SwipeableListItem {...itemProps}/>
        <SwipeableListItem {...itemProps}/>
        <SwipeableListItem {...itemProps}/>
        <SwipeableListItem {...itemProps}/>
        <SwipeableListItem {...itemProps}/>
        <Text style={styles.dayHeader}>Tomorrow, May 15th</Text>
        <SwipeableListItem {...itemProps}/>
        <SwipeableListItem {...itemProps}/>
        <SwipeableListItem {...itemProps}/>
        <SwipeableListItem {...itemProps}/>
        <SwipeableListItem {...itemProps}/>
        <SwipeableListItem {...itemProps}/>
        <SwipeableListItem {...itemProps}/>
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
    padding: 10,
    color: 'white',
    backgroundColor: 'red',
    fontWeight: '900',
    fontSize: 18
  }
});


import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge, Icon, withBadge } from 'react-native-elements'
import Colors from '../constants/Colors'
import TaskManager from '../components/TaskManager';

export default class DayHeader extends Component {
  constructor(props) {
    super(props);

    this.taskManager = new TaskManager();
    this.handleHeaderIconPress= props.handleHeaderIconPress,
    this.state = {
      noDate: props.noDate,
      hidden: props.hidden,
      touchableAreaFlex: !props.isTimesheet ? 0.2 : 0.23
    };
  }

  determineTitle() {
    if (this.props.noDate) {
      return this.props.title;
    } else if (this.props.day === new Date().toLocaleDateString()) {
      return this.props.isTimesheet ? 'Timesheet -' : 'Today,';
    } else if (this.props.day === this.taskManager.getTodayPlusOffset(-1).toLocaleDateString()) {
      return 'Yesterday,';
    } else if (this.props.day === this.taskManager.getTodayPlusOffset(1).toLocaleDateString()) {
      return 'Tomorrow,';
    }
  }

  determineDayDisplayStyle() {
    return { display: this.state.hidden ? 'none' : 'flex' };
  }

  determineDate = () => {
    if (this.state.noDate) { return; }

    const dateTokens = new Date(this.props.day)
      .toLocaleString([], { weekday: 'long', day:'numeric' })
      .split(' ');

    return `${dateTokens[1]} ${getOrdinalNum(dateTokens[0])}`;
  }

  isToday() {
    return new Date(this.props.day).toLocaleDateString() === new Date().toLocaleDateString();
  }

  determineHeaderTextColor = () => {
    return this.props.noDate || this.isToday() ? Colors.WHITE : 'rgba(255, 255, 255, 0.7)';
  }

  render() {
    return (
      <View style={[styles.dayHeaderContainer, this.determineDayDisplayStyle()]}>
        <View style={styles.flexRow}>
          <Text
            style={[
              styles.dayHeader,
              { flex: 1 - this.state.touchableAreaFlex },
              { color: this.determineHeaderTextColor()}
            ]}>
            {this.determineTitle()} {this.determineDate()}
          </Text>
          <TouchableOpacity
            style={{display: 'flex', flexDirection: 'row', flex: this.state.touchableAreaFlex }}
            onPress={this.handleHeaderIconPress}
          >
            <Badge
              value={this.props.badgeText}
              status="primary"
              containerStyle={styles.badgeContainer}
              badgeStyle={[styles.badge, { borderColor: Colors.WHITE }]}
              textStyle={[styles.badgeText, { color: Colors.headerRed }]}
            />
            <Icon iconStyle={styles.chevron} name="chevron-right" type="materialicons" size={35} color={Colors.WHITE} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
}

function isThSuffix(num) {
  return (num > 3 && num < 21) || num % 10 > 3;
}

function determineSuffix(num) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const suffixIdx = isThSuffix(num) ? 0 : num % 10;

  return suffixes[suffixIdx];
}

function getOrdinalNum(num) {
  if (num <= 0) { return num; }

  return num + determineSuffix(num);
}

const styles = StyleSheet.create({
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: Colors.darkBackground
  },
  chevron: {
    paddingTop: 4,
    paddingRight: 4,
    marginLeft: -8
  },
  dayHeader: {
    padding: 6,
    paddingRight: 0,
    color: Colors.WHITE,
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 21
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
    backgroundColor: Colors.WHITE,
    minWidth: 48,
    minHeight: 23
  },
  badgeText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800'
  }
});
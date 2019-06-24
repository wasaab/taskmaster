import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge, Icon, withBadge } from 'react-native-elements'
import Colors from '../constants/Colors'

export default class DayHeader extends Component {
  constructor(props) {
    super(props);

    this.handleHeaderIconPress= props.handleHeaderIconPress,
    this.state = {
      noDate: props.noDate,
      hidden: props.hidden,
      touchableAreaFlex: !props.isTimesheet ? 0.2 : 0.23,
      badgeText: !props.isTimesheet ? 'TIME' : 'TASKS'
    };
  }

  determineTitle() {
    if (this.props.noDate) {
      return this.props.title;
    } else if (this.props.day === new Date().toLocaleDateString()) {
      return this.props.isTimesheet ? 'Timesheet -' : 'Today,';
    } else if (this.props.day === getTodayPlusOffset(-1).toLocaleDateString()) {
      return 'Yesterday,';
    } else if (this.props.day === getTodayPlusOffset(1).toLocaleDateString()) {
      return 'Tomorrow,';
    }
  }

  determineDayDisplayStyle() {
    return { display: this.state.hidden ? 'none' : 'flex' };
  }

  getOrdinalNum(n) {
    return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
  }

  determineDate = () => {
    if (this.state.noDate) { return; }

    const dateTokens = new Date(this.props.day).toLocaleString([], {weekday: 'long', day:'numeric'}).split(' ');

    return `${dateTokens[1]} ${this.getOrdinalNum(dateTokens[0])}`;
  }

  determineHeaderTextColor = () => {
    return this.props.noDate || new Date(this.props.day).toLocaleDateString() === new Date().toLocaleDateString() ? 'white' : 'rgba(255, 255, 255, 0.7)';
  }

  render() {
    return (
      <View style={[styles.dayHeaderContainer, this.determineDayDisplayStyle()]}>
        <View style={styles.flexRow}>
          <Text style={[styles.dayHeader, { flex: 1 - this.state.touchableAreaFlex }, { color: this.determineHeaderTextColor()}]}>{this.determineTitle()} {this.determineDate()}</Text>
          <TouchableOpacity style={{display: 'flex', flexDirection: 'row', flex: this.state.touchableAreaFlex }} onPress={this.handleHeaderIconPress}>
            <Badge
              value={this.state.badgeText}
              status="primary"
              containerStyle={styles.badgeContainer}
              badgeStyle={[styles.badge, { borderColor: 'white' }]}
              textStyle={[styles.badgeText, { color: Colors.headerRed }]}
            />
            <Icon iconStyle={styles.chevron} name="chevron-right" type="materialicons" size={35} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
}

function getTodayPlusOffset(offset = 0) {
  var day = new Date();
  day.setDate(day.getDate() + offset);

  return day;
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
    color: 'white',
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
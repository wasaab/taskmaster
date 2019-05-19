import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge, Icon, withBadge } from 'react-native-elements'
import Colors from '../constants/Colors'

export default class DayHeader extends Component {
  constructor(props) {
    super(props);

    this.navigate = props.navigate;
    this.state = {
      title: props.title,
      dayOffset: props.dayOffset,
      hidden: props.hidden
    };
  }

  determineDayDisplayStyle() {
    return { display: this.state.hidden ? 'none' : 'flex' };
  }

  getOrdinalNum(n) {
    return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
  }

  determineDate() {
    var day = new Date();
    day.setDate(day.getDate() + this.state.dayOffset);
    var dateTokens = day.toLocaleString([], {weekday: 'long', day:'numeric'}).split(' ');

    return `${dateTokens[1]} ${this.getOrdinalNum(dateTokens[0])}`;
  }

  render() {
    return (
      <View style={[styles.dayHeaderContainer, this.determineDayDisplayStyle()]}>
        <View style={styles.flexRow}>
          <Text style={styles.dayHeader}>{this.state.title} {this.determineDate()}</Text>
          <TouchableOpacity style={{display: 'flex', flexDirection: 'row', flex: 0.2 }}>
            <Badge
              value="TIME"
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

const styles = StyleSheet.create({
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1
  },
  container: {
    flex: 1,
    // paddingBottom: 190,
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
    fontSize: 22,
    flex: 0.80
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
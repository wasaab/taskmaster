import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Badge, Icon } from 'react-native-elements'
import Colors from '../constants/Colors'

export default class ListItem extends Component {
    constructor(props) {
        super(props);

        // this.handleRemindTimeChange = this.handleRemindTimeChange.bind(this);
        this.navigate = props.navigate;
        this.state = {
            hoursLogged: props.hoursLogged,
            activeTask: false,
            reminder: props.reminder,
            height: props.reminder ? 80 : 62,
            badgeValue: props.isTimesheet ? '+' : `${Math.floor(Math.random() * 100)}%`,
            completionColor: 'gray'
        };
    }

    determineCompletionColor() {
        if (this.props.isTimesheet) { return this.state.activeTask ? 'black' : 'white'; }

        const percentage = this.state.badgeValue.slice(0, -1);

        if (percentage > 75) {
            return Colors.statusGreen;
        } else if (percentage > 50) {
            return Colors.statusYellow;
        } else if (percentage > 25) {
            return Colors.statusOrange;
        }

        return Colors.statusRed;
    }

    handleTimeInputBadgePress = () => {
        this.setState({ activeTask: true, badgeValue: this.props.hoursLogged });
    }

    handleTimeInputBadgeBlur = () => {
        this.setState({ activeTask: false });
    }

    render() {
        this.state.completionColor =  this.determineCompletionColor();

        return (
            <View style={[styles.listItem, { backgroundColor: Colors.darkBackground }, { height: this.state.height }]}>
                <View style={styles.iconContainer}>
                    <Badge
                        onBlur={this.handleTimeInputBadgeBlur}
                        onPress={this.handleTimeInputBadgePress}
                        value={this.state.badgeValue}
                        status="primary"
                        containerStyle={styles.badgeContainer}
                        badgeStyle={[
                            styles.badge,
                            {
                                borderColor: this.state.completionColor,
                                backgroundColor: this.props.isTimesheet && this.state.activeTask ? 'white' : Colors.darkBackground
                            }
                        ]}
                        textStyle={[styles.badgeText, { color: this.state.completionColor }]}
                    />
                    <Icon iconStyle={[styles.timeIcon, { display: this.state.reminder ? 'flex' : 'none' }]} name='clockcircleo' type="antdesign"/>
                </View>
                <View style={styles.listItemTextContainer}>
                    <Text style={[styles.taskTitle]}>Make a create task screen</Text>
                    <Text style={[styles.blocker]}>React is tricky</Text>
                </View>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    iconContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
    },
    timeIcon: {
        color: 'dodgerblue',
        paddingBottom: 10
    },
    listItem: {
        minHeight: 62,
        paddingTop: 10,
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: Colors.transparentGrayBorder
    },
    taskTitle: {
        color: 'white',
        flex: 0.8,
        flexWrap: 'wrap',
        width: '100%',
        height: 70,
        // flexGrow: 1,
        fontFamily: 'System',
        fontWeight: '700',
        fontSize: 20,
        // paddingTop: 5
    },
    badgeContainer: {
        paddingTop: 2,
        paddingRight: 3
    },
    badge: {
        flex: 0.2,
        borderRadius: 5,
        borderWidth: 1.5,
        backgroundColor: Colors.darkBackground,
        minWidth: 48,
        minHeight: 23
    },
    badgeText: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '800'
    },
    blocker: {
        color: 'rgba(255,59,48, 0.8)',
        fontFamily: 'System',
        fontWeight: '600'
    },
    listItemTextContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
        flexWrap: 'wrap',
        flex: 0.9
    }
});
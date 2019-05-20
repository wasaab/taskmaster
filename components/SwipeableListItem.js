import React, { Component } from 'react';
import {StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-swipeable';
import { Icon } from 'react-native-elements'
import ListItem from './ListItem'
import Colors from '../constants/Colors';

export default class SwipeableListItem extends ListItem {

    constructor(props) {
        super(props);

        this.navigate = props.navigate;
        this.state = {
            hoursLogged: props.hoursLogged,
            reminderIconColor: 'rgb(76, 145, 221)',
            cancelIconColor: Colors.statusRed,
            completedIconColor: Colors.statusGreen
        };
    }

    handleReminderPress = () => {
        this.handleIconPress('reminder', 'rgb(76, 145, 221)', 'rgba(76, 145, 221, 0.3)');
    }

    handleCancelPress = () => {
        this.handleIconPress('cancel', Colors.statusRed, 'rgba(255, 59, 48, 0.3)');
    }

    handleCompletedPress = () => {
        this.handleIconPress('completed', Colors.statusGreen, 'rgba(0, 210, 64, 0.3)');
    }

    handleIconPress(icon, unpressedColor, pressedColor) {
        this.state[`${icon}IconColor`] = pressedColor;

        setTimeout(() => {
            this.state[`${icon}IconColor`] = unpressedColor;

            if (icon === 'reminder') {
                this.navigate('Reminder');
            }
        }, 70);
    }

    leftSwipeButtons() {
        return [
            <TouchableOpacity style={styles.leftSwipeItem} onPress={this.handleReminderPress}>
                <Icon size={28} color={this.state.reminderIconColor} name="schedule" type="materialicons"/>
            </TouchableOpacity>,
            <TouchableOpacity style={styles.leftSwipeItem} onPress={this.handleCancelPress}>
                <Icon size={28}color={this.state.cancelIconColor} name="not-interested" type="materialicons"/>
            </TouchableOpacity>,
            <TouchableOpacity style={styles.leftSwipeItem} onPress={this.handleCompletedPress}>
                <Icon size={28} color={this.state.completedIconColor} name="check-circle" type="materialicons"/>
            </TouchableOpacity>
        ];
    }

    rightSwipeDeleteAction() {
        return (
            <TouchableOpacity style={[styles.rightSwipeItem, { backgroundColor: Colors.headerRed }]}>
                <Icon size={28} color='white' name="delete" type="materialicons"/>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <Swipeable
                style={{ display: this.props.isTimesheet && !this.props.today ? 'none' : 'flex'}}
                leftButtonWidth={45}
                leftButtons={this.leftSwipeButtons()}
                rightContent={this.rightSwipeDeleteAction()}
                onLeftButtonsOpenRelease={this.props.onOpen}
                onLeftButtonsCloseRelease={this.props.onClose}
            >
                <ListItem isTimesheet={this.props.isTimesheet} hoursLogged={this.props.hoursLogged} />
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({
    leftSwipeItem: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 7,
        backgroundColor: Colors.darkSecondary
    },
    rightSwipeItem: {
        flex: 1,
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'flex-start',
        paddingLeft: 20
    }
});
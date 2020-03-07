import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, Platform, TouchableWithoutFeedback, TouchableHighlight } from 'react-native';
import { Badge, Icon } from 'react-native-elements';
import * as Haptic from 'expo-haptics';
import Colors from '../constants/Colors';

export default class ListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            editable: props.title === '',
            title: props.title,
            blocker: props.blocker,
            completionPercentage: props.completionPercentage,
            hoursLogged: props.hoursLogged,
            height: props.reminder ? 80 : 62,
            badgeValue: props.isTimesheet ? '+' : `${props.completionPercentage}%`,
            completionColor: 'gray'
        };
    }

    determineCompletionColor() {
        if (this.props.isTimesheet) { return this.isActiveTask() ? 'black' : 'white'; }

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

    isActiveTask = () => {
        return this.props.activeTaskKey === this.props.taskID; // Todo: || this.state.completionPercentage === '' ??? needs update for reminder screen
    }

    shouldShowInput = () => {
        return this.isActiveTask() || this.props.isTimesheet && Number(this.state.hoursLogged) > 0;
    }

    handleLongPress = () => {
        const taskProps = {
            taskID: this.props.taskID,
            handleTimeInputBadgePress: this.props.handleTimeInputBadgePress,
            handleBadgeInputBlur: this.props.handleBadgeInputBlur,
            handleTitleOrBlockerInputBlur: this.props.handleTitleOrBlockerInputBlur,
            title: this.state.title,
            blocker: this.state.blocker,
            completionPercentage: this.state.completionPercentage,
            hoursLogged: this.state.hoursLogged,
            reminder: true
        }

        this.props.navigation.navigate('Reminder', { taskProps: taskProps });
    }

    handleTitleOrBlockerPress = () => {
        Haptic.impactAsync('heavy');
        this.setState({ editing: true });
    }

    handleInputBadgePress = () => {
        Haptic.impactAsync('heavy');

        if (this.props.isTimesheet) {
            this.setState({ hoursLogged: '' });
        } else {
            this.setState({ completionPercentage: '', editing: true });
        }

        this.props.handleTimeInputBadgePress(this.props.taskID);
    }

    handleBadgeInputBlur = () => {
        var newBadgeValue = this.determineNewBadgeValue();

        this.props.handleBadgeInputBlur(this.props.taskID, this.state.hoursLogged, this.state.completionPercentage);
        this.setState({ activeTask: false, badgeValue: newBadgeValue });
        this.updateEditState();
    }

    handleTitleOrBlockerInputBlur = () => {
        this.updateEditState();
        this.props.handleTitleOrBlockerInputBlur(this.props.taskID, this.state.title, this.state.blocker);
    }

    handleTitleInputChange = (newValue) => {
        this.setState({ title: newValue });
    }

    handleBlockerInputChange = (newValue) => {
        this.setState({ blocker: newValue });
    }

    handleBadgeInputChange = (newValue) => {
        if (this.props.isTimesheet) {
            this.setState({ hoursLogged: newValue });
        } else {
            if (newValue > 100) {
                newValue = 100;
            }

            this.setState({ completionPercentage: newValue });
        }
    }

    handleTitleSubmit = () => {
        if (!this.blockerRef) { return; }

        this.blockerRef.focus();
    }

    handleTouchContainerPress = () => {
        this.setState({ editable: true });

        setTimeout(() => {
            if (this.state.editing) { return; }

            this.setState({ editable: false });
        }, 700);
    }

    componentDidUpdate = () => {
        if (!this.isActiveTask() || !this.badgeInputRef) { return; }

        this.badgeInputRef.focus();
    }

    determineInputValue = () => {
        //If newly created task
        if (this.props.title === '' && this.state.hoursLogged === 0 && this.state.completionPercentage === 0) {
             return '';
        }

        return this.props.isTimesheet ? `${this.state.hoursLogged}` : `${this.state.completionPercentage}`;
    }

    updateEditState() {
        this.setState({ editing: false });
        setTimeout(() => {
            if (this.state.editing) {
                this.setState({ editing: false });
            } else {
                this.setState({ editable: false });
            }
        }, 300);
    }

    determineNewBadgeValue() {
        if (!this.props.isTimesheet) {
            if (this.state.completionPercentage === '') {
                this.state.completionPercentage = this.props.completionPercentage;
            }

            return `${this.state.completionPercentage}%`;
        }

        if (this.state.hoursLogged === '') {
            this.state.hoursLogged = this.props.hoursLogged;
        }

        return '+';
    }

    determineBadgeTextColor() {
        return !this.props.isTimesheet && this.props.isComplete ?
            Colors.darkBackground : this.state.completionColor;
    }

    determineBadgeBackgroundColor = () => {
        if (this.props.isTimesheet && this.isActiveTask()) {
            return white;
        } else if (!this.props.isTimesheet && this.props.isComplete) {
            return this.state.completionColor;
        }

        return Colors.darkBackground;
    }

    getBadgeInput = () => {
        return (
            <View style={styles.iconContainer}>
                {!this.shouldShowInput() &&
                <Badge
                    onPress={this.handleInputBadgePress}
                    value={this.state.badgeValue}
                    status="primary"
                    containerStyle={styles.badgeContainer}
                    badgeStyle={[
                        styles.badge,
                        {
                            borderColor: this.state.completionColor,
                            backgroundColor: this.determineBadgeBackgroundColor()
                        }
                    ]}
                    textStyle={[styles.badgeText, { color: this.determineBadgeTextColor() }]}
                />}
                {this.shouldShowInput() &&
                <TextInput
                    onFocus={this.handleInputBadgePress}
                    onBlur={this.handleBadgeInputBlur}
                    ref={(ref) => {
                        this.badgeInputRef = ref;
                    }}
                    style={[styles.hoursLoggedInput]}
                    onChangeText={this.handleBadgeInputChange}
                    value={this.determineInputValue()}
                    keyboardType={this.props.isTimesheet ? 'numeric' : 'number-pad'}
                    clearTextOnFocus={true}
                    autofocus={true}
                    placeholder={this.props.isTimesheet ? `${this.props.hoursLogged}` : `${this.props.completionPercentage}`}
                    keyboardAppearance="dark"
                    maxLength={4}
                />}
                {this.props.reminder && <Icon iconStyle={[styles.timeIcon, { display: 'flex' }]} name='clockcircleo' type="antdesign"/>}
            </View>
        );
    }

    render() {
        if (this.props.isTimesheet && !this.props.today) { return null; }

        this.state.completionColor = this.determineCompletionColor();

        return (
            <TouchableHighlight onPress={this.handleTouchContainerPress} underlayColor='rgb(60, 60, 60)' onLongPress={this.handleLongPress}>
                <View style={[styles.listItem, {
                    backgroundColor: Colors.darkBackground,
                    height: this.state.height,
                    display: 'flex'
                }]}>
                    {this.getBadgeInput()}
                    <View style={styles.listItemTextContainer}>
                        <TextInput
                            // multiline
                            // numberOfLines={2}
                            onFocus={this.handleTitleOrBlockerPress}
                            editable={this.state.editable}
                            pointerEvents={this.state.editable ? 'auto' : 'none'}
                            style={[styles.taskTitle]}
                            onSubmitEditing={this.handleTitleSubmit}
                            onChangeText={this.handleTitleInputChange}
                            onBlur={this.handleTitleOrBlockerInputBlur}>
                            {this.state.title}
                        </TextInput>
                        <TextInput
                            ref={(ref) => {
                                this.blockerRef = ref;
                            }}
                            onFocus={this.handleTitleOrBlockerPress}
                            editable={this.state.editable}
                            pointerEvents={this.state.editable ? 'auto' : 'none'}
                            style={[styles.blocker]}
                            onChangeText={this.handleBlockerInputChange}
                            onBlur={this.handleTitleOrBlockerInputBlur}>
                            {this.state.blocker}
                        </TextInput>
                    </View>
                </View>
            </TouchableHighlight>
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
        fontFamily: 'System',
        fontWeight: '700',
        fontSize: 20,
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
    },
    hoursLoggedInput: {
        marginTop: 2,
        marginRight: 3,
        backgroundColor: 'white',
        color: 'black',
        borderColor: 'white',
        flex: 0.2,
        borderRadius: 5,
        borderWidth: 1.5,
        minWidth: 48,
        minHeight: 15,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '800',
    }
});
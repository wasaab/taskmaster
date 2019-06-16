import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { Badge, Icon } from 'react-native-elements'
import Colors from '../constants/Colors'

export default class ListItem extends Component {
    constructor(props) {
        super(props);

        // this.handleRemindTimeChange = this.handleRemindTimeChange.bind(this);
        // console.log('item props:', props);
        this.navigate = props.navigate;
        this.state = {
            title: props.title,
            blocker: props.blocker,
            completionPercentage: props.completionPercentage,
            hoursLogged: props.hoursLogged,
            activeTask: props.activeTaskKey === props.taskID,
            reminder: props.reminder,
            height: props.reminder ? 80 : 62,
            badgeValue: props.activeTaskKey === props.taskID ? `${props.currHoursLoggedInputValue}` : props.isTimesheet ? '+' : `${props.completionPercentage}%`,
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

    isActiveTask = () => {
        return this.props.activeTaskKey === this.props.taskID;
    }

    shouldShowInput = () => {
        return this.isActiveTask() || this.props.isTimesheet && Number(this.state.hoursLogged) > 0;
    }

    handleInputBadgePress = () => {
        if (this.props.isTimesheet) {
            this.setState({ hoursLogged: '' });
        } else {
            this.setState({ completionPercentage: '' });
        }

        this.props.handleTimeInputBadgePress(this.props.taskID);
    }

    handleBadgeInputBlur = () => {
        var newBadgeValue = this.determineNewBadgeValue();

        this.props.handleBadgeInputBlur(this.props.taskID, this.state.hoursLogged, this.state.completionPercentage);
        this.setState({ activeTask: false, badgeValue: newBadgeValue });
    }

    handleBadgeInputChange = (newValue) => {
        if (this.props.isTimesheet) {
            this.setState({ hoursLogged: newValue });
        } else {
            this.setState({ completionPercentage: newValue });
        }
    }

    handleTitleOrBlockerInputBlur = () => {
        this.props.handleTitleOrBlockerInputBlur(this.props.taskID, this.state.title, this.state.blocker);
    }

    handleTitleInputChange = (newValue) => {
        this.setState({ title: newValue });
    }

    handleBlockerInputChange = (newValue) => {
        this.setState({ blocker: newValue });
    }

    componentDidUpdate = () => {
        if (!this.isActiveTask() || !this.ref) { return; }

        this.ref.focus();
    }

    determineInputValue = () => {
        return this.props.isTimesheet ? this.state.hoursLogged : this.state.completionPercentage;
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
        if (this.props.isTimesheet && this.state.activeTask) {
            return white;
        } else if (!this.props.isTimesheet && this.props.isComplete) {
            return this.state.completionColor;
        }

        return Colors.darkBackground;
    }

    render() {
        this.state.completionColor =  this.determineCompletionColor();

        return (
            <View style={[styles.listItem, {
                backgroundColor: Colors.darkBackground,
                height: this.state.height,
                display: this.props.isTimesheet && !this.props.today ? 'none' : 'flex'
            }]}>
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
                    />
                    }
                  {this.shouldShowInput()  &&
                    <TextInput
                        onFocus={this.handleInputBadgePress}
                        onBlur={this.handleBadgeInputBlur}
                        ref={ref => {
                            this.ref = ref
                        }}
                        style={[styles.hoursLoggedInput]}
                        onChangeText={this.handleBadgeInputChange}
                        value={this.determineInputValue()}
                        keyboardType="numeric"
                        clearTextOnFocus={true}
                        autofocus={true}
                        placeholder="0.00"
                        keyboardAppearance="dark"
                        maxLength={5}
                     />
                    }
                    <Icon iconStyle={[styles.timeIcon, { display: this.state.reminder ? 'flex' : 'none' }]} name='clockcircleo' type="antdesign"/>
                </View>
                <View style={styles.listItemTextContainer}>
                    <TextInput
                        style={[styles.taskTitle]}
                        onChangeText={this.handleTitleInputChange}
                        onBlur={this.handleTitleOrBlockerInputBlur}>
                        {this.state.title}
                    </TextInput>
                    <TextInput
                        style={[styles.blocker]}
                        onChangeText={this.handleBlockerInputChange}
                        onBlur={this.handleTitleOrBlockerInputBlur}>
                        {this.state.blocker}
                    </TextInput>
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
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
            hoursLogged: props.hoursLogged === 0 ? '' : `${props.hoursLogged}`,
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

    shouldShowHoursInput = () => {
        return this.isActiveTask() || Number(this.state.hoursLogged) > 0;
    }

    handleTimeInputBadgePress = () => {
        this.setState({ hoursLogged: '' });
        this.props.handleTimeInputBadgePress(this.props.taskID);
        // console.log('press');

        // this.setState({ activeTask: true, badgeValue: this.props.currHoursLoggedInputValue });
    }

    handleHoursInputBlur = () => {
        // console.log('blur');
        this.props.addToTotalHoursLogged(this.props.taskID, this.state.hoursLogged);
        this.setState({ activeTask: false, active: false });
    }

    handleHoursLoggedInputChange = (hours) => {
        this.setState({ hoursLogged: hours });
    }

    componentDidUpdate = () => {
        // console.log('updated');
        if (!this.isActiveTask() || !this.ref) { return; }

        this.ref.focus();
    }

    render() {
        this.state.completionColor =  this.determineCompletionColor();

        if (this.props.taskID === '1.4') {
            // console.log('props:', this.props);
            // console.log('this.state.hoursLogged:', this.state.hoursLogged);
        }

        return (
            <View style={[styles.listItem, { backgroundColor: Colors.darkBackground, height: this.state.height, display: this.props.isTimesheet && !this.props.today ? 'none' : 'flex'}]}>
                <View style={styles.iconContainer}>
                    {!this.shouldShowHoursInput() &&
                    <Badge
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
                    }
                  {this.shouldShowHoursInput()  &&
                    <TextInput
                        // onEndEditing={() => { console.log('triggered just before blur'); }}
                        onFocus={this.handleTimeInputBadgePress}
                        onBlur={this.handleHoursInputBlur}
                        ref={ref => {
                            this.ref = ref
                        }}
                        style={[styles.hoursLoggedInput]}
                        // onBlur={this.handleHoursLoggedInputFocusLost}
                        onChangeText={this.handleHoursLoggedInputChange}
                        value={this.state.hoursLogged}
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
                    <Text style={[styles.taskTitle]}>{this.props.title}</Text>
                    <Text style={[styles.blocker]}>{this.props.blocker}</Text>
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
        // marginTop: 3,
        // marginBottom: 10,
        // marginRight: 14,
        // marginLeft: 11
    }
});
import React, { Component } from 'react';
import { StyleSheet, Text, View, DatePickerIOS, Switch, Picker } from 'react-native';
import RNCalendarReminders from 'react-native-calendar-reminders';
import Colors from '../constants/Colors'

export default class Reminder extends Component {
    constructor(props) {
        super(props);

        // this.handleRemindTimeChange = this.handleRemindTimeChange.bind(this);
        this.navigate = props.navigate;
        this.state = {
            reminderEnabled: false,
            pageRenderedIn: props.pageRenderedIn || 'TaskList',
            refreshing: false,
            remindTime: new Date(),
            repeatPeriod: 'Never'
        };
    }

    createReminder() {
        RNCalendarReminders.saveReminder('title', {
            location: 'location',
            notes: 'notes',
            startDate: '2016-10-01T09:45:00.000UTC',
            recurrence: ''
        })
            .then(id => {
                console.log('Reminder saved with ID:', id);
            })
            .catch(error => {
                console.error('Reminder failed to save:', error);
            });
    }

    handleRemindTimeChange = (newTime) => {
        this.setState({ remindTime: newTime });
    }

    handleReminderToggled = (isEnabled) => {
        this.setState({ reminderEnabled: isEnabled });
    }

    formatRemindTime = () => {
        return this.state.remindTime.toLocaleString([], {
            weekday: 'short', month: 'numeric', day: 'numeric', year: '2-digit', hour: '2-digit', minute: '2-digit'
        }).replace(',', '')
    }

    handleRepeatPeriodChange = (newPeriod) => {
        this.setState({ repeatPeriod: newPeriod });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.rowFlexContainer}>
                    <Text style={[styles.leftContent, styles.remindMsg, styles.text]}>Remind me on a day</Text>
                    <Switch
                        style={styles.remindToggle}
                        onValueChange={this.handleReminderToggled}
                        value={this.state.reminderEnabled}
                    />
                </View>
                <View style={styles.rowFlexContainer}>
                    <Text style={[styles.leftContent, styles.alertMsg, styles.text]}>Alert</Text>
                    <Text style={[styles.remindTimeText, styles.text]}>{this.formatRemindTime()}</Text>
                </View>
                <DatePickerIOS
                    style={styles.remindTimePicker}
                    date={this.state.remindTime}
                    onDateChange={this.handleRemindTimeChange}
                />
                <View style={styles.rowFlexContainer}>
                    <Text style={[styles.leftContent, styles.remindMsg, styles.text]}>Repeat</Text>
                    <Text style={[styles.text, styles.remindToggle]}>{this.state.repeatPeriod}</Text>
                </View>
                {/* todo: use a picker solution from here: https://stackoverflow.com/questions/41181683/react-native-ios-picker-is-always-open */}
                <Picker style={{ flex: 0.8 }} selectedValue={this.state.repeatPeriod} onValueChange={this.handleRepeatPeriodChange}>
                    <Picker.Item label="Never" value="Never" />
                    <Picker.Item label="Daily" value="Daily" />
                    <Picker.Item label="Weekly" value="Weekly" />
                    <Picker.Item label="Monthly" value="Monthly" />
                    <Picker.Item label="Yearly" value="Yearly" />
                </Picker>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgb(60,60,60)'
    },
    remindTimePicker: {

    },
    remindTimeText: {
        flex: 0.55,
    },
    rowFlexContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    remindToggle: {
        flex: 0.2
    },
    remindMsg: {
        flex: 0.8,
    },
    alertMsg: {
        flex: 0.45,
    },
    leftContent: {
        paddingLeft: 15
    },
    text: {
        color: 'white',
        width: '100%',
        height: 70,
        fontFamily: 'System',
        fontWeight: '600',
        fontSize: 18,
    }
});
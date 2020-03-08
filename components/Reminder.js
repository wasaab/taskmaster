import React, { Component } from 'react';
import { StyleSheet, Text, View, DatePickerIOS, Switch, Picker, Modal } from 'react-native';
import { Icon } from 'react-native-elements';
import RNCalendarReminders from 'react-native-calendar-reminders';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker';
import Colors from '../constants/Colors'
import ListItem  from './ListItem';
import TaskManager from './TaskManager';

const taskManager = new TaskManager();

export default class Reminder extends Component {
    constructor(props) {
        super(props);

        const { reminder, taskID } = this.props.navigation.getParam('taskProps');
        const halfHourMs = 1800000;
        const dateRoundedToHalfHour = new Date(Math.round(new Date().getTime() / halfHourMs) * halfHourMs);

        this.state = {
            taskID: taskID,
            reminderEnabled: reminder.enabled,
            remindTime: reminder.time ? new Date(reminder.time) : dateRoundedToHalfHour,
            repeatPeriod: reminder.repeat
        };
    }

    createReminder() {
        const { title, blocker } = this.props.navigation.getParam('taskProps');

        RNCalendarReminders.saveReminder(title, {
            location: '',
            notes: blocker,
            startDate: taskManager.getTodayPlusOffset(1),
            recurrence: repeatPeriod
        })
            .then((id) => {
                console.log('Reminder saved with ID:', id);
            })
            .catch((error) => {
                console.error('Reminder failed to save:', error);
            });
    }

    handleRemindTimeChange = (newTime) => {
        this.setState({ remindTime: newTime });

        const { task } = taskManager.getTask(this.state.taskID);

        task.reminder.time = newTime;
        taskManager.storeTasks();
    }

    handleReminderToggled = (isEnabled) => {
        this.setState({ reminderEnabled: isEnabled });

        const { task } = taskManager.getTask(this.state.taskID);

        task.reminder.enabled = isEnabled;
        task.reminder.time = this.state.remindTime;
        taskManager.storeTasks();
    }

    handleRepeatPeriodChange = (newPeriod) => {
        this.setState({ repeatPeriod: newPeriod });

        const { task } = taskManager.getTask(this.state.taskID);

        task.reminder.repeat = newPeriod;
        taskManager.storeTasks();
    }

    render() {
        return (
            <View style={styles.container}>
                <ListItem {...this.props.navigation.getParam('taskProps')}/>
                <View style={[styles.rowFlexContainer, { marginTop: 10 }]}>
                    <Text style={[styles.leftContent, styles.remindMsg, styles.text]}>Remind me on a day</Text>
                    <Switch
                        style={styles.remindToggle}
                        onValueChange={this.handleReminderToggled}
                        value={this.state.reminderEnabled}
                    />
                </View>
                {this.state.reminderEnabled &&
                <View style={styles.rowFlexContainer}>
                    <Text style={[styles.leftContent, styles.alertMsg, styles.text]}>Alert</Text>
                    <DatePicker
                        style={styles.remindTimePicker}
                        date={this.state.remindTime}
                        mode="datetime"
                        placeholder="select date"
                        format="ddd M/D/YY, h:mm a"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateTouchBody: {
                                width: 220
                            },
                            dateInput: {
                                width: '100%',
                                marginLeft: 36
                            },
                            dateText: {
                                width: '100%',
                                color: Colors.WHITE,
                                textAlign: 'center',
                                fontFamily: 'System',
                                fontWeight: '600',
                                fontSize: 16
                            },
                            datePicker: {
                                backgroundColor: 'rgb(60,60,60)',
                                borderTopWidth: 0
                            },
                            datePickerCon: {
                                backgroundColor: Colors.darkBackground
                            },
                            btnTextCancel: {
                                color: Colors.WHITE
                            }
                        }}
                        onDateChange={this.handleRemindTimeChange}
                    />
                </View>
                }
                {this.state.reminderEnabled &&
                <View style={styles.rowFlexContainer}>
                    <Text style={[styles.leftContent, { flex: 0.92 }, styles.text]}>Repeat</Text>
                    <Icon iconStyle={styles.repeatIcon} name='history' type='materialicons' size={35}/>
                    <RNPickerSelect
                        style={{
                            modalViewMiddle: { backgroundColor: 'rgb(25,25,25)', borderTopWidth: 0 },
                            chevron: { display: 'none'}
                        }}
                        textInputProps={{ style: styles.recurrenceText }}
                        pickerProps={{ style: { backgroundColor: 'rgb(60,60,60)' } }}
                        modalProps={{ style: { backgroundColor: Colors.darkBackground } }}
                        items={[
                            { label: 'Never', value: 'never'},
                            { label: 'Daily', value: 'daily'},
                            { label: 'Weekly', value: 'weekly'},
                            { label: 'Monthly', value: 'monthly'},
                            { label: 'Yearly', value: 'yearly'},
                        ]}
                        onValueChange={this.handleRepeatPeriodChange}
                        value={this.state.repeatPeriod}
                        useNativeAndroidPickerStyle={false}
                    />
                </View>
                }
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: Colors.darkBackground
    },
    remindTimePicker: {
        height: 70
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
        flex: 0.55,
    },
    leftContent: {
        paddingLeft: 15
    },
    text: {
        color: Colors.WHITE,
        width: '100%',
        height: 70,
        fontFamily: 'System',
        fontWeight: '600',
        fontSize: 18,
    },
    recurrenceText: {
        color: Colors.WHITE,
        width: '100%',
        fontFamily: 'System',
        fontWeight: '600',
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#aaa',
        paddingRight: 8,
        paddingLeft: 8,
        paddingTop: 6,
        paddingBottom: 6
    },
    repeatIcon: {
        color: 'dodgerblue',
        marginRight: 5,
        transform: [{ rotateY: '180deg' }]
    },
});

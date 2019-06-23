import React, { Component } from 'react';
import { StyleSheet, Text, View, DatePickerIOS, Switch, Picker, Modal } from 'react-native';
import RNCalendarReminders from 'react-native-calendar-reminders';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker';
import Colors from '../constants/Colors'
import ListItem  from './ListItem';

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
                <ListItem reminder/>
                <View style={[styles.rowFlexContainer, { marginTop: 10 }]}>
                    <Text style={[styles.leftContent, styles.remindMsg, styles.text]}>Remind me on a day</Text>
                    <Switch
                        style={styles.remindToggle}
                        onValueChange={this.handleReminderToggled}
                        value={this.state.reminderEnabled}
                    />
                </View>
                <View style={styles.rowFlexContainer}>
                    <Text style={[styles.leftContent, styles.alertMsg, styles.text]}>Alert</Text>
                    {/* <Text style={[styles.remindTimeText, styles.text]}>{this.formatRemindTime()}</Text> */}
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
                                color: 'white',
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
                                color: 'white'
                            }
                        }}
                        onDateChange={this.handleRemindTimeChange}
                    />
                </View>
                <View style={styles.rowFlexContainer}>
                    <Text style={[styles.leftContent, { flex: 0.93 }, styles.text]}>Repeat</Text>
                    <RNPickerSelect
                        style={{ modalViewMiddle: { backgroundColor: 'rgb(25,25,25)', borderTopWidth: 0 }, chevron: { display: 'none'} }}
                        textInputProps={{ style: styles.recurrenceText }}
                        pickerProps={{ style: { backgroundColor: 'rgb(60,60,60)' } }}
                        // hideDoneBar={true}
                        modalProps={{ style: { backgroundColor: Colors.darkBackground } }}
                        items={[
                            { label: 'Never', value: 'Never'},
                            { label: 'Daily', value: 'Daily'},
                            { label: 'Weekly', value: 'Weekly'},
                            { label: 'Monthly', value: 'Monthly'},
                            { label: 'Yearly', value: 'Yearly'},
                        ]}
                        onValueChange={this.handleRepeatPeriodChange}
                        value={this.state.repeatPeriod}
                        useNativeAndroidPickerStyle={false}
                    />
                </View>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: Colors.darkBackground
    },
    remindTimePicker: {
        // flex: 0.55,
        // width: '100%',
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
        color: 'white',
        width: '100%',
        height: 70,
        fontFamily: 'System',
        fontWeight: '600',
        fontSize: 18,
    },
    recurrenceText: {
        color: 'white',
        width: '100%',
        fontFamily: 'System',
        fontWeight: '600',
        fontSize: 18,
    }
});
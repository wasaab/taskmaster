import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import TaskListScreen from '../screens/TaskListScreen';
import TimesheetScreen from '../screens/TimesheetScreen';
import ReminderScreen from '../screens/ReminderScreen';

export default createAppContainer(createStackNavigator(
  {
    Timesheet: TimesheetScreen,
    TaskList: TaskListScreen,
    Reminder: ReminderScreen
  },
  {
    initialRouteName: 'TaskList'
  }
));
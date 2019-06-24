import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import TaskListScreen from '../screens/TaskListScreen';
import TimesheetScreen from '../screens/TimesheetScreen';
import ReminderScreen from '../screens/ReminderScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen';

export default createAppContainer(createStackNavigator(
  {
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Timesheet: TimesheetScreen,
    TaskList: TaskListScreen,
    Reminder: ReminderScreen,
    CreateTask: CreateTaskScreen
  },
  {
    initialRouteName: 'TaskList'
  }
));
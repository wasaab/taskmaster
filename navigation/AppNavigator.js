import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

// import MainTabNavigator from './MainTabNavigator';
import TaskListScreen from '../screens/TaskListScreen';
import TimesheetScreen from '../screens/TimesheetScreen';
import ReminderScreen from '../screens/ReminderScreen';

export default createAppContainer(createStackNavigator(
  {
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Timesheet: TimesheetScreen,
    TaskList: TaskListScreen,
    Reminder: ReminderScreen
  },
  {
    initialRouteName: 'Reminder'
  }
));
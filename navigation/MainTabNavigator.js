import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import TimesheetScreen from '../screens/TimesheetScreen';
import TaskListScreen from '../screens/TaskListScreen';
import SettingsScreen from '../screens/SettingsScreen';

const TimesheetStack = createStackNavigator({
  TaskList: TaskListScreen,
  CreateTask: TimesheetScreen
});

TimesheetStack.navigationOptions = {
  tabBarLabel: 'Timesheet',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-Timesheet' : 'md-Timesheet'}
    />
  ),
};

const TaskListStack = createStackNavigator({
  Tasks: TaskListScreen,
});

TaskListStack.navigationOptions = {
  tabBarLabel: 'Tasks',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-list' : 'md-list'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  TimesheetStack,
  TaskListStack,
  SettingsStack,
});

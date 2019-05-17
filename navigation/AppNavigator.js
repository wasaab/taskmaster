import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

// import MainTabNavigator from './MainTabNavigator';
import TaskListScreen from '../screens/TaskListScreen';
import HomeScreen from '../screens/HomeScreen';

export default createAppContainer(createStackNavigator(
  {
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Home: HomeScreen,
    TaskList: TaskListScreen
  },
  {
    initialRouteName: 'TaskList'
  }
));
import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import {
  ProjectListScreen,
  KanbanBoardScreen,
  TaskDetailsScreen,
} from '../screens';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const prefix = Linking.createURL('/');

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, 'minipm://'],
  config: {
    screens: {
      ProjectList: '',
      KanbanBoard: 'project/:projectId',
      TaskDetails: 'task/:taskId',
    },
  },
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen name="ProjectList" component={ProjectListScreen} />
        <Stack.Screen name="KanbanBoard" component={KanbanBoardScreen} />
        <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

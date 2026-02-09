import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { RootStackParamList } from './src/types';
import { FolderProvider } from './src/contexts/FolderContext';
import { TaskProvider } from './src/contexts/TaskContext';
import { setupNotifications } from './src/utils/notificationUtils';

// Screens
import { FoldersScreen } from './src/screens/FoldersScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { NewFolderScreen } from './src/screens/NewFolderScreen';
import { NewTaskScreen } from './src/screens/NewTaskScreen';
import { EditTaskScreen } from './src/screens/EditTaskScreen';
import { AllTasksScreen } from './src/screens/AllTasksScreen';

import { COLORS } from './src/constants/colors';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <FolderProvider>
          <TaskProvider>
            <NavigationContainer>
              <StatusBar style="light" />
              <Stack.Navigator
                initialRouteName="AllTasks"
                screenOptions={{
                  headerStyle: {
                    backgroundColor: COLORS.background,
                  },
                  headerTintColor: COLORS.textPrimary,
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  cardStyle: {
                    backgroundColor: COLORS.background,
                  },
                }}
              >
                <Stack.Screen
                  name="AllTasks"
                  component={AllTasksScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Folders"
                  component={FoldersScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Tasks"
                  component={TasksScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="NewFolder"
                  component={NewFolderScreen}
                  options={{
                    title: 'New Folder',
                    presentation: 'modal',
                  }}
                />
                <Stack.Screen
                  name="NewTask"
                  component={NewTaskScreen}
                  options={{
                    title: 'New Assignment',
                    presentation: 'modal',
                  }}
                />
                <Stack.Screen
                  name="EditTask"
                  component={EditTaskScreen}
                  options={{
                    title: 'Edit Assignment',
                    presentation: 'modal',
                  }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </TaskProvider>
        </FolderProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
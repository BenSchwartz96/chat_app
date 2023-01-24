// import React
import React, { Component } from 'react';

import { LogBox } from 'react-native';

// import react native gesture handler
import 'react-native-gesture-handler';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// import react native gesture handler
import 'react-native-gesture-handler';

// import components
import Start from './components/Start';
import Chat from './components/Chat';
import CustomActions from './components/CustomActions';

// Create the navigator
const Stack = createStackNavigator();

//this prevents the 'asyncstorage' bug
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

export default class App extends Component {
  render() {


    return (
      <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Start"
          >
            <Stack.Screen
              name="Start"
              component={Start}
            />
            <Stack.Screen
              name="Chat"
              component={Chat}
            />
          </Stack.Navigator>
        </NavigationContainer>
    );
  }
}



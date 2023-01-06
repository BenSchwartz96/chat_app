import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Chat extends React.Component {

  componentDidMount() {
    //Set name at the top to name entered on the Start screen
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({title: name});
  }
  
  
  render() {
        
    // Set background color
    let color = this.props.route.params.color;

    return (
      <View 
      style={{
        flex: 1,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text>Hello! This is the Chat screen</Text>
      </View>
    )
  }
}

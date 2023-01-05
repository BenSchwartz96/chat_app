import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Chat extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Hello! This is the Chat screen</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'purple',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
import React from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';

export default class Start extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/bg_img.png')} style={styles.background_image}>
          <Text style={styles.text1} >Hello! This is the start screen</Text>
          <Button
            style={styles.chat_button}
            title="Start Chatting"
            onPress={() => this.props.navigation.navigate('Chat')}
          />
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  background_image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  text1: {
    color: 'white',
    textAlign: 'center'
  },
  chat_button: {
    fontSize: 16,
    fontWeight: 300,
    backgroundColor: '#757083',
  }
});
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';



const bgColors = {
  black: '#090C08',
  purple: '#474056',
  grey: '#8A95A5',
  green: '#B9C6AE'
};

export default class Start extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '', 
      color: ''
    }
  }



  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/bg_img.png')} style={styles.background_image}>
          <Text style={styles.app_title}>Meet</Text>
          <View style={styles.main_area}>
            <TextInput 
              style={styles.your_name}
              placeholder="Your Name"
              value={this.state.name}
              onChangeText={(name) => this.setState({ name })}
              />

            <Text style={styles.text1}>Choose Background Color:</Text>
            <View style={styles.color_chooser}>

              <TouchableOpacity
                style={[styles.colors, { backgroundColor: bgColors.black },]}
                onPress={() => this.setState({color: bgColors.black})}
              />
              <TouchableOpacity
                style={[styles.colors, { backgroundColor: bgColors.purple },]}
                onPress={() => this.setState({color: bgColors.purple})}
              />
              <TouchableOpacity
                style={[styles.colors, { backgroundColor: bgColors.grey },]}
                onPress={() => this.setState({color: bgColors.grey})}
              />
              <TouchableOpacity
                style={[styles.colors, { backgroundColor: bgColors.green },]}
                onPress={() => this.setState({color: bgColors.green})}
              />
            </View>

            <TouchableOpacity
              style={styles.chat_button}
              onPress={() => this.props.navigation.navigate('Chat', {
                name: this.state.name,
                color: this.state.color,
              })}>
              <Text style={styles.chat_button_text}>Start Chatting</Text>
            </ TouchableOpacity>
          </View>
        </ImageBackground>
        {Platform.OS === 'ios' ? <KeyboardAvoidingView behavior="padding" /> : null}
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
    justifyContent: 'space-between',
    padding: '6%',
  },
  main_area: {
    backgroundColor: 'white',
    minHeight: 300,
    height: '44%',
    // width: '88%',
    // marginHorizontal: '6%',
    // marginTop: '53%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text1: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  your_name: {
    //should do opacity here, but it didnt work last time 
    fontSize: 15,
    fontWeight: '300',
    // textAlign: 'center',
    borderWidth: 2,
    borderRadius: 5,
    padding: '4%',
    marginTop: '5%',
    width: '88%'
  },
  color_chooser: {
    flexDirection: 'row',
  },
  colors: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  chat_button: {
    backgroundColor: '#757083',
    height: 60,
    width: '88%',
    marginBottom: '6%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chat_button_text: {
    color: 'white',        //ok setting color just isnt working? nor is alinging it
    fontSize: 16,
    fontWeight: '600'
  },
  app_title: {
    textAlign: 'center',
    marginTop: '15%',
    fontSize: 45,
    fontWeight: '600',
  }
});
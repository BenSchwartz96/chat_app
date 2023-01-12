import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';

import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const firebase = require('firebase');
require('firebase/firestore');




export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
    }
    
    
    const firebaseConfig = {
      apiKey: "AIzaSyBAtyfLF2fm2dqv2kXZukbp_YWI2DLjZqI",
      authDomain: "test-30874.firebaseapp.com",
      projectId: "test-30874",
      storageBucket: "test-30874.appspot.com",
      messagingSenderId: "13099037868",
    }
    
    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }

    // References messages collection
    this.referenceChatMessages = firebase.firestore().collection("messages");

  }


  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: doc._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages,
  });
  }


  componentDidMount() {
    //Set name at the top to name entered on the Start screen
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({title: name});

    //Anonymous authentication
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        results = await firebase.auth().signInAnonymously();
        user = results.user;
      }

      //then update state
      this.setState({
        uid: user.uid,
        messages: [],
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });

  }


  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
    if (this.authUnsubscribe) this.authUnsubscribe();
  }


  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    this.addMessage(messages[0]);
  }

  //Save messages to database
  addMessage = (message) => {

    this.referenceChatMessages.add({
        uid: this.state.uid,
        _id: message._id,
        text: message.text,
        createdAt: message.createdAt,
        user: message.user,
    });
  }
  
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: 'blue'
          }
        }}
      />
    )
  }


  render() {
        
    // Set background color
    let { color, name} = this.props.route.params;

    return (
      <View style={[styles.container, { backgroundColor: color }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.uid,
            name: name,

          }}
        />


        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }

//
}



//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

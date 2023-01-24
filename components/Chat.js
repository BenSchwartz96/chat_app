import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Send maps as messages
import MapView from 'react-native-maps';

// CustomActions option to select image/location sharing.
import CustomActions from './CustomActions';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';


//importing updated firebase
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, onSnapshot, query, orderBy, addDoc, disableNetwork, enableNetwork } from "firebase/firestore";
import {  getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getStorage } from "firebase/storage";

import { db, auth } from "../config/firebase";

export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      isConnected: null,
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      image: null,
      location: null
    }

    this.referenceChatMessages = collection(db, "messages");
  }


  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    }, () => {
      this.saveMessages();
    });
  }

  componentDidMount() {
    //Set name at the top to name entered on the Start screen
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    this.unsubscribeNetInfo = NetInfo.addEventListener(state => {
      this.setState({ isConnected: state.isConnected })
    });
  }


  // Will run whenever state updates and check for being online
  componentDidUpdate(prevProps, prevState) {
    if (prevState.isConnected !== this.state.isConnected) {
      if (this.state.isConnected === true) {
        enableNetwork(db);
        //Anonymous authentication
        if (this.authUnsubscribe) this.authUnsubscribe();
        this.authUnsubscribe = onAuthStateChanged(auth, async (user) => {
          if (!user) {
            results = await signInAnonymously(auth);
            user = results.user;
          }

          this.setState({
            uid: user.uid,
          });

          const q = query(this.referenceChatMessages, orderBy("createdAt", "desc"));
          if (this.unsubscribe) this.unsubscribe();
          this.unsubscribe = onSnapshot(q, this.onCollectionUpdate);
        });
      } else {
        disableNetwork(db);
        this.getMessages();
      }
    }
  }


  componentWillUnmount() {
      if (this.unsubscribe) this.unsubscribe();
      if (this.authUnsubscribe) this.authUnsubscribe();
      if (this.unsubscribeNetInfo) this.unsubscribeNetInfo();
  }


  // Adds most recently sent message to the messages array and to giftedchat
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessage(messages[0]);
    });
  }


  //Gets messages from local/async storage
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };


  //Add messages to database
  addMessage = (message) => {

    addDoc(this.referenceChatMessages, {
      uid: this.state.uid,
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      // these two below are taken from ZH. idk what the || stuff is
      image: message.image || "",
      location: message.location || null,
    });
  }


  //Save messages to local/async storage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  //Delete messages in database (when I need to, not used this yet)
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  
  // Makes sender chat bubble blue
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


  // Hides option to send a message if offline
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }

  // Render symbol and actionbar allowing to take/send pictures or share location
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  // Render a mapview if a message contains location data
  renderCustomView (props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
          <MapView
            style={{width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3}}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
      );
    }
    return null;
  }



  render() {
        
    // Set background color
    let { color, name} = this.props.route.params;

    return (
      <ActionSheetProvider>
        <View style={[styles.container, { backgroundColor: color }]}>
          <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            renderCustomView={this.renderCustomView}
            renderActions={this.renderCustomActions}
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: this.state.uid,
              name: name,
            }}
          />


          { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
      </ActionSheetProvider>
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

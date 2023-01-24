import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Expo packages for accessing devices camera, pictures, and location. Also react maps
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { connectActionSheet, useActionSheet } from "@expo/react-native-action-sheet";
import { async } from '@firebase/util';

// This from instructions for download data via URI for firebase v9
import "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

// For creating random strings to differentiate files with same name uploaded to storage
import { v4 } from "uuid";
 
import { storage } from "../config/firebase";


export default class CustomActions extends React.Component {

  // showActionSheetWithOptions = useActionSheet();

  onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    // this.context.actionSheet().showActionSheetWithOptions(


    this.props.showActionSheetWithOptions(
      { options, cancelButtonIndex },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            {this.pickImage()}
            return;
          case 1:
            {this.takePhoto()}
            return;
          case 2:
            {this.getLocation()}
          default:
        }
      },
    );


  };


  //all instances of 'assets' were previously 'uri', but an error said that 'uri' is deprecated soon.
uploadImage = async(assets) => {

  const img = await fetch(assets);
  const imgBlob = await img.blob();

  const imageNameBefore = assets.split('/');
  const imageName = imageNameBefore[imageNameBefore.length - 1];

  const storage = getStorage();
  const storageRef = ref(storage, `images/${imageName + v4()}`);

  return uploadBytes(storageRef, imgBlob).then(async (snapshot) => {
      imgBlob.close();
      return getDownloadURL(snapshot.ref).then((url) => {
        return url;
      });
    }
  );
}



//////////////////////////

// trying changes to status/permissions. only tried on PICKIMAGE so far.


  pickImage = async () => {

    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    try {
    if(status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      }).catch(error => console.log(error));
 
      if (!result.canceled) {

        this.uploadImage(result.assets)
        this.setState({
          image: result
        });  
      }
    }
  } catch (error) {
    console.error("pickImage", error);
  }
  }


  takePhoto = async() => {

    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA)

    if(status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'Images',
      }).catch(error => console.log(error));
  
      if (!result.canceled) {
        this.uploadImage(result)
        this.setState({
          image: result
        });  
      }
    }
  }

  getLocation = async() => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if(status === 'granted') {
      let result = await Location.getCurrentPositionAsync({});
 
      if (result) {
        // line here for uploading location image
        this.setState({
          location: result
        });
      }
    }
  }

///////////////////////////





  render() {
    return (
      <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }

}


//Styles
const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
 };

 CustomActions = connectActionSheet(CustomActions);
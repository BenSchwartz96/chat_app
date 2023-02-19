import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, TouchableOpacity, Text, View, } from "react-native";

// Firebase/storage stuff
import "firebase/firestore";
import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";

// Expo packages
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useActionSheet } from "@expo/react-native-action-sheet";


export default function CustomActions(props) {
  const { showActionSheetWithOptions } = useActionSheet();

  // Function for uploading images to storage
  async function uploadImage(uri) {

    // turn image into a blob file (binary large object)
    const img = await fetch(uri);
    const imgBlob = await img.blob();


    // Set name of image, add random string to differentiate multiple instances of the same file, and create reference to storage
    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore.length - 1];
    const storage = getStorage();
    const storageRef = ref(storage, `images/${imageName}`);

    // Use uploadBytes firebase function to send image to storage and get the download url.
    return uploadBytes(storageRef, imgBlob).then(
      async (snapshot) => {
        imgBlob.close();
        return getDownloadURL(snapshot.ref).then((url) => {
          return url;
        });
      }
    );
  }

  // Function for picking image from library
  const pickImage = async () => {

    // permission to select image from library
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    try {
      if (status === "granted") {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          }).catch((error) =>
            console.log("pickImage, result", error)
          );
        console.log(result);

        // if not cancelled, upload and send image
        if (!result.canceled) {
          const imgUrl = await uploadImage(result.uri);
          props.onSend({ image: imgUrl });
        }
      }
    } catch (error) {
      console.error("pickImage", error);
    }
  };

  // take photo with smartphone camera
  const takePhoto = async () => {

    // permission to use camera?
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    try {
      // launch camera, if permission is granted
      if (status === "granted") {
        let result = await ImagePicker.launchCameraAsync({
          base64: true,
          quality: 1,
        }).catch((error) =>
          console.error("takePhoto permission", error)
        );
        // if not cancelled, upload and send image
        if (!result.canceled) {
          const imgUrl = await uploadImage(
            result.assets[0].uri
          );
          props.onSend({ image: imgUrl });
        }
      }
    } catch (error) {
      console.log("takePhoto", error);
    }
  };

  // get location of user via GPS
  const getLocation = async () => {

    //permission to access current location?
    const { status } = await Location.requestForegroundPermissionsAsync();

    try {
      // get location, if permission is granted
      if (status === "granted") {
        const result = await Location.getCurrentPositionAsync({}).catch(
          (error) =>
            console.error("getLocation permission", error)
          );
        // if location found, send it
        if (result) {
          props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
      }
    } catch (error) {
      console.error("getLocation", error);
    }
  };


  // Set up options in the actionsheet
  const onActionPress = () => {
    const options = [ "Choose From Library", "Take Picture", "Send Location", "Cancel"];
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      { options, cancelButtonIndex },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            return pickImage();
          case 1:
            return takePhoto();
          case 2:
            return getLocation();
          default:
        }
      }
    );
  };

  return (
    <TouchableOpacity
    accessible={true}
    accessibilityLabel="More options"
    accessibilityHint="Choose to send a saved image, take and send a new image, or send your location."
      style={styles.container}
      onPress={onActionPress}>
      <View style={styles.wrapper}>
        <Text style={styles.iconText}>+</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    margin: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};
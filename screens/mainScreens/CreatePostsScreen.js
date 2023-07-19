import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";

const CreatePostScreen = ({ navigation }) => {
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState("");

  const takePhoto = async () => {
    const photo = await camera.takePictureAsync();
    // const location = await Location.getCurrentPositionAsync();
    // console.log("location", location);
    setPhoto(photo.uri);
  };

  const sendPhoto = () => {
    navigation.navigate("DefaultScreen", { photo });
  };

  return (
    <View>
      <Camera style={styles.camera} ref={setCamera}>
        {photo && (
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: photo }}
              styles={{ width: 200, height: 200 }}
            />
          </View>
        )}

        <TouchableOpacity onPress={takePhoto} style={styles.photoButton}>
          <Text style={{ color: "#fff" }}>Photo</Text>
        </TouchableOpacity>
      </Camera>
      <TouchableOpacity onPress={sendPhoto} style={styles.sendButton}>
        <Text style={{ fontSize: 20, textTransform: "uppercase" }}>Send</Text>
      </TouchableOpacity>
      {/* <View style={styles.container}>
        <View style={styles.imageContainer}>
          <TouchableOpacity style={styles.cameraButton}>
            <FontAwesome5
              name="camera"
              size={24}
              color="rgba(189, 189, 189, 1)"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.text}> Завантажте фото/Редагувати фото</Text>
        <TextInput
          // style={{ ...textStyle, ...inputStyle, marginBottom: 16 }}
          keyboardType="default"
          placeholder="Name..."
          placeholderTextColor="#BDBDBD"
          value={value.title}
          // onFocus={() => setIsKeyboard(true)}
          // onEndEditing={() => setIsKeyboard(false)}
          // onChangeText={(value) => handleChangeInput("title", value)}
        />
        <View style={{ justifyContent: "center" }}>
          <TextInput
            // style={{ ...textStyle, ...inputStyle, paddingLeft: 28 }}
            keyboardType="default"
            placeholder="Place..."
            placeholderTextColor="#BDBDBD"
            value={value.descriptionLocation}
            // onFocus={() => setIsKeyboard(true)}
            // onEndEditing={() => setIsKeyboard(false)}
            // onChangeText={(value) =>
            //   handleChangeInput("descriptionLocation", value)
            // }
          />
          <MapPinIcon style={{ position: "absolute" }} />
        </View>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    backgroundColor: "#ffffff",
  },
  imageContainer: {
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E8E8E8",
  },
  cameraButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginBottom: 32,
    color: "#BDBDBD",
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 20,
  },
  camera: {
    height: "70%",
    marginHorizontal: 5,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 30,
    borderRadius: 10,
  },
  photoContainer: {
    position: "absolute",
    top: 50,
    left: 10,
    width: 200,
    height: 200,
    borderColor: "#fff",
    borderWidth: 1,
  },
  photoButton: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    width: 70,
    height: 70,
  },
  sendButton: {
    marginHorizontal: 30,
    backgroundColor: "#FF6C00",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
});

export default CreatePostScreen;

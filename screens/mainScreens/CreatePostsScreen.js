import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";

const INITIAL_STATE = {
  name: "",
  location: "",
};

const CreatePostScreen = ({ navigation }) => {
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState("");
  const [state, setState] = useState(INITIAL_STATE);
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);
  const [coords, setCoords] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setLocationStatus("denied");
        return;
      }

      setLocationStatus("loading");
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setCoords({ latitude, longitude });
      setLocationStatus("granted");
    } catch (error) {
      console.log("Error while getting location: ", error);
      setLocationStatus("error");
    }
  };

  const takePhoto = async () => {
    if (!camera) return;

    const photo = await camera.takePictureAsync();
    setPhoto(photo.uri);
    getLocation();
  };

  const sendPhoto = () => {
    navigation.navigate("Публікації", { photo, state, coords });
    console.log(state);
  };

  const hideKeyboard = () => {
    setIsKeyboardShown(false);
    Keyboard.dismiss();
  };

  return (
    <Pressable onPress={hideKeyboard} style={styles.container}>
      <View
        style={{
          ...styles.imageContainer,
          marginTop: isKeyboardShown ? -120 : 0,
        }}
      >
        <Camera style={styles.camera} ref={setCamera}>
          {photo && (
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: photo }}
                style={{ width: 100, height: 100 }}
              />
            </View>
          )}

          <Pressable onPress={takePhoto} style={styles.cameraButton}>
            {({ pressed }) => (
              <FontAwesome5
                name="camera"
                size={24}
                color={
                  pressed
                    ? "rgba(189, 189, 189, 0.5)"
                    : "rgba(189, 189, 189, 1)"
                }
              />
            )}
          </Pressable>
        </Camera>
      </View>

      <Text style={styles.text}> Завантажте фото/Редагувати фото</Text>
      <TextInput
        style={styles.input}
        value={state.name}
        placeholder="Назва..."
        placeholderTextColor="#BDBDBD"
        selectionColor="#FF6C00"
        onFocus={() => setIsKeyboardShown(true)}
        onChangeText={(value) =>
          setState((prevState) => ({ ...prevState, name: value }))
        }
      />

      <View style={styles.inputThumb}>
        <Feather
          name="map-pin"
          size={24}
          color="#BDBDBD"
          style={styles.locationIcon}
        />
        <TextInput
          style={{ ...styles.input, borderBottomWidth: 0 }}
          value={state.location}
          placeholder="Місцевість..."
          placeholderTextColor="#BDBDBD"
          selectionColor="#FF6C00"
          onFocus={() => setIsKeyboardShown(true)}
          onChangeText={(value) =>
            setState((prevState) => ({ ...prevState, location: value }))
          }
        />
      </View>

      <Pressable onPress={sendPhoto} style={styles.sendButton}>
        {({ pressed }) => (
          <Text style={{ fontSize: 16, color: "#fff" }}>Опублікувати</Text>
        )}
      </Pressable>
      {locationStatus === "error" && (
        <Text>Помилка отримання місцезнаходження</Text>
      )}
    </Pressable>
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
    marginBottom: 8,
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E8E8E8",
    overflow: "hidden",
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
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },
  photoContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 100,
    height: 100,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  input: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 8,
    fontSize: 16,
    lineHeight: 19,
    borderBottomColor: "#E8E8E8",
    borderBottomWidth: 1,
  },
  inputThumb: {
    position: "relative",
    width: "100%",
    marginTop: 16,
    marginBottom: 32,
    paddingLeft: 36,
    borderBottomColor: "#E8E8E8",
    borderBottomWidth: 1,
  },
  locationIcon: {
    position: "absolute",
    top: 16,
    left: 8,
  },
  sendButton: {
    backgroundColor: "#FF6C00",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
});

export default CreatePostScreen;

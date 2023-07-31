import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  Keyboard,
} from "react-native";
import { useSelector } from "react-redux";

import { Camera } from "expo-camera";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

import { FontAwesome5, Feather } from "@expo/vector-icons";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

import { db, storage } from "../../firebase/config";

import uuid from "react-native-uuid";

const CreatePostScreen = ({ navigation }) => {
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState("");
  const [coords, setCoords] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const { userId, login } = useSelector((state) => state.auth);

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
    const { uri } = await camera.takePictureAsync();
    setPhoto(uri);
    getLocation();
  };

  const openGallery = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Для доступа к галерее разрешение не предоставлено.");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync();
      if (!pickerResult.canceled) {
        setPhoto(pickerResult.assets[0].uri);
        getLocation();
      }
    } catch (error) {
      console.error("Ошибка при выборе изображения из галереи:", error);
    }
  };

  const uploadPhotoToServer = async () => {
    try {
      const res = await fetch(photo);

      const file = await res.blob();
      const uniqueID = uuid.v4();
      const storageRef = ref(storage, `/postImage/${uniqueID}`);
      await uploadBytes(storageRef, file);
      const postImageUrl = await getDownloadURL(storageRef);
      return postImageUrl;
    } catch (error) {
      console.log(error.message);
    }
  };

  const uploadPostToServer = async () => {
    try {
      const photo = await uploadPhotoToServer();
      const createdAt = new Date(); // Добавляем текущую дату создания
      await addDoc(collection(db, "posts"), {
        photo,
        description,
        location,
        coords,
        userId,
        login,
        createdAt,
      });
      setLocation("");
      setDescription("");
      setPhoto("");
      navigation.navigate("Публікації");
    } catch (error) {
      console.log(error.message);
    }
  };

  const clearForm = () => {
    setLocation("");
    setDescription("");
    setPhoto("");
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

      <Pressable
        style={{
          marginBottom: 32,
          width: 150,
        }}
        onPress={openGallery}
      >
        <Text style={styles.text}>
          {photo ? "Редагувати фото" : "Завантажте фото"}
        </Text>
      </Pressable>

      <TextInput
        style={styles.input}
        value={description}
        placeholder="Назва..."
        placeholderTextColor="#BDBDBD"
        selectionColor="#FF6C00"
        onFocus={() => setIsKeyboardShown(true)}
        onChangeText={setDescription}
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
          value={location}
          placeholder="Місцевість..."
          placeholderTextColor="#BDBDBD"
          selectionColor="#FF6C00"
          onFocus={() => setIsKeyboardShown(true)}
          onChangeText={setLocation}
        />
      </View>

      <Pressable onPress={uploadPostToServer} style={styles.sendButton}>
        <Text style={{ fontSize: 16, color: "#fff" }}>Опублікувати</Text>
      </Pressable>

      {!isKeyboardShown && (
        <Pressable onPress={clearForm} style={styles.deleteButton}>
          <Feather name="trash-2" size={24} color="#BDBDBD" />
        </Pressable>
      )}

      {locationStatus === "error" && (
        <Text>Помилка отримання місцезнаходження</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
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
  deleteButton: {
    position: "absolute",
    bottom: 22,
    paddingHorizontal: 23,
    paddingVertical: 8,
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    alignSelf: "center",
  },
});

export default CreatePostScreen;

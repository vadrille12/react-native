import { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
} from "react-native";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as ImagePicker from "expo-image-picker";

import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/auth/authOperations";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/config";

import uuid from "react-native-uuid";

SplashScreen.preventAutoHideAsync();

const INITIAL_STATE = {
  login: "",
  email: "",
  password: "",
  photoUri: null,
};

export default function RegistrationScreen({ navigation }) {
  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width;
    };
    Dimensions.addEventListener("change", onChange);
  }, []);

  const [fontsLoaded] = useFonts({
    "Roboto-Medium": require("../../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("../../assets/fonts/Roboto-Regular.ttf"),
  });

  const [isKeyboardShown, setIsKeyboardShown] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(true);
  const [state, setState] = useState(INITIAL_STATE);
  const [photo, setPhoto] = useState(null);

  const dispatch = useDispatch();

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const handlePickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const photoUri = result.assets[0].uri;
        setPhoto(photoUri);
        console.log(photoUri);
      }
    } catch (error) {
      console.log("Ошибка выбора фото:", error);
    }
  };

  const uploadPhotoToServer = async () => {
    try {
      const res = await fetch(photo);
      const file = await res.blob();
      const uniqueID = uuid.v4();
      const storageRef = ref(storage, `userAvatar/${uniqueID}`);
      await uploadBytes(storageRef, file);
      const postImageUrl = await getDownloadURL(storageRef);
      return postImageUrl;
    } catch (error) {
      console.log("Ошибка загрузки фото:", error.message);
      return null;
    }
  };

  const hideKeyboard = () => {
    setIsKeyboardShown(false);
    Keyboard.dismiss();
  };

  const handleSubmit = async () => {
    try {
      const imageUrl = await uploadPhotoToServer();
      if (!imageUrl) {
        console.log("Ошибка при загрузке фото на сервер");
      }

      const userData = {
        login: state.login,
        email: state.email,
        password: state.password,
        photoUri: imageUrl,
      };

      dispatch(register(userData));
      hideKeyboard();
      setState(INITIAL_STATE);
    } catch (error) {
      console.log("Ошибка при регистрации:", error.message);
    }
  };

  const passwordShowToggler = () => {
    setIsPasswordShown((prevState) => !prevState);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        hideKeyboard();
      }}
    >
      <View style={styles.container} onLayout={onLayoutRootView}>
        <ImageBackground
          style={styles.imageBg}
          source={require("../../assets/images/background-img.jpg")}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, justifyContent: "flex-end" }}
          >
            <View style={styles.registrationWrapper}>
              <View
                style={{
                  ...styles.form,
                  marginBottom: isKeyboardShown ? 20 : 62,
                }}
              >
                <View style={styles.photo}>
                  {photo && (
                    <Image
                      source={{ uri: photo }}
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 16,
                      }}
                    />
                  )}
                  <TouchableOpacity
                    style={{
                      ...styles.addPhotoBtn,
                      borderColor: photo ? "#E8E8E8" : "#FF6C00",
                    }}
                    activeOpacity={0.9}
                    onPress={handlePickPhoto}
                  >
                    {photo ? (
                      <Image
                        source={require("../../assets/images/icon-close.png")}
                      />
                    ) : (
                      <Image
                        source={require("../../assets/images/icon-add.png")}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={styles.title}>Регистрация</Text>
                <TextInput
                  style={styles.input}
                  value={state.login}
                  placeholder="Логин"
                  placeholderTextColor={"#BDBDBD"}
                  selectionColor={"#FF6C00"}
                  onFocus={() => setIsKeyboardShown(true)}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, login: value }))
                  }
                />
                <TextInput
                  style={styles.input}
                  value={state.email}
                  placeholder="Адрес электронной почты"
                  placeholderTextColor={"#BDBDBD"}
                  selectionColor={"#FF6C00"}
                  onFocus={() => setIsKeyboardShown(true)}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, email: value }))
                  }
                />
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.input}
                    value={state.password}
                    placeholder="Пароль"
                    placeholderTextColor={"#BDBDBD"}
                    selectionColor={"#FF6C00"}
                    secureTextEntry={isPasswordShown}
                    onFocus={() => setIsKeyboardShown(true)}
                    onChangeText={(value) =>
                      setState((prevState) => ({
                        ...prevState,
                        password: value,
                      }))
                    }
                  />
                  <Text
                    style={styles.showPasswordTxt}
                    onPress={() => passwordShowToggler()}
                  >
                    {isPasswordShown ? "Показать" : "Скрыть"}
                  </Text>
                </View>
                {!isKeyboardShown && (
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.77}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={styles.buttonTxt}>Зарегистрироваться</Text>
                  </TouchableOpacity>
                )}

                {!isKeyboardShown && (
                  <Text
                    onPress={() => navigation.navigate("Login")}
                    style={styles.infoTxt}
                  >
                    Уже есть аккаунт? Войти
                  </Text>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
  imageBg: {
    flex: 1,
    justifyContent: "flex-end",
    resizeMode: "cover",
  },
  registrationWrapper: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#fff",
  },
  form: {
    gap: 16,
  },
  photo: {
    position: "relative",
    height: 120,
    width: 120,
    alignSelf: "center",
    marginTop: -60,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
  },
  addPhotoBtn: {
    position: "absolute",
    bottom: 14,
    right: -12.5,
    width: 26,
    height: 25,

    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 100,
    // borderColor: "#FF6C00",
    backgroundColor: "#FFFFFF",
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    marginTop: 32,
    marginBottom: 33,
    lineHeight: 35,
    letterSpacing: 0.1,
    fontFamily: "Roboto-Medium",
  },
  passwordWrapper: {
    position: "relative",
  },
  input: {
    marginHorizontal: 16,
    height: 50,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E8E8E8",
    backgroundColor: "#F6F6F6",
    fontFamily: "Roboto-Regular",
  },
  showPasswordTxt: {
    fontFamily: "Roboto-Regular",
    position: "absolute",
    top: 16,
    right: 16,
    marginHorizontal: 16,
    color: "#1B4371",
    fontSize: 16,
    lineHeight: 19,
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 27,
    borderRadius: 100,
    borderColor: "#E8E8E8",
    backgroundColor: "#FF6C00",
  },
  buttonTxt: {
    fontFamily: "Roboto-Regular",
    color: "#fff",
    fontSize: 16,
    lineHeight: 19,
  },
  infoTxt: {
    fontFamily: "Roboto-Regular",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 19,
    color: "#1B4371",
  },
});

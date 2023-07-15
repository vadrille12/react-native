import { FontAwesome5 } from "@expo/vector-icons";

import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

const CreatePostScreen = () => {
  return (
    <View style={styles.container}>
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
});

export default CreatePostScreen;

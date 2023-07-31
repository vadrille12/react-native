import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";

import * as ImagePicker from "expo-image-picker";

import {
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase/config";

import { logout, updateAvatar } from "../../redux/auth/authOperations";

import { Feather, EvilIcons } from "@expo/vector-icons";

import uuid from "react-native-uuid";

const ProfileScreen = ({ navigation }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [photo, setPhoto] = useState("");

  const dispatch = useDispatch();
  const { userId, login, photoUri } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userId) {
      getUserPosts();
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const getUserPosts = async () => {
    try {
      const postsCollection = collection(db, "posts");
      const userPostsQuery = query(
        postsCollection,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      onSnapshot(userPostsQuery, (snapshot) => {
        const updatedPosts = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUserPosts(updatedPosts);
      });
    } catch (error) {
      console.error("Error getting user posts: ", error);
    }
  };

  const uploadPhotoToServer = async (image) => {
    try {
      const res = await fetch(image);
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

  const pickUserAvatar = async () => {
    if (photo) {
      dispatch(updateAvatar(""));
      setPhoto("");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const photoUrl = await uploadPhotoToServer(result.assets[0].uri);
      setPhoto(photoUrl);
      dispatch(updateAvatar(photoUrl));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <ImageBackground
          style={styles.imageBg}
          source={require("../../assets/images/background-img.jpg")}
        >
          <View style={styles.profileContainer}>
            <TouchableOpacity
              style={{ position: "absolute", top: 22, right: 16 }}
              onPress={handleLogout}
            >
              <Feather name="log-out" size={24} color="#BDBDBD" />
            </TouchableOpacity>

            <View style={styles.photo}>
              <Image
                style={{ width: 120, height: 120, borderRadius: 16 }}
                source={{ uri: photoUri }}
              />

              <TouchableOpacity
                style={{
                  ...styles.addPhotoBtn,
                  borderColor: photoUri ? "#E8E8E8" : "#FF6C00",
                }}
                activeOpacity={0.9}
                onPress={pickUserAvatar}
              >
                {photoUri ? (
                  <Image
                    source={require("../../assets/images/icon-close.png")}
                  />
                ) : (
                  <Image source={require("../../assets/images/icon-add.png")} />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{login}</Text>
            <View
              style={
                {
                  // height: userPosts.length !== 0 ? "100%" : 400,
                }
              }
            >
              {userPosts.length !== 0 ? (
                <FlatList
                  style={styles.postsContainer}
                  data={userPosts}
                  keyExtractor={(item, indx) => indx.toString()}
                  renderItem={({ item }) => (
                    // console.log(item)
                    <View style={{ marginBottom: 32 }}>
                      <Image
                        source={{ uri: item.photo }}
                        style={{ height: 240, borderRadius: 8 }}
                      />
                      <Text style={{ fontSize: 16 }}>{item.description}</Text>
                      <View>
                        <EvilIcons
                          onPress={() =>
                            navigation.navigate("Comments", {
                              postId: item.id,
                              uri: item.photo,
                            })
                          }
                          name="comment"
                          size={30}
                          color="#BDBDBD"
                        />

                        <View
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            alignItems: "center",
                          }}
                        >
                          <Feather
                            name="map-pin"
                            size={20}
                            color="#BDBDBD"
                            style={{ position: "absolute", left: 0, top: 1 }}
                          />
                          <Text
                            onPress={() =>
                              navigation.navigate("Map", {
                                coords: item.coords,
                              })
                            }
                            style={{
                              paddingLeft: 26,
                              fontSize: 16,
                              textDecorationLine: "underline",
                            }}
                          >
                            {item.location}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                />
              ) : (
                <View
                  style={{
                    justifyContent: "center",
                    height: 400,
                  }}
                >
                  <Text style={{ textAlign: "center" }}>Нема постів</Text>
                </View>
              )}
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  imageBg: {
    resizeMode: "cover",
    paddingTop: 120,
  },
  profileContainer: {
    position: "relative",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  photo: {
    position: "relative",
    height: 120,
    width: 120,
    alignSelf: "center",
    marginTop: -60,
    marginBottom: 32,
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
    backgroundColor: "#FFFFFF",
  },
  name: {
    color: "#212121",
    textAlign: "center",
    fontSize: 30,
    fontFamily: "Roboto-Medium",
    letterSpacing: 0.3,
  },
  postsContainer: { marginTop: 33 },
});

export default ProfileScreen;

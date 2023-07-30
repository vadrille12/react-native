import { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Image } from "react-native";

import { Feather, EvilIcons } from "@expo/vector-icons";

import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../../firebase/config";

const DefaultScreen = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);

  const getAllPost = async () => {
    onSnapshot(collection(db, "posts"), (snapshot) => {
      const updatedPosts = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPosts(updatedPosts);
    });
  };
  console.log(posts);
  useEffect(() => {
    getAllPost();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item, indx) => indx.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 32 }}>
            <Image
              source={{ uri: item.photo }}
              style={{ height: 240, borderRadius: 8 }}
            />
            <Text style={{ fontSize: 16 }}>{item.description}</Text>
            <View>
              <EvilIcons
                onPress={() =>
                  navigation.navigate("Comments", { postId: item.id })
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
                    navigation.navigate("Map", { coords: item.coords })
                  }
                  style={{ paddingLeft: 26, fontSize: 16 }}
                >
                  {item.location}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
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
});

export default DefaultScreen;

import { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Image } from "react-native";

import { Feather } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";

const DefaultScreen = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);
  const { coords } = route.params || {};

  useEffect(() => {
    console.log(route.params);
    if (route.params) {
      setPosts((prevState) => [...prevState, route.params]);
    }
  }, [route.params]);

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
            <Text style={{ fontSize: 16 }}>{item.state.name}</Text>
            <View>
              <EvilIcons
                onPress={() => navigation.navigate("Comments")}
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
                  onPress={() => navigation.navigate("Map", { coords })}
                  style={{ paddingLeft: 26, fontSize: 16 }}
                >
                  {item.state.location}
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

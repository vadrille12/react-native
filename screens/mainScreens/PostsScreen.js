import { Text, View, StyleSheet } from "react-native";

const PostScreen = () => {
  return (
    <View style={styles.container}>
      <Text>PostScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PostScreen;

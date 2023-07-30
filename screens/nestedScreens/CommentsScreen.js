import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  Keyboard,
  FlatList,
  Text,
  Image,
  Dimensions,
} from "react-native";

import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";

import { doc, collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";

const CommentsScreen = ({ route }) => {
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const [comment, setComment] = useState("");
  const { postId } = route.params;
  console.log(postId);
  const { login, photoUri } = useSelector((state) => state.auth);

  const screenWidth = Dimensions.get("window").width;

  const margin = 44;
  const padding = 16 + 16;

  const containerWidth = screenWidth - margin - padding;

  useEffect(() => {
    getAllComments();
  }, []);

  const createComment = async () => {
    try {
      const commentData = { comment, login, photoUri };
      const commentsCollection = collection(
        doc(db, "posts", postId),
        "comments"
      );

      setComment("");
      hideKeyboard();
      await addDoc(commentsCollection, commentData);
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  const getAllComments = async () => {
    try {
      const commentsCollection = collection(
        doc(db, "posts", postId),
        "comments"
      );

      onSnapshot(commentsCollection, (snapshot) => {
        const updatedComments = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAllComments(updatedComments);
      });
    } catch (error) {
      console.error("Error getting comments: ", error);
    }
  };

  const hideKeyboard = () => {
    setIsKeyboardShown(false);
    Keyboard.dismiss();
  };

  return (
    <Pressable onPress={hideKeyboard} style={styles.container}>
      {allComments.length !== 0 ? (
        <FlatList
          data={allComments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            // console.log(item)
            <View
              style={[
                styles.commentContainer,
                item.login === login
                  ? { ...styles.currentUserComment, width: containerWidth }
                  : { ...styles.otherUserComment, width: containerWidth },
              ]}
            >
              {/* Отображение аватарки слева или справа в зависимости от пользователя */}
              {item.login !== login && (
                <Image
                  source={{ uri: item.photoUri }}
                  style={styles.avatarLeft} // Стили для аватарки слева
                />
              )}
              <Text>{item.comment}</Text>
              {/* Отображение аватарки справа для текущего пользователя */}
              {item.login === login && (
                <Image
                  source={{ uri: item.photoUri }}
                  style={styles.avatarRight} // Стили для аватарки справа
                />
              )}
            </View>
          )}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ textAlign: "center" }}>Нема коментарів</Text>
        </View>
      )}
      <View>
        <TextInput
          type="text"
          value={comment}
          onChangeText={setComment}
          style={styles.commentInput}
          placeholder="Комментировать..."
          placeholderTextColor="#BDBDBD"
        />
        <TouchableOpacity
          style={styles.iconWrapper}
          activeOpacity={0.7}
          onPress={createComment}
        >
          <Feather name="arrow-up" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 32,
    backgroundColor: "#ffffff",
  },
  commentInput: {
    position: "relative",
    height: 50,
    padding: 16,
    fontSize: 16,
    lineHeight: 19,
    backgroundColor: "#F6F6F6",
    color: "#212121",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 100,
  },
  iconWrapper: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: "#FF6C00",
  },
  commentContainer: {
    position: "relative",
    padding: 16,
    marginBottom: 24,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  currentUserComment: {
    marginRight: 44,
    alignSelf: "flex-end",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 0,
  },
  otherUserComment: {
    alignSelf: "flex-end",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 6,
  },
  avatarLeft: {
    position: "absolute",
    top: 0,
    left: -44,
    width: 28,
    height: 28,
    borderRadius: 15,
  },
  avatarRight: {
    position: "absolute",
    top: 0,
    right: -44,
    width: 28,
    height: 28,
    borderRadius: 15,
  },
});

export default CommentsScreen;

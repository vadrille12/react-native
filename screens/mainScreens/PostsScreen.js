import React from "react";
import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Feather } from "@expo/vector-icons";

import DefaultScreen from "../nestedScreens/DefaultPostsScreen";
import CommentsScreen from "../nestedScreens/CommentsScreen";
import MapScreen from "../nestedScreens/MapScreen";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/auth/authOperations";

const NestedScreen = createStackNavigator();

const PostScreen = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        options={{
          headerRight: ({ focused, color, size }) => (
            <TouchableOpacity onPress={handleLogout}>
              <Feather name="log-out" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          ),
          headerRightContainerStyle: {
            paddingRight: 16,
          },
        }}
        name="Публікації"
        component={DefaultScreen}
      />
      <NestedScreen.Screen
        name="Comments"
        options={{
          tabBarStyle: { display: "none" },
        }}
        component={CommentsScreen}
      />
      <NestedScreen.Screen name="Map" component={MapScreen} />
    </NestedScreen.Navigator>
  );
};

export default PostScreen;

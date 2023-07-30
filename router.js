import { TouchableOpacity } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// icons
import { Feather, Ionicons, AntDesign } from "@expo/vector-icons";

import RegistrationScreen from "./screens/auth/RegistrationScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import PostsScreen from "./screens/mainScreens/PostsScreen";
import CreatePostsScreen from "./screens/mainScreens/CreatePostsScreen";
import ProfileScreen from "./screens/mainScreens/ProfileScreen";

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

export const useRoute = (isAuth, navigation) => {
  if (!isAuth) {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          options={{ headerShown: false }}
          name="Registration"
          component={RegistrationScreen}
        />
        <AuthStack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
      </AuthStack.Navigator>
    );
  }
  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 71,
        },
      }}
    >
      <MainTab.Screen
        options={{
          headerShown: false,
          tabBarIconStyle: {
            marginVertical: 15,
          },
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons
              name="grid-outline"
              size={size}
              color={color}
              style={{
                backgroundColor: focused ? "#FF6C00" : "transparent",
                width: 70,
                paddingVertical: 8,
                paddingHorizontal: 22,
                borderRadius: 20,
              }}
            />
          ),
          tabBarActiveTintColor: "white",
          headerStyle: {
            borderBottomColor: "#E5E5E5",
            borderBottomWidth: 1,
          },
        }}
        name="Posts"
        component={PostsScreen}
      />
      <MainTab.Screen
        options={({ navigation }) => ({
          tabBarStyle: { display: "none" },
          tabBarIconStyle: {
            backgroundColor: "#FF6C00",
            width: 70,
            marginVertical: 15,
            borderRadius: 20,
          },
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name="add" size={size} color={"#fff"} />
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign
                name="arrowleft"
                focused="false"
                size={24}
                color="#212121"
              />
            </TouchableOpacity>
          ),
          headerLeftContainerStyle: {
            paddingLeft: 16,
          },
        })}
        name="Створити публікацію"
        component={CreatePostsScreen}
      />
      <MainTab.Screen
        options={{
          headerShown: false,
          tabBarIconStyle: {},
          tabBarIcon: ({ focused, size, color }) => (
            <Feather
              name="user"
              size={size}
              color={color}
              style={{
                backgroundColor: focused ? "#FF6C00" : "transparent",
                width: 70,
                paddingVertical: 8,
                paddingHorizontal: 22,
                borderRadius: 20,
              }}
            />
          ),
          tabBarActiveTintColor: "#fff",
        }}
        name="Профіль"
        component={ProfileScreen}
      />
    </MainTab.Navigator>
  );
};

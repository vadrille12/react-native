import { NavigationContainer } from "@react-navigation/native";

import { useRoute } from "./router";

export default function App() {
  const routing = useRoute(2);
  return <NavigationContainer>{routing}</NavigationContainer>;
}
